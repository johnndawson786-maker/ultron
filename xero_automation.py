#!/usr/bin/env python3
"""
Xero Invoice Automation
=======================

Automates the full Xero invoice -> approve & email -> record payment ->
send receipt workflow described in the visual workflow diagram.

Phases
------
  1. Authentication  : open Xero login, wait for MANUAL login, confirm via popup
  2. Invoice creation: Alt+I, fill contact/dates/invoice#, create new item,
                       approve & email, send
  3. Payment/Receipt : record payment (4000 - Sale of Goods), send receipt (round 1)
  4. Payment/Receipt : send receipt (round 2)

Data is read from the files in data/ (see config.py). Random values
(invoice number, item code, sale price) are generated per run, and the sale
price is reused inside the receipt subject/message via the {amount} placeholder.

Usage
-----
    python xero_automation.py

Requirements
------------
    pip install -r requirements.txt
    playwright install chromium
"""

from __future__ import annotations

import random
import sys
import time
import traceback
from datetime import datetime, timedelta
from pathlib import Path
from typing import Callable, List, Optional

from zoneinfo import ZoneInfo

from playwright.sync_api import (
    Page,
    TimeoutError as PWTimeoutError,
    sync_playwright,
)

import config


# ==========================================================================
# Logging helpers
# ==========================================================================
def log(msg: str, level: str = "INFO") -> None:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] [{level}] {msg}", flush=True)


def banner(text: str) -> None:
    line = "=" * 74
    print(f"\n{line}\n  {text}\n{line}", flush=True)


# ==========================================================================
# Data loading
# ==========================================================================
def _read_lines(path: Path) -> List[str]:
    """Return non-empty, non-comment lines from a data file."""
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")
    lines: List[str] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            continue
        lines.append(stripped)
    if not lines:
        raise ValueError(f"No usable (non-comment) lines in {path}")
    return lines


def _select(lines: List[str], strategy: str) -> str:
    if strategy == "random":
        return random.choice(lines)
    return lines[0]


def load_messages(path: Path, strategy: str) -> str:
    """Message bodies may span multiple lines; blocks separated by '---'."""
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")
    text = path.read_text(encoding="utf-8")
    # Drop leading comment lines only.
    body_lines = []
    started = False
    for raw in text.splitlines():
        if not started and raw.strip().startswith("#"):
            continue
        started = True
        body_lines.append(raw)
    body = "\n".join(body_lines).strip()
    blocks = [b.strip() for b in body.split("\n---\n") if b.strip()]
    if not blocks:
        raise ValueError(f"No usable message blocks in {path}")
    if strategy == "random":
        return random.choice(blocks)
    return blocks[0]


# ==========================================================================
# Random / date generators
# ==========================================================================
def random_invoice_number() -> str:
    n = random.randint(10 ** (config.INVOICE_RANDOM_DIGITS - 1),
                        10 ** config.INVOICE_RANDOM_DIGITS - 1)
    return f"{config.INVOICE_PREFIX}{n}"


def random_item_code() -> str:
    n = random.randint(10 ** (config.ITEM_CODE_DIGITS - 1),
                       10 ** config.ITEM_CODE_DIGITS - 1)
    return str(n)


def random_sale_price() -> str:
    price = random.uniform(config.SALE_PRICE_MIN, config.SALE_PRICE_MAX)
    return f"{price:.2f}"


def central_dates() -> tuple[str, str]:
    """Return (issue_date, due_date) as strings in the configured format."""
    now = datetime.now(ZoneInfo(config.TIMEZONE))
    issue = now
    due = now + timedelta(days=config.DUE_DATE_OFFSET_DAYS)
    return issue.strftime(config.DATE_FORMAT), due.strftime(config.DATE_FORMAT)


