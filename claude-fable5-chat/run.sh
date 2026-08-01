#!/usr/bin/env bash
# Set up a virtualenv, install deps, load .env, and launch the chat.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d .venv ]; then
  echo "Creating virtualenv..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate

pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

# Load .env if present (export every variable defined there).
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

exec python -m claude_fable5_chat
