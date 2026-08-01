#!/usr/bin/env bash
# Bootstrap Ollama (local, no API key), then run cyber-mentor.
# Usage:
#   ./run.sh            # train the model until ready, then print the report
#   ./run.sh train -v   # verbose training
#   ./run.sh chat       # chat with the mentor
#   ./run.sh ask "..."  # one-shot question
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

MODEL="${CYBER_MODEL:-llama3.1}"
BASE_URL="${CYBER_BASE_URL:-http://127.0.0.1:11434/v1}"

if [[ "$BASE_URL" == *"11434"* ]]; then
  if ! command -v ollama >/dev/null 2>&1; then
    echo "Ollama is not installed (free, offline). Install it:"
    echo "  curl -fsSL https://ollama.com/install.sh | sh"
    echo "  or https://ollama.com/download"
    exit 1
  fi
  if ! curl -fsS "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1; then
    echo "Starting Ollama..."
    ollama serve >/tmp/ollama-serve.log 2>&1 &
    for _ in $(seq 1 30); do
      curl -fsS "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1 && break
      sleep 1
    done
  fi
  if ! ollama list 2>/dev/null | awk '{print $1}' | grep -q "^${MODEL}\(:.*\)\?$"; then
    echo "Pulling model '$MODEL' (one-time download)..."
    ollama pull "$MODEL"
  fi
fi

# Standard library only — no pip install. Default subcommand is "train".
if [ "$#" -eq 0 ]; then
  exec python3 -m cyber_mentor train
else
  exec python3 -m cyber_mentor "$@"
fi
