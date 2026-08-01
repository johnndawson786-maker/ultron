#!/usr/bin/env bash
# Operator launcher. Bootstraps a local model server (Ollama) if you're using
# one, then forwards all arguments to the agent.
#
#   ./run.sh sysinfo
#   ./run.sh learn "web cache poisoning" --minutes 20
#   ./run.sh task "summarise the running services on this box and flag risky ones"
#   ./run.sh recon "teach me how to find IDOR bugs and practice safely"
#   ./run.sh chat
#
# Tip: add an alias so you can just type `operator ...`:
#   echo "alias operator='$(pwd)/run.sh'" >> ~/.bashrc && source ~/.bashrc
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

BASE_URL="${OPERATOR_BASE_URL:-http://127.0.0.1:11434/v1}"
MODEL="${OPERATOR_MODEL:-llama3.1}"

# Bootstrap Ollama only when pointed at it and no external API key is set.
if [[ "$BASE_URL" == *"11434"* && -z "${OPERATOR_API_KEY:-}" ]]; then
  if ! command -v ollama >/dev/null 2>&1; then
    echo "Ollama not installed (free, local). Install:"
    echo "  curl -fsSL https://ollama.com/install.sh | sh"
    echo "Then re-run. (Or point OPERATOR_BASE_URL/OPERATOR_API_KEY at another model.)"
    exit 1
  fi
  if ! curl -fsS "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1; then
    echo "Starting Ollama..." >&2
    ollama serve >/tmp/ollama-serve.log 2>&1 &
    for _ in $(seq 1 30); do
      curl -fsS "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1 && break
      sleep 1
    done
  fi
  if ! ollama list 2>/dev/null | awk '{print $1}' | grep -q "^${MODEL}\(:.*\)\?$"; then
    echo "Pulling model '$MODEL' (one-time)..." >&2
    ollama pull "$MODEL"
  fi
fi

# Standard library only — no pip install.
if [ "$#" -eq 0 ]; then
  exec python3 -m operator_agent sysinfo
else
  exec python3 -m operator_agent "$@"
fi
