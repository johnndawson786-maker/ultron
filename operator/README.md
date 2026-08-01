# Operator — an autonomous AI agent for your Ubuntu VPS

Not a chatbot. Operator runs a real **goal → plan → act → observe → reflect**
loop with tools: it searches and reads the web, runs shell commands (with your
approval), reads/writes files, remembers what it learns, and fingerprints your
box. It can **research a topic in a time budget and build a knowledge base**,
**mentor you through bug-bounty methodology** on authorized scope, and **guide
you step by step**.

Runs on your VPS with **local Ollama (no API key)** by default, or any
OpenAI-compatible API. **Zero Python dependencies** — standard library only.

---

## Straight talk about what this is (and isn't)

- ✅ **It genuinely learns your topics** — by researching and saving durable
  notes/memory it retrieves later. Its knowledge of what *you* care about grows
  across runs.
- ✅ **It acts** — real tools, real shell, real files, on your VPS.
- ❌ **It does not rewrite its own brain.** Changing model weights is
  fine-tuning (GPUs, datasets, hours) — impossible from a script. The "learning"
  here is a persistent knowledge base + memory, which is the practical,
  runnable version.
- ❌ **"See my desktop"** doesn't apply to a headless VPS — there's no screen.
  Here "seeing" = reading command output, files, logs, and fetched web pages.
- 🔒 **Bug bounty = authorized hacking.** Active scanning is **enabled**, but it
  only ever touches hosts in your **scope allowlist** (empty until you add
  targets). Passive OSINT (Certificate Transparency, DNS) works on any domain.
  Staying in scope is what keeps this legal — that guardrail is built in and not
  optional.
- 🤖 **It runs fully autonomously by default** (acts without asking) — and
  **records everything** it does. Run `operator log` any time to see exactly
  which tools and commands it ran and what came back. That accountability is the
  trade-off that makes full autonomy safe to use.

---

## Quick start

```bash
# 1. Install Ollama once (free, local):
curl -fsSL https://ollama.com/install.sh | sh

# 2. Make Operator convenient:
cd operator
chmod +x run.sh
echo "alias operator='$(pwd)/run.sh'" >> ~/.bashrc && source ~/.bashrc

# 3. Use it:
operator sysinfo
operator learn "web cache poisoning" --minutes 20
operator task "list running services on this box and flag anything risky"
operator recon "teach me to find IDOR bugs and how to practice safely"
operator chat
```

(No alias? Just use `./run.sh <command>`.)

---

## What it can do

### `sysinfo` — know your VPS
Reports OS, CPU, memory, disk, and which security/dev tools are installed. The
agent uses this to tailor its guidance to your actual box.

### `learn "<topic>" --minutes N` — study on a timer
Researches the topic on the internet within the time budget, then writes a
structured **knowledge-base note** (Overview / Key concepts / Practical steps /
Pitfalls / Sources) **plus a self-check quiz**, saved under `~/.operator/kb/`.
Later runs `recall` this automatically.

```bash
operator learn "SSRF and cloud metadata" --minutes 15
operator notes list
operator notes show "SSRF and cloud metadata"
```

### `task "<goal>"` — do something agentic
Runs the full loop with approval-gated tools. Example goals: audit a config,
summarise logs, set up a tool, research-and-write a script.

### `recon "<goal>"` — bug-bounty mentor
Teaches vulnerability classes and methodology and does real **passive recon** out
of the box: the built-in `passive_recon` tool pulls subdomains from Certificate
Transparency (crt.sh) and resolves DNS for any domain — pure OSINT, no attack
traffic. Active scanners (nmap/nuclei/…) run only against hosts in your scope
allowlist. It always explains the *why*: how to spot a bug, confirm it safely,
report it, and how it's fixed — so you actually build the skill.

```bash
operator recon "passive recon on example.com and teach me what the subdomains reveal"
```

### `chat` — step-by-step guidance
Conversational mentor with the Operator mindset for quick "what do I do next?"
help.

### `idle` — curiosity loop
Works a backlog of topics you leave for it, learning each one and saving notes.

```bash
printf "http request smuggling\njwt attacks\nprototype pollution\n" > ~/.operator/backlog.txt
operator idle --minutes 15
```