# ==========================================================================
# Retry wrapper (implements the diagram's ERROR HANDLING FLOW)
# ==========================================================================
def with_retry(page: Page, step_name: str, fn: Callable[[], None]) -> None:
    """
    Run `fn`, retrying up to config.MAX_RETRIES times. On each failure log the
    error, take a screenshot, wait config.RETRY_WAIT seconds and retry. After
    MAX_RETRIES failures, alert the user and abort the automation.
    """
    attempt = 0
    while True:
        attempt += 1
        try:
            log(f"Step '{step_name}' (attempt {attempt}/{config.MAX_RETRIES})")
            fn()
            return
        except Exception as exc:  # noqa: BLE001 - we want to catch everything here
            shot = screenshot(page, f"error_{step_name}_attempt{attempt}")
            log(f"Step '{step_name}' failed: {exc}", level="ERROR")
            log(f"Screenshot saved: {shot}", level="ERROR")
            if attempt >= config.MAX_RETRIES:
                banner("AUTOMATION STOPPED - MAX RETRIES REACHED")
                log(f"Step '{step_name}' failed after {config.MAX_RETRIES} "
                    f"attempts. Aborting.", level="FATAL")
                traceback.print_exc()
                raise
            log(f"Retrying in {config.RETRY_WAIT}s ...", level="WARN")
            time.sleep(config.RETRY_WAIT)


def screenshot(page: Page, name: str) -> Path:
    config.SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = config.SCREENSHOT_DIR / f"{ts}_{name}.png"
    try:
        page.screenshot(path=str(path), full_page=True)
    except Exception:  # noqa: BLE001 - screenshotting must never crash the run
        pass
    return path


# ==========================================================================
# Low-level keyboard/typing helpers
# ==========================================================================
def type_text(page: Page, text: str) -> None:
    """Type into whatever element currently has focus."""
    page.keyboard.type(text, delay=config.TYPING_DELAY_MS)


def press(page: Page, key: str, times: int = 1, pause: float = 0.15) -> None:
    for _ in range(times):
        page.keyboard.press(key)
        time.sleep(pause)


def clear_focused_field(page: Page) -> None:
    """Select-all + delete on the currently focused field."""
    page.keyboard.press("Control+a")
    time.sleep(0.1)
    page.keyboard.press("Delete")
    time.sleep(0.1)


def wait(seconds: float, why: str = "") -> None:
    if why:
        log(f"Waiting {seconds}s ({why})")
    time.sleep(seconds)


# ==========================================================================
# PHASE 1 : AUTHENTICATION
# ==========================================================================
def phase1_authenticate(page: Page) -> None:
    banner("PHASE 1: AUTHENTICATION")

    log(f"Navigating to {config.LOGIN_URL}")
    page.goto(config.LOGIN_URL, wait_until="domcontentloaded")

    log("Waiting for MANUAL login. Please log in to Xero in the browser window.")
    wait_for_manual_login(page)
    log("Manual login confirmed. Proceeding with automation.")


def wait_for_manual_login(page: Page) -> None:
    """
    Show an in-browser overlay with an OK button ("Login completed? Click OK
    to proceed with automation.") and block until the user clicks it.

    Falls back to a terminal prompt if the overlay cannot be injected.
    """
    overlay_js = r"""
    () => {
        if (document.getElementById('__xero_auto_overlay__')) return;
        const wrap = document.createElement('div');
        wrap.id = '__xero_auto_overlay__';
        Object.assign(wrap.style, {
            position: 'fixed', right: '20px', bottom: '20px', zIndex: 2147483647,
            background: '#ffffff', border: '2px solid #13b5ea', borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)', padding: '18px 20px',
            fontFamily: 'Arial, sans-serif', maxWidth: '320px', color: '#222'
        });
        wrap.innerHTML =
            '<div style="font-weight:bold;margin-bottom:8px;">Xero Automation</div>' +
            '<div style="font-size:14px;margin-bottom:14px;">Login completed? ' +
            'Click OK to proceed with automation.</div>';
        const btn = document.createElement('button');
        btn.textContent = 'OK';
        Object.assign(btn.style, {
            background: '#13b5ea', color: '#fff', border: 'none', borderRadius: '6px',
            padding: '8px 22px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold'
        });
        btn.onclick = () => { window.__xeroLoginConfirmed = true; wrap.remove(); };
        wrap.appendChild(btn);
        document.body.appendChild(wrap);
        window.__xeroLoginConfirmed = false;
    }
    """
    try:
        page.evaluate("window.__xeroLoginConfirmed = false")
        page.evaluate(overlay_js)
        log("Overlay shown. Click the OK button in the browser once logged in.")
        # Poll for the confirmation flag; re-inject overlay across navigations.
        while True:
            try:
                confirmed = page.evaluate("window.__xeroLoginConfirmed === true")
            except Exception:  # noqa: BLE001 - page navigated; re-inject overlay
                confirmed = False
            if confirmed:
                return
            # Re-inject if the overlay was lost to a navigation.
            try:
                exists = page.evaluate(
                    "!!document.getElementById('__xero_auto_overlay__')"
                )
                if not exists:
                    page.evaluate(overlay_js)
            except Exception:  # noqa: BLE001
                pass
            time.sleep(0.5)
    except Exception:  # noqa: BLE001 - fall back to terminal confirmation
        log("Could not show in-browser popup; using terminal prompt instead.",
            level="WARN")
        input(">>> Finish logging in, then press ENTER here to continue... ")


