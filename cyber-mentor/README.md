# Cyber-Mentor — a local cybersecurity expert with a train-until-ready loop

Runs **entirely on your machine** (Ollama, no API key). It gives a local model a
cybersecurity **mindset**, then **drills** it: ask a question → grade the answer
against a rubric → feed back exactly what it missed → re-ask → and only
**"graduate"** it once it clears a capability bar across every domain. Then it
prints a report of **how much it actually knows**, and lets you chat with it.

Zero Python dependencies — standard library only.

> **Two honest notes.**
> 1. **This is in-context capability-building + benchmarking, not weight training.**
>    A local model's knowledge lives in fixed weights; a Q&A loop in a script
>    can't rewrite them (that's fine-tuning — GPUs, datasets, hours). What this
>    *does* is measure the model's knowledge and drill it with corrective
>    feedback until it clears the bar, exactly like an exam-prep loop. It's the
>    practical, runnable version of what you asked for.
> 2. **The mindset keeps a light "authorized / defensive use" grounding.** It's
>    built to be a deep, precise security expert — offense *and* defense, because
>    understanding both is the point — but it is not built to strip guardrails
>    and answer anything. That one line stays in.

## What "the mindset" is

The persona (`cyber_mentor/persona.py`) is tuned for:

- **Pinpoint accuracy** — name the exact protocol, port, algorithm, flag, tool,
  standard, or CVE; no hand-waving.
- **Honesty over fluency** — say "I don't know" instead of inventing facts.
- **Threat-model-first reasoning** — assumption → attacker capability →
  mechanism → mitigation/detection.
- **Depth on demand** — terse by default, thorough when the question is deep.
- **Defense-aware** — every offensive concept comes with how it's detected/mitigated.

It covers: cryptography, network security, web/app security, host & OS hardening,
identity & access management, malware/RE (conceptual), incident response &
forensics, cloud & container security, detection engineering, and security
architecture.

## How the train-until-ready loop works

```
for each question in the bank:
    ask the model  ──►  grade the answer against its rubric
                         │
                         ├─ satisfactory ─►  advance to the next question
                         │
                         └─ not yet ──►  feed back the missed points as
                                          "study notes" and re-ask
                                          (up to CYBER_MAX_ROUNDS)

after the whole bank ─► per-domain knowledge + overall pass rate
                        ─► VERDICT: READY  (if pass rate ≥ CYBER_READINESS)
                                    NOT YET (with the weakest areas)
```

The final report is printed **only after** the run completes — nothing is
emitted until the model has been put through the whole gauntlet.

## Quick start

1. **Install Ollama** (free, offline, one time):
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh    # macOS / Linux
   # or https://ollama.com/download
   ```
2. **Train and report:**
   ```bash
   cd cyber-mentor
   ./run.sh                 # starts Ollama, pulls the model, drills it, prints the report
   ```

### Other commands

```bash
./run.sh train --verbose         # show each question and round
./run.sh chat                    # talk to the mentor
./run.sh ask "How does Kerberos authentication work?"
./run.sh --model qwen2.5 train   # drill a different local model
```

Manual (no run.sh):

```bash
ollama serve & ; ollama pull llama3.1
cd cyber-mentor
python3 -m cyber_mentor train
```

## Example report

```
══════════ CYBER-MENTOR CAPABILITY REPORT ══════════
Model under test : llama3.1
Mindset          : A precise, methodical cybersecurity engineer...

Knowledge by domain:
  Cryptography   ██████████████████░░  91.7%  (4/4 passed)
  Web/AppSec     ███████████████████░  95.0%  (4/4 passed)
  Network        ██████████████████░░  91.7%  (4/4 passed)
  ...
Overall:
  Rubric coverage   :  88.0%
  Questions passed  :  93.5%
  Avg rounds/question: 1.4
VERDICT: READY — clears the bar to be your successor.
════════════════════════════════════════════════════
```

The **domain bars answer "how much does it know"**; the **verdict** answers "is
it good enough yet." Weaker models will show `NOT YET READY` with their weakest
areas — bump `CYBER_MODEL` to something stronger, raise `CYBER_MAX_ROUNDS`, or
lower `CYBER_READINESS`.

## Configuration

Set via environment or a `.env` file (see `.env.example`):

| Variable | Default | Meaning |
|---|---|---|
| `CYBER_MODEL` | `llama3.1` | Local model to drill. |
| `CYBER_BASE_URL` | `http://127.0.0.1:11434/v1` | Local server. |
| `CYBER_TEMPERATURE` | `0.2` | Low = precise, deterministic. |
| `CYBER_PASS_THRESHOLD` | `0.6` | Rubric coverage to pass one question. |
| `CYBER_MAX_ROUNDS` | `3` | Retries per question (with feedback). |
| `CYBER_READINESS` | `0.8` | Fraction of questions to pass to be "ready". |

## Extending it

- **Add questions:** append `Question(...)` entries in
  `cyber_mentor/question_bank.py` — give each a rubric (key concepts, `|` for
  synonyms) and a concise reference answer.
- **Add domains:** just use a new `domain=` string; the report groups by it.
- **Add your own ethics/policy layer:** edit `SYSTEM_PROMPT` in
  `cyber_mentor/persona.py`.
- **Swap the grader:** `cyber_mentor/examiner.py` is rubric-based and
  deterministic; you can add an LLM-judge there if you want.

## Project layout

```
cyber-mentor/
├── README.md
├── .env.example
├── run.sh
├── cyber_mentor/
│   ├── __init__.py
│   ├── __main__.py        # CLI: train / chat / ask
│   ├── config.py
│   ├── llm.py             # local OpenAI-compatible client (stdlib only)
│   ├── persona.py         # the mindset / system prompt
│   ├── question_bank.py   # cybersecurity questions + rubrics + references
│   ├── examiner.py        # deterministic rubric grader
│   └── trainer.py         # the train-until-ready loop + report
└── tests/
    └── test_cyber.py      # offline tests (fake model drives the whole loop)
```

## Tests

```bash
python3 tests/test_cyber.py      # or: python -m pytest
```

Runs fully offline: a fake model exercises the ask→grade→feedback→re-ask loop,
verifies weak models are marked NOT READY, and checks every reference answer
clears its own rubric.

## Requirements

- Python 3.8+
- [Ollama](https://ollama.com) (or any OpenAI-compatible local server)
- No `pip install`.

## License

MIT