---

## Autonomy levels (safety)

Set `OPERATOR_AUTONOMY`:

| Level | Behavior |
|---|---|
| `auto` *(default)* | Runs without prompting. Everything is journaled — see it with `operator log`. |
| `approval` | Asks before every shell command / file write. Maximum control. |
| `semi` | Read-only research runs freely; still asks before shell/writes. |

**See what it did:** because `auto` acts on its own, every task, tool call,
command, and result is written to `~/.operator/activity.jsonl`.

```bash
operator log              # full activity, most recent last
operator log --last 10    # just the last 10 entries
```

Always-on protections regardless of level:
- **Destructive commands are hard-blocked** (`rm -rf /`, fork bombs, disk wipes,
  `curl | sh`, shutdown, …).
- **Active-scan tools** (nmap, nuclei, sqlmap, ffuf, …) are refused unless
  `OPERATOR_ALLOW_ACTIVE_TESTING=true` **and** the target is in your scope
  allowlist.

### Authorizing targets for active testing

```bash
operator scope add yourprogram.example.com     # only hosts you may test
operator scope list
# active testing is already enabled; the scope entry is what unlocks it:
operator recon "recon api.yourprogram.example.com"
```

To turn active testing fully off (mentor + passive OSINT only), set
`OPERATOR_ALLOW_ACTIVE_TESTING=false`.

---

## Configuration

See `.env.example`. Key variables: `OPERATOR_MODEL`, `OPERATOR_BASE_URL`,
`OPERATOR_API_KEY` (to use a stronger cloud model), `OPERATOR_AUTONOMY`,
`OPERATOR_ALLOW_ACTIVE_TESTING`, `OPERATOR_MAX_STEPS`, `OPERATOR_BUDGET_SECONDS`,
`OPERATOR_DATA_DIR`.

**Stronger brain:** local `llama3.1` is fine for learning/mentoring, but real
vuln reasoning improves a lot with a bigger model — pull `qwen2.5:14b`, or set
`OPERATOR_API_KEY` + `OPERATOR_MODEL=gpt-4o-mini` (or any OpenAI-compatible
endpoint).

---

## How it works

```
        ┌───────── system prompt (mindset + tool list) ─────────┐
goal ──►│  model emits ONE JSON action:                         │
        │    {"thought":..., "action":"web_search", "args":{…}} │
        │                     │                                  │
        │           run tool (gated by safety)                  │
        │                     │                                  │
        │           observation ──► fed back ──► next action    │
        └───────────────── until "finish" or budget ────────────┘
```

The JSON-action protocol works with small local models; a robust parser
tolerates the stray prose they sometimes add.

## Project layout

```
operator/
├── README.md
├── .env.example
├── run.sh
├── operator_agent/
│   ├── __main__.py     # CLI: sysinfo/task/learn/recon/chat/idle/scope/notes
│   ├── config.py
│   ├── llm.py          # pluggable local/OpenAI-compatible client
│   ├── agent.py        # the plan→act→observe loop + JSON action parser
│   ├── tools.py        # web_search/web_read/shell/files/memory/passive_recon/sysinfo
│   ├── safety.py       # destructive-command block, approval, scope allowlist
│   ├── memory.py       # persistent facts + knowledge-base notes
│   ├── journal.py      # activity log — the "what did you do" record
│   ├── prompts.py      # operator / learn / recon mindsets
│   └── learn.py        # research-in-a-time-budget → note + quiz
└── tests/
    └── test_operator.py   # 15 offline tests (fake model drives the loop)
```

## Tests

```bash
python3 tests/test_operator.py     # or: python -m pytest
```

Fully offline: a scripted fake model drives the agent loop; safety gates,
scope enforcement, memory, and JSON parsing are all verified.

## Requirements

- Python 3.8+
- [Ollama](https://ollama.com) (or any OpenAI-compatible endpoint)
- No `pip install`.

## Roadmap / extend it

- Add tools in `tools.py` + register them in `build_registry` (that's all it
  takes for the agent to use them).
- Add a screenshot+vision tool if you run a GUI (headless VPS doesn't need it).
- Swap in a stronger model via `OPERATOR_API_KEY` for harder reasoning.

## License

MIT