# ==========================================================================
# PHASE 2 : INVOICE CREATION
# ==========================================================================
def phase2_create_invoice(page: Page, ctx: "RunContext") -> None:
    banner("PHASE 2: INVOICE CREATION")

    wait(config.HOMEPAGE_LOAD_WAIT, "let the Xero homepage load fully")

    # Open the New Invoice screen via the Xero shortcut Alt+I.
    log("Pressing Alt+I to open a new invoice")
    page.keyboard.press("Alt+i")
    wait(config.AFTER_ALT_I_WAIT, "wait for the invoice form to open")

    # The cursor default position is the Contact field.
    log(f"Entering contact: {ctx.contact_email}")
    fill_contact(page, ctx.contact_email)

    # Tab #1 -> Issue Date
    press(page, "Tab")
    log(f"Entering issue date: {ctx.issue_date}")
    clear_focused_field(page)
    type_text(page, ctx.issue_date)

    # Tab #2 -> Due Date
    press(page, "Tab")
    log(f"Entering due date: {ctx.due_date}")
    clear_focused_field(page)
    type_text(page, ctx.due_date)

    # Tab #3 -> Invoice #
    press(page, "Tab")
    log(f"Entering invoice number: {ctx.invoice_number}")
    clear_focused_field(page)
    type_text(page, ctx.invoice_number)

    # Tab x8 -> Item section, open dropdown, choose "Create New Item"
    log("Tabbing 8 times to reach the Item section")
    press(page, "Tab", times=8)
    open_create_new_item(page)

    # New Item popup
    fill_new_item_popup(page, ctx)

    # Approve & Email
    approve_and_email(page)

    # Send
    click_send(page)


def fill_contact(page: Page, email: str) -> None:
    """
    Type the contact email into the focused Contact field, wait for the
    autocomplete dropdown, and select the matching entry.
    """
    # Field should already be focused (cursor default position). Clear first.
    clear_focused_field(page)
    type_text(page, email)
    wait(config.DROPDOWN_WAIT, "contact autocomplete dropdown")

    # Try to click the matching option; otherwise fall back to keyboard select.
    selected = False
    try:
        option = page.get_by_text(email, exact=False).first
        option.wait_for(state="visible", timeout=4000)
        option.click()
        selected = True
    except Exception:  # noqa: BLE001 - fall back to keyboard selection
        pass
    if not selected:
        # Highlight first suggestion and confirm.
        page.keyboard.press("ArrowDown")
        time.sleep(0.2)
        page.keyboard.press("Enter")


def open_create_new_item(page: Page) -> None:
    """Open the item dropdown and pick 'Create New Item'."""
    wait(config.SHORT_PAUSE, "item field focus")
    # Opening the dropdown: type a char or press down to reveal options.
    try:
        page.keyboard.press("ArrowDown")
        time.sleep(0.4)
        option = page.get_by_text("Create New Item", exact=False).first
        option.wait_for(state="visible", timeout=4000)
        option.click()
        log("Selected 'Create New Item'")
    except Exception:  # noqa: BLE001 - fall back: type then Enter
        log("Falling back to typing 'New Item' to open the popup", level="WARN")
        type_text(page, "New Item")
        time.sleep(0.5)
        page.keyboard.press("Enter")


