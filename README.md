# Xero Invoice Automation

Automates the full Xero **invoice → approve & email → record payment → send
receipt** workflow using [Playwright](https://playwright.dev/python/). It drives
a real Chromium window: you log in to Xero manually, click **OK** on an
in-browser popup, and the script does the rest.

This implements the visual workflow diagram exactly — all four phases plus the
error-handling and retry logic.

---

## What it does

| Phase | Actions |
|-------|---------|
| **1 – Authentication** | Opens the Xero login page, waits for **manual login**, then shows an in-browser **"Login completed? Click OK"** popup. |
| **2 – Invoice creation** | Waits 10 s for the homepage, presses **Alt+I**, fills Contact, Issue Date, Due Date (Central time), a random `INV-########` number, then creates a **New Item** (random 5-digit code, name from `Item name.txt`, random sale price `600.99–999.99`) and clicks **Approve & Email** → **Send**. |
| **3 – Payment & receipt (round 1)** | Sets the Record Payment **Account** to `4000 - Sale of Goods`, clicks **Record Payment**, then **Send Receipt** and fills the receipt email (To / Subject / Message) from the data files, with the **same amount** substituted in. |
| **4 – Payment & receipt (round 2)** | Clicks **Send Receipt** again and repeats the receipt-email process. |

Errors are caught per phase: each failure logs the error, saves a **screenshot**
to `screenshots/`, waits 5 s and retries — up to 3 times — then aborts with an
alert (mirrors the diagram's error-handling flow).

---

## Quick start

```bash
# Option A: one command (creates a venv, installs everything, runs)
./run.sh

# Option B: manual
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m playwright install chromium
python xero_automation.py
```

A Chromium window opens on the Xero login page. Log in, complete any 2FA, then
click the blue **OK** button that appears bottom-right. The automation continues
automatically.

> The browser profile is stored in `.xero_profile/` so you usually stay logged
> in between runs (it is git-ignored).

---

## Configuration

All settings live in [`config.py`](config.py). The most useful ones:

| Setting | Meaning |
|---------|---------|
| `SALE_PRICE_MIN` / `SALE_PRICE_MAX` | Random sale-price range (default `600.99`–`999.99`). |
| `INVOICE_PREFIX` / `INVOICE_RANDOM_DIGITS` | Invoice number, e.g. `INV-` + 8 digits. |
| `ITEM_CODE_DIGITS` | Random item code length (default 5). |
| `ACCOUNT_NAME` | Record-payment account (default `4000 - Sale of Goods`). |
| `TIMEZONE` / `DATE_FORMAT` | Date timezone (default `America/Chicago`) and typed format. |
| `DUE_DATE_OFFSET_DAYS` | Days between issue date and due date (default 0). |
| `*_SELECTION` | `"first"` or `"random"` line choice for each data file. |
| `HEADLESS` | Keep `False` — manual login needs a visible window. |
| `MAX_RETRIES` / `RETRY_WAIT` | Retry attempts and delay per step. |

> **Date format:** Xero's date fields accept typed dates. The default is
> `%d/%m/%Y` (e.g. `23/07/2026`). If your Xero org expects a different format
> (e.g. `%-d %b %Y` → `23 Jul 2026`), change `DATE_FORMAT`.

---

## Data files (`data/`)

Edit these — one value per line; lines starting with `#` are ignored.

| File | Used for |
|------|----------|
| `adminmaillist.txt` | Invoice **Contact** email. |
| `datalist.txt` | Receipt email **To** address. |
| `subjectlist.txt` | Receipt **Subject**. Use `{amount}` / `{currency}` placeholders. |
| `messagelist.txt` | Receipt **Message body**. Use `{amount}` / `{currency}`; separate multiple messages with a line containing only `---`. |
| `Item name.txt` | **New Item** name (e.g. `Norton`). |

**Amount consistency:** the random sale price generated in Phase 2 is reused in
the receipt subject and body wherever you put `{amount}` (and `{currency}` for
the symbol), so the emailed amount always matches the invoice.

---

## How it maps to the diagram

- **Keyboard-driven form navigation** matches the diagram's Tab counts exactly:
  - Invoice form: Tab×1 → Issue, ×2 → Due, ×3 → Invoice #, ×8 → Items.
  - Item popup: code → Tab×1 → Name → Tab×4 → Price → Tab×5 → Save.
  - Receipt popup: To → Tab×4 → Subject → Tab×1 → Message → Tab×2 → Enter.
- **Approve & Email** tries the button, then falls back to **Ctrl+Alt+E**.
- **Send Receipt** falls back to the AUTHORISED invoice
  [search URL](https://go.xero.com/AccountsReceivable/Search.aspx?invoiceStatus=INVOICESTATUS/AUTHORISED)
  if the notification link is not found.
- Only the **"Receipt has been sent"** toast is dismissed — the
  **"Payment Received"** section is left intact so round 2 can run.

---

## Notes & limitations

- Xero's DOM is not public and changes over time. The script uses resilient,
  text-based selectors with keyboard-navigation fallbacks, but if Xero changes
  its markup you may need to adjust the selectors in `xero_automation.py`
  (grouped in small helper functions near the top of each phase).
- This tool is for use **only** with a Xero account you are authorised to
  operate. Automating invoicing/receipts can send real emails and record real
  payments — test on a demo/trial organisation first.
- Run non-headless; the manual login step requires a visible browser.

---

## Project layout

```
.
├── xero_automation.py   # main automation (all 4 phases + retry/error handling)
├── config.py            # all tunable settings
├── requirements.txt
├── run.sh               # venv + install + run helper
├── data/
│   ├── adminmaillist.txt
│   ├── datalist.txt
│   ├── subjectlist.txt
│   ├── messagelist.txt
│   └── Item name.txt
└── screenshots/         # error + completion screenshots land here
```
