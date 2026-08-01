#!/usr/bin/env bash
# Launch the local chat. Checks that Ollama is installed and running, pulls the
# model if needed, then starts the app. No API key, nothing leaves your machine.
set -euo pipefail
cd "$(dirname "$0")"

# Load .env if present.
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

MODEL="${LOCAL_MODEL:-llama3.2}"
BASE_URL="${LOCAL_BASE_URL:-http://127.0.0.1:11434/v1}"

echo "Local Chat — model: $MODEL, server: $BASE_URL"

# Only do the Ollama bootstrap when we're pointed at the default Ollama port.
if [[ "$BASE_URL" == *"11434"* ]]; then
  if ! command -v ollama >/dev/null 2>&1; then
    echo
    echo "Ollama is not installed. Install it (free, offline):"
    echo "  macOS/Linux:  curl -fsSL https://ollama.com/install.sh | sh"
    echo "  or download:  https://ollama.com/download"
    echo
    echo "Then re-run ./run.sh"
    exit 1
  fi

  # Make sure the Ollama server is up.
  if ! curl -fsS "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1; then
    echo "Starting Ollama server in the background..."
    ollama serve >/tmp/ollama-serve.log 2>&1 &
    for _ in $(seq 1 30); do
      if curl -fsS "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1; then break; fi
      sleep 1
    done
  fi

  # Pull the model if it isn't present.
  if ! ollama list 2>/dev/null | awk '{print $1}' | grep -q "^${MODEL}\(:.*\)\?$"; then
    echo "Pulling model '$MODEL' (one-time download)..."
    ollama pull "$MODEL"
  fi
fi

# The app uses only the Python standard library — no pip install needed.
exec python3 -m local_chat