def fill_new_item_popup(page: Page, ctx: "RunContext") -> None:
    banner("NEW ITEM POPUP")
    wait(config.DROPDOWN_WAIT, "new item popup to render")

    # Cursor -> Code
    log(f"Item code: {ctx.item_code}")
    type_text(page, ctx.item_code)

    # Tab #1 -> Name
    press(page, "Tab")
    log(f"Item name: {ctx.item_name}")
    type_text(page, ctx.item_name)

    # Tab x4 -> Sale Price
    press(page, "Tab", times=4)
    log(f"Sale price: {ctx.sale_price}")
    clear_focused_field(page)
    type_text(page, ctx.sale_price)

    # Tab x5 -> Save button, then activate it.
    press(page, "Tab", times=5)
    log("Saving new item")
    # Prefer clicking an explicit Save button if present, else press Enter/Space.
    if not try_click(page, ["button:has-text('Save')",
                            "text=Save"], timeout=3000):
        page.keyboard.press("Enter")
    wait(config.DROPDOWN_WAIT, "item to save and popup to close")


def approve_and_email(page: Page) -> None:
    banner("APPROVE & EMAIL")
    # Try the button first, then fall back to the Ctrl+Alt+E shortcut.
    if not try_click(page, [
        "button:has-text('Approve & Email')",
        "text=Approve & Email",
    ], timeout=5000):
        log("Approve & Email button not found; using Ctrl+Alt+E", level="WARN")
        page.keyboard.press("Control+Alt+e")
    wait(config.DROPDOWN_WAIT, "email dialog to appear")


def click_send(page: Page) -> None:
    log("Clicking Send")
    if not try_click(page, [
        "button:has-text('Send')",
        "text=Send",
    ], timeout=8000):
        log("Send button not found via selectors; pressing Enter", level="WARN")
        page.keyboard.press("Enter")
    wait(config.DROPDOWN_WAIT, "invoice to send and next page to load")


# ==========================================================================
# PHASE 3 & 4 : PAYMENT & RECEIPT
# ==========================================================================
def phase3_payment_and_receipt(page: Page, ctx: "RunContext") -> None:
    banner("PHASE 3: PAYMENT & RECEIPT (ROUND 1)")

    record_payment(page, ctx)
    send_receipt(page, ctx, round_no=1)


def phase4_second_receipt(page: Page, ctx: "RunContext") -> None:
    banner("PHASE 4: PAYMENT & RECEIPT (ROUND 2)")
    # Payment already recorded; just click the "Send Receipt" link again.
    click_send_receipt_link(page)
    fill_receipt_popup(page, ctx, round_no=2)


def record_payment(page: Page, ctx: "RunContext") -> None:
    log("Locating the Record Payment section")
    wait(config.DROPDOWN_WAIT, "new page (invoice sent) to load")

    # Find the Account dropdown within the record-payment area and set it.
    log(f"Setting payment account: {config.ACCOUNT_NAME}")
    account_set = set_record_payment_account(page, config.ACCOUNT_NAME)
    if not account_set:
        raise RuntimeError("Could not set the Record Payment 'Account' field")

    log("Clicking 'Record Payment'")
    if not try_click(page, [
        "button:has-text('Record Payment')",
        ".ac-record-payment-header button",
        "text=Record Payment",
    ], timeout=8000):
        raise RuntimeError("Could not click the 'Record Payment' button")
    wait(config.DROPDOWN_WAIT, "payment to record and notification to appear")


