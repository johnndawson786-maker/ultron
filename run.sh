#!/usr/bin/env bash
# Convenience launcher for the Xero Invoice Automation.
# Creates a virtualenv on first run, installs deps + Chromium, then runs.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
  echo "==> Creating virtualenv (.venv)"
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate

echo "==> Installing dependencies"
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo "==> Ensuring Chromium is installed for Playwright"
python -m playwright install chromium

echo "==> Running Xero automation"
python xero_automation.py
