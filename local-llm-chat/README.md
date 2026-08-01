# Local Chat — run a chatbot on your own machine (no API key)

A complete, working terminal chat app that talks to a language model running
**locally on your computer**. No API key, no cloud, nothing leaves your machine.
It uses **[Ollama](https://ollama.com)** (free, open source) to run an open
model such as Llama, Qwen, or Mistral.

> **Why not Claude Fable 5 locally?** Claude / Fable 5 are Anthropic's
> proprietary models — the weights aren't public, so they can only run on
> Anthropic's servers via an API key. To run *fully local with no key*, this app
> uses an open model through Ollama instead. The chat experience is the same;
> the brain is a model you host yourself.

Zero Python dependencies — it uses only the standard library.

## Features

- 🔴 **Live streaming** of the model's answer, token by token.
- 💬 **Multi-turn memory** — full conversation history.
- 🔌 **Works with any local OpenAI-compatible server** — Ollama (default),
  LM Studio, or `llama.cpp`'s server — just change `LOCAL_BASE_URL`.
- 🧰 **Slash commands**: `/reset`, `/model`, `/system`, `/temp`, `/help`, `/exit`.
- 🩺 **Preflight checks** — tells you clearly if the server isn't running or the
  model isn't pulled yet.
- 🪶 **No dependencies, no API key, fully offline.**

## Quick start (with Ollama)

1. **Install Ollama** (one time):
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh      # macOS / Linux
   # or download from https://ollama.com/download (Windows/macOS)
   ```
2. **Run the app** — the script starts Ollama and pulls the model for you:
   ```bash
   cd local-llm-chat
   ./run.sh
   ```

That's it. On first run it downloads the model (`llama3.2`, ~2 GB), then drops
you into the chat.

### Manual start

```bash
ollama serve &            # start the local server
ollama pull llama3.2      # download a model (one time)
cd local-llm-chat
python3 -m local_chat     # no venv, no pip — stdlib only
```

## Usage

```
Local Chat  v1 · fully offline, no API key
Model: llama3.2   Server: http://127.0.0.1:11434/v1

You > Give me a one-line summary of how DNS works.

Assistant  DNS translates human-readable domain names into IP addresses...
           31 prompt / 24 completion tokens

You > /model qwen2.5
Model set to qwen2.5.

You > /exit
```

## Choosing a model

Pull any model Ollama supports, then select it with `/model` or `LOCAL_MODEL`:

| Model | Pull command | Notes |
|---|---|---|
| `llama3.2` | `ollama pull llama3.2` | Small & fast (default) |
| `llama3.1` | `ollama pull llama3.1` | Larger, stronger |
| `qwen2.5` | `ollama pull qwen2.5` | Strong all-rounder |
| `mistral` | `ollama pull mistral` | Fast 7B |
| `phi3` | `ollama pull phi3` | Tiny, runs on modest hardware |

Browse more at <https://ollama.com/library>.

## Configuration

All optional — set via environment variables or a `.env` file (see
`.env.example`):

| Variable | Default | Meaning |
|---|---|---|
| `LOCAL_BASE_URL` | `http://127.0.0.1:11434/v1` | Local server URL. |
| `LOCAL_MODEL` | `llama3.2` | Model to use. |
| `LOCAL_TEMPERATURE` | `0.7` | Sampling temperature (0.0–2.0). |
| `LOCAL_MAX_TOKENS` | `0` | Max reply tokens (`0` = server default). |
| `LOCAL_SYSTEM_PROMPT` | *(built-in)* | Persona / instructions. |
| `LOCAL_TIMEOUT` | `300` | Request timeout in seconds. |
| `LOCAL_API_KEY` | *(unset)* | Only for an authenticating proxy. |

### Using LM Studio or llama.cpp instead of Ollama

Both expose an OpenAI-compatible server. Just point the app at it:

```bash
# LM Studio (start its local server first)
LOCAL_BASE_URL=http://127.0.0.1:1234/v1 LOCAL_MODEL=your-model python3 -m local_chat

# llama.cpp server
LOCAL_BASE_URL=http://127.0.0.1:8080/v1 python3 -m local_chat
```

## Project layout

```
local-llm-chat/
├── README.md
├── .env.example
├── run.sh                 # installs/starts Ollama, pulls model, launches
├── local_chat/
│   ├── __init__.py
│   ├── __main__.py        # python -m local_chat
│   ├── config.py          # env-driven configuration
│   ├── client.py          # stdlib streaming client (OpenAI-compatible)
│   └── chat.py            # interactive REPL
└── tests/
    └── test_client.py     # offline tests incl. a mock streaming server
```

## Tests

```bash
python3 tests/test_client.py      # or: python -m pytest
```

The tests spin up an in-process mock server that speaks the streaming protocol,
so they verify the real client end-to-end without needing Ollama installed.

## Requirements

- Python 3.8+
- [Ollama](https://ollama.com) (or any OpenAI-compatible local server)
- No `pip install` — standard library only.

## License

MIT