def set_record_payment_account(page: Page, account: str) -> bool:
    """
    Locate the Account field inside the Record Payment section
    (class 'ac-record-payment-header' area) and select the account.
    """
    # Candidate selectors for the account input within the record-payment block.
    candidates = [
        ".ac-record-payment-header input[placeholder*='Account' i]",
        "input[placeholder*='Account' i]",
        ".ac-record-payment-header input[type='text']",
    ]
    for sel in candidates:
        try:
            el = page.locator(sel).first
            el.wait_for(state="visible", timeout=3000)
            el.click()
            el.fill("")
            el.type(account, delay=config.TYPING_DELAY_MS)
            wait(config.DROPDOWN_WAIT, "account autocomplete dropdown")
            # Select the matching option, else confirm with Enter.
            if not try_click(page, [f"text={account}"], timeout=3000):
                page.keyboard.press("ArrowDown")
                time.sleep(0.2)
                page.keyboard.press("Enter")
            return True
        except Exception:  # noqa: BLE001 - try the next candidate selector
            continue
    return False


def send_receipt(page: Page, ctx: "RunContext", round_no: int) -> None:
    click_send_receipt_link(page)
    fill_receipt_popup(page, ctx, round_no=round_no)


def click_send_receipt_link(page: Page) -> None:
    """
    Click the green-notification 'Send Receipt' link. If it cannot be found,
    fall back to the AUTHORISED invoice search URL.
    """
    log("Looking for the 'Send Receipt' link")
    if try_click(page, [
        "a:has-text('Send Receipt')",
        "button:has-text('Send Receipt')",
        "text=Send Receipt",
    ], timeout=8000):
        wait(config.DROPDOWN_WAIT, "receipt email popup to open")
        return

    log("'Send Receipt' link not found; navigating to invoice search URL",
        level="WARN")
    page.goto(config.INVOICE_SEARCH_URL, wait_until="domcontentloaded")
    wait(config.DROPDOWN_WAIT, "invoice search page to load")
    if not try_click(page, [
        "a:has-text('Send Receipt')",
        "text=Send Receipt",
    ], timeout=8000):
        raise RuntimeError("Could not find 'Send Receipt' even via search URL")
    wait(config.DROPDOWN_WAIT, "receipt email popup to open")


def fill_receipt_popup(page: Page, ctx: "RunContext", round_no: int) -> None:
    banner(f"RECEIPT EMAIL POPUP (ROUND {round_no})")
    wait(config.DROPDOWN_WAIT, "receipt email popup fields to render")

    # Focus the "To" email field. Prefer an explicit locator, else assume focus.
    focused = focus_receipt_email_field(page)
    if not focused:
        log("Could not explicitly focus 'To' field; assuming default focus",
            level="WARN")

    # TO: Ctrl+A -> clear -> input from datalist
    log(f"Receipt To: {ctx.recipient_email}")
    clear_focused_field(page)
    type_text(page, ctx.recipient_email)

    # Tab x4 -> Subject
    press(page, "Tab", times=4)
    log(f"Receipt Subject: {ctx.subject}")
    clear_focused_field(page)
    type_text(page, ctx.subject)

    # Tab #1 -> Message body
    press(page, "Tab")
    log("Receipt Message body")
    clear_focused_field(page)
    type_text(page, ctx.message)

    # Tab x2 -> Press ENTER to send
    press(page, "Tab", times=2)
    log("Pressing ENTER to send the receipt")
    page.keyboard.press("Enter")
    wait(config.DROPDOWN_WAIT, "receipt to send and confirmation to appear")

    # Dismiss the "Receipt has been sent to..." notification (click the ×),
    # but DO NOT dismiss the "Payment Received" section.
    dismiss_receipt_sent_notification(page)


def focus_receipt_email_field(page: Page) -> bool:
    candidates = [
        "input[placeholder*='email' i]",
        "input[type='email']",
        "input[name*='To' i]",
        "textarea[name*='To' i]",
    ]
    for sel in candidates:
        try:
            el = page.locator(sel).first
            el.wait_for(state="visible", timeout=3000)
            el.click()
            return True
        except Exception:  # noqa: BLE001 - try the next candidate
            continue
    return False


def dismiss_receipt_sent_notification(page: Page) -> None:
    """Click the × on the 'Receipt has been sent to...' toast only."""
    log("Dismissing the 'Receipt has been sent' notification")
    try_click(page, [
        "[aria-label='Close']",
        "button.close",
        ".xnc-notification .close",
        "text=×",
    ], timeout=4000)
    wait(config.SHORT_PAUSE, "notification dismissed")


