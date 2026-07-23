"""
Configuration for the Xero Invoice Automation.

Every tunable value lives here so you never have to touch the automation
logic in xero_automation.py. Edit these settings, drop your data into the
files under data/, and run `python xero_automation.py`.
"""

from pathlib import Path

# --------------------------------------------------------------------------
# Paths
# --------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SCREENSHOT_DIR = BASE_DIR / "screenshots"

# Data files (referenced by the workflow diagram)
ADMIN_MAIL_LIST = DATA_DIR / "adminmaillist.txt"   # -> Invoice Contact field
DATA_LIST = DATA_DIR / "datalist.txt"              # -> Receipt "To" field
SUBJECT_LIST = DATA_DIR / "subjectlist.txt"        # -> Receipt Subject
MESSAGE_LIST = DATA_DIR / "messagelist.txt"        # -> Receipt Body
ITEM_NAME_LIST = DATA_DIR / "Item name.txt"        # -> New Item Name field

# --------------------------------------------------------------------------
# URLs
# --------------------------------------------------------------------------
LOGIN_URL = "https://login.xero.com/identity/user/login"
# Fallback search URL used in Phase 3 if the "Send Receipt" link cannot be found.
INVOICE_SEARCH_URL = (
    "https://go.xero.com/AccountsReceivable/Search.aspx"
    "?invoiceStatus=INVOICESTATUS/AUTHORISED"
)

# --------------------------------------------------------------------------
# Selection strategy for list-based data
#   "first"  -> always use the first non-comment line
#   "random" -> pick a random line each run
# --------------------------------------------------------------------------
CONTACT_SELECTION = "first"       # from adminmaillist.txt
RECIPIENT_SELECTION = "first"     # from datalist.txt
SUBJECT_SELECTION = "first"       # from subjectlist.txt
MESSAGE_SELECTION = "first"       # from messagelist.txt
ITEM_NAME_SELECTION = "first"     # from Item name.txt

# --------------------------------------------------------------------------
# Invoice values
# --------------------------------------------------------------------------
INVOICE_PREFIX = "INV-"           # Invoice number prefix
INVOICE_RANDOM_DIGITS = 8         # e.g. INV-84729105

ITEM_CODE_DIGITS = 5              # random 5-digit item code

SALE_PRICE_MIN = 600.99          # inclusive lower bound
SALE_PRICE_MAX = 999.99          # inclusive upper bound

ACCOUNT_NAME = "4000 - Sale of Goods"   # Record Payment account
CURRENCY_SYMBOL = "$"             # used in subject/message {currency} placeholder

# --------------------------------------------------------------------------
# Dates
# --------------------------------------------------------------------------
# Timezone for the Issue Date and Due Date (Central time as per the diagram).
TIMEZONE = "America/Chicago"
# strftime format typed into the Xero date fields.
# Common accepted formats: "%d/%m/%Y" (31/07/2026) or "%-d %b %Y" (31 Jul 2026).
DATE_FORMAT = "%d/%m/%Y"
# Days added to the issue date to compute the due date (0 = same day).
DUE_DATE_OFFSET_DAYS = 0

# --------------------------------------------------------------------------
# Timing (seconds)
# --------------------------------------------------------------------------
HOMEPAGE_LOAD_WAIT = 10           # Phase 2: wait for homepage to load
AFTER_ALT_I_WAIT = 3              # Phase 2: wait after pressing Alt+I
SHORT_PAUSE = 1.0                 # generic small settle pause
TYPING_DELAY_MS = 40              # per-key delay when typing (human-like)
DROPDOWN_WAIT = 2.0               # wait for autocomplete dropdowns to render

# --------------------------------------------------------------------------
# Error handling / retries
# --------------------------------------------------------------------------
MAX_RETRIES = 3                   # per-step retry attempts (diagram: Retry < 3)
RETRY_WAIT = 5                    # seconds to wait before retrying a step

# --------------------------------------------------------------------------
# Browser
# --------------------------------------------------------------------------
# Headed is required for the manual-login step.
HEADLESS = False
# Persist the browser profile so you stay logged in between runs.
USER_DATA_DIR = BASE_DIR / ".xero_profile"
# Slow every Playwright action by this many ms (0 = full speed). Helpful for debugging.
SLOW_MO_MS = 0
# Default per-action timeout (ms).
ACTION_TIMEOUT_MS = 30000
