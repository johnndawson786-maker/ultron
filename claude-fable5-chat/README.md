# Claude Fable 5 Chat

A complete, working terminal chat application powered by **Claude Fable 5**
(`claude-fable-5`) — Anthropic's most capable widely released model. It streams
responses token-by-token, keeps multi-turn conversation history, and correctly
handles the Fable 5 API contract (always-on thinking, effort control, and
server-side refusal fallbacks).

No frameworks, no external dependencies beyond the official `anthropic` SDK.

## Features

- 🔴 **Live streaming** of the model's answer as it's generated.
- 🧠 **Optional reasoning summaries** — stream a readable summary of the model's
  thinking (`FABLE5_SHOW_THINKING=true`). Fable 5 never returns the raw chain of
  thought; this shows the summary.
- 🎚️ **Effort control** — `low | medium | high | xhigh | max`, changeable live
  with `/effort`.
- 🛟 **Refusal fallback** — if Fable 5's safety classifiers decline a request,
  the API automatically retries on `claude-opus-4-8` in the same call.
- 💬 **Multi-turn memory** — full conversation history, with thinking blocks
  replayed correctly on the same model.
- 🧾 **Token usage** printed after each turn.
- ⌨️ **Slash commands**: `/reset`, `/effort`, `/system`, `/help`, `/exit`.

## Quick start

```bash
cd claude-fable5-chat
cp .env.example .env          # then edit .env and add your API key
./run.sh                      # sets up a venv, installs deps, launches the chat
```

Or manually:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python -m claude_fable5_chat
```

## Usage

```
Claude Fable 5 Chat  v1
You > Explain how a bloom filter works, briefly.

Fable  A bloom filter is a space-efficient probabilistic set...
       142 in / 210 out tokens

You > /effort max
Effort set to max.

You > /exit
```

## Configuration

Everything is set via environment variables (see `.env.example`):

| Variable | Default | Meaning |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Your Anthropic API key (or use `ant auth login`). |
| `FABLE5_MODEL` | `claude-fable-5` | Model ID. |
| `FABLE5_MAX_TOKENS` | `16000` | Max output tokens per reply (Fable 5 supports up to 128K). |
| `FABLE5_EFFORT` | `high` | Thinking depth / token spend. |
| `FABLE5_USE_FALLBACK` | `true` | Enable server-side refusal fallback. |
| `FABLE5_FALLBACK_MODEL` | `claude-opus-4-8` | Model to fall back to on a refusal. |
| `FABLE5_SHOW_THINKING` | `false` | Stream a summary of the model's reasoning. |
| `FABLE5_SYSTEM_PROMPT` | *(built-in)* | System prompt / persona. |

## How it works (Fable 5 specifics)

This app follows the documented Claude Fable 5 API contract:

- **Thinking is always on.** The code never sends `budget_tokens` or
  `thinking: {type: "disabled"}` — both return a 400 on Fable 5. Depth is
  controlled with `output_config.effort`.
- **The raw chain of thought is never returned.** With `display: "summarized"`
  you get a readable summary of the reasoning.
- **Refusals are a normal outcome.** A declined request returns HTTP 200 with
  `stop_reason == "refusal"`, so the code checks `stop_reason` before reading
  the text and opts into server-side fallbacks by default.
- **Long replies are streamed** to avoid HTTP timeouts.
- **Same-model continuation** passes the full response content (including
  thinking blocks) back unchanged on the next turn.

> **Note:** Claude Fable 5 requires 30-day data retention and is not available
> under zero-data-retention (ZDR) organizations — such requests return a 400.

## Project layout

```
claude-fable5-chat/
├── README.md
├── requirements.txt
├── .env.example
├── run.sh
├── claude_fable5_chat/
│   ├── __init__.py
│   ├── __main__.py        # entry point (python -m claude_fable5_chat)
│   ├── config.py          # env-driven configuration
│   ├── client.py          # Anthropic SDK wrapper, Fable 5 rules encoded here
│   └── chat.py            # interactive REPL
└── tests/
    └── test_config.py     # offline tests (no API key needed)
```

## Tests

```bash
python tests/test_config.py       # or: python -m pytest
```

These cover configuration parsing and run entirely offline.

## License

MIT