# ==========================================================================
# Generic click helper
# ==========================================================================
def try_click(page: Page, selectors: List[str], timeout: int = 5000) -> bool:
    """
    Try each selector in order; click the first visible match. Returns True on
    success, False if none matched within the timeout budget.
    """
    per_selector = max(1000, timeout // max(1, len(selectors)))
    for sel in selectors:
        try:
            el = page.locator(sel).first
            el.wait_for(state="visible", timeout=per_selector)
            el.click()
            return True
        except Exception:  # noqa: BLE001 - try the next selector
            continue
    return False


# ==========================================================================
# Run context (all per-run values in one place)
# ==========================================================================
class RunContext:
    def __init__(self) -> None:
        # Data-file driven
        self.contact_email = _select(
            _read_lines(config.ADMIN_MAIL_LIST), config.CONTACT_SELECTION)
        self.recipient_email = _select(
            _read_lines(config.DATA_LIST), config.RECIPIENT_SELECTION)
        self.item_name = _select(
            _read_lines(config.ITEM_NAME_LIST), config.ITEM_NAME_SELECTION)

        # Random / generated
        self.invoice_number = random_invoice_number()
        self.item_code = random_item_code()
        self.sale_price = random_sale_price()          # e.g. "812.44"
        self.issue_date, self.due_date = central_dates()

        # Subject/message with the SAME amount substituted in.
        subj_tpl = _select(
            _read_lines(config.SUBJECT_LIST), config.SUBJECT_SELECTION)
        msg_tpl = load_messages(config.MESSAGE_LIST, config.MESSAGE_SELECTION)
        self.subject = self._fill(subj_tpl)
        self.message = self._fill(msg_tpl)

    def _fill(self, template: str) -> str:
        return (template
                .replace("{amount}", self.sale_price)
                .replace("{currency}", config.CURRENCY_SYMBOL))

    def summary(self) -> str:
        return (
            "Run configuration:\n"
            f"  Contact email : {self.contact_email}\n"
            f"  Recipient     : {self.recipient_email}\n"
            f"  Item name     : {self.item_name}\n"
            f"  Item code     : {self.item_code}\n"
            f"  Invoice number: {self.invoice_number}\n"
            f"  Sale price    : {config.CURRENCY_SYMBOL}{self.sale_price}\n"
            f"  Issue date    : {self.issue_date}\n"
            f"  Due date      : {self.due_date}\n"
            f"  Subject       : {self.subject}\n"
        )


# ==========================================================================
# Main
# ==========================================================================
def run() -> int:
    banner("XERO AUTOMATION - COMPLETE FLOW")

    try:
        ctx = RunContext()
    except (FileNotFoundError, ValueError) as exc:
        log(f"Configuration/data error: {exc}", level="FATAL")
        return 2

    log(ctx.summary())

    with sync_playwright() as p:
        config.USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(config.USER_DATA_DIR),
            headless=config.HEADLESS,
            slow_mo=config.SLOW_MO_MS,
            args=["--start-maximized"],
            no_viewport=True,
        )
        context.set_default_timeout(config.ACTION_TIMEOUT_MS)
        page = context.pages[0] if context.pages else context.new_page()

        try:
            # PHASE 1
            phase1_authenticate(page)

            # PHASE 2
            with_retry(page, "phase2_create_invoice",
                       lambda: phase2_create_invoice(page, ctx))

            # PHASE 3
            with_retry(page, "phase3_payment_and_receipt",
                       lambda: phase3_payment_and_receipt(page, ctx))

            # PHASE 4
            with_retry(page, "phase4_second_receipt",
                       lambda: phase4_second_receipt(page, ctx))

            banner("PROCESS COMPLETE ✅")
            screenshot(page, "process_complete")
            return 0

        except Exception:  # noqa: BLE001 - top-level guard: report and exit
            banner("AUTOMATION ABORTED")
            screenshot(page, "aborted")
            traceback.print_exc()
            return 1
        finally:
            # Give the user a moment to see the final state before closing.
            wait(config.SHORT_PAUSE, "final settle")
            context.close()


if __name__ == "__main__":
    sys.exit(run())
