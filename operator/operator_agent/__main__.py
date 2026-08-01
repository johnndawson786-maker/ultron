"""Operator CLI.

  operator sysinfo                      # what does it know about this VPS
  operator task "goal..."               # run an agentic task (approval-gated)
  operator learn "topic" --minutes 30   # research a topic, save a knowledge note
  operator recon "goal / target"        # bug-bounty mentor (authorized only)
  operator chat                         # step-by-step guidance (conversational)
  operator idle                         # work the curiosity backlog
  operator log [--last N]               # see exactly what the agent did
  operator scope add <host> | list      # manage authorized-testing scope
  operator notes list | show <title>    # browse the knowledge base
"""

from __future__ import annotations

import argparse
import sys

from .agent import Agent
from .config import Config
from .journal import Journal, format_entries
from .learn import learn_topic
from .llm import ChatLLM, LLMError
from .memory import Memory
from .prompts import operator_system, recon_system
from .safety import Scope, auto_approver, cli_approver
from .tools import Tools, build_registry

_TTY = sys.stderr.isatty()


def _c(code: str, t: str) -> str:
    return f"\033[{code}m{t}\033[0m" if _TTY else t


def _emitter(verbose: bool):
    def emit(kind: str, payload: str) -> None:
        if kind == "thought":
            print(_c("2", f"  · {payload}"), file=sys.stderr)
        elif kind == "action":
            print(_c("36", f"  → {payload}"), file=sys.stderr)
        elif kind == "observation" and verbose:
            head = payload if len(payload) < 500 else payload[:500] + " …"
            print(_c("2", f"    {head}"), file=sys.stderr)
    return emit


def _build(cfg: Config):
    cfg.ensure_dirs()
    llm = ChatLLM(cfg)
    memory = Memory(cfg)
    approver = auto_approver if cfg.autonomy == "auto" else cli_approver
    tools = Tools(cfg, memory, approver)
    registry, specs = build_registry(tools)
    journal = Journal(cfg.log_file)
    return llm, memory, tools, registry, specs, journal


def _autonomy_banner(cfg: Config) -> None:
    if cfg.autonomy == "auto":
        print(
            _c("2", "[autonomy: AUTO — acting without prompts. Everything is logged; "
            "run `operator log` to see exactly what it did.]"),
            file=sys.stderr,
        )


def _preflight(cfg: Config, llm: ChatLLM) -> None:
    try:
        models = llm.available_models()
    except LLMError:
        print(
            _c("33", f"⚠  Can't reach the model server at {cfg.base_url}. "
            "Start Ollama (`ollama serve`) or set OPERATOR_BASE_URL/OPERATOR_API_KEY."),
            file=sys.stderr,
        )
        return
    if models and cfg.model not in models and not cfg.api_key:
        print(
            _c("33", f"⚠  Model '{cfg.model}' isn't pulled. Run: ollama pull {cfg.model}"),
            file=sys.stderr,
        )


# --- commands ------------------------------------------------------------


def cmd_sysinfo(cfg, args) -> int:
    _, _, tools, _, _, _ = _build(cfg)
    print(tools.sysinfo())
    return 0


def cmd_task(cfg, args) -> int:
    if args.minutes:
        cfg.budget_seconds = args.minutes * 60
    llm, _, _, registry, specs, journal = _build(cfg)
    _preflight(cfg, llm)
    _autonomy_banner(cfg)
    agent = Agent(llm, registry, operator_system(specs), cfg.max_steps,
                  cfg.budget_seconds, _emitter(args.verbose), journal=journal)
    print(_c("1", f"\nTask: {args.goal}\n"), file=sys.stderr)
    try:
        result = agent.run(args.goal)
    except LLMError as exc:
        print(_c("31", f"model error: {exc}"), file=sys.stderr)
        return 1
    print("\n" + _c("32", "── Result ──"))
    print(result.answer)
    print(_c("2", f"\n[{len(result.steps)} steps · {result.stopped_reason}]"), file=sys.stderr)
    return 0


def cmd_recon(cfg, args) -> int:
    llm, _, _, registry, specs, journal = _build(cfg)
    _preflight(cfg, llm)
    _autonomy_banner(cfg)
    agent = Agent(llm, registry, recon_system(specs), cfg.max_steps,
                  cfg.budget_seconds, _emitter(args.verbose), journal=journal)
    scope_hosts = Scope(cfg.scope_file).hosts()
    if cfg.allow_active_testing:
        msg = ("[active testing ENABLED — but active scans only run against hosts "
               "in your scope allowlist: " + (", ".join(scope_hosts) or "(empty — add with `operator scope add`)") + "]")
    else:
        msg = "[active testing OFF — mentor/passive mode]"
    print(_c("2", msg), file=sys.stderr)
    try:
        result = agent.run(args.goal)
    except LLMError as exc:
        print(_c("31", f"model error: {exc}"), file=sys.stderr)
        return 1
    print("\n" + _c("32", "── Result ──"))
    print(result.answer)
    return 0


def cmd_learn(cfg, args) -> int:
    llm, memory, _, registry, specs, journal = _build(cfg)
    _preflight(cfg, llm)
    print(_c("1", f"\nLearning '{args.topic}' for up to {args.minutes} min...\n"), file=sys.stderr)
    try:
        res = learn_topic(llm, cfg, memory, registry, specs, args.topic,
                          args.minutes, _emitter(args.verbose), journal=journal)
    except LLMError as exc:
        print(_c("31", f"model error: {exc}"), file=sys.stderr)
        return 1
    print("\n" + _c("32", "── Learned ──"))
    print(res.summary)
    print(_c("1", f"\nKnowledge note saved: {res.note_path}"))
    print(_c("2", f"[{res.steps} research steps]"), file=sys.stderr)
    return 0


def cmd_chat(cfg, args) -> int:
    llm, _, _, _, specs, _ = _build(cfg)
    _preflight(cfg, llm)
    print(_c("1", "Operator chat — step-by-step guidance. Ctrl-D to exit.\n"))
    history = [{"role": "system", "content": operator_system(specs)}]
    while True:
        try:
            q = input(_c("36", "You > "))
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye.")
            return 0
        if not q.strip():
            continue
        history.append({"role": "user", "content": q})
        print(_c("32", "\nOperator "), end="", flush=True)
        try:
            ans = llm.stream(history, lambda ch: print(ch, end="", flush=True))
        except LLMError as exc:
            history.pop()
            print(_c("31", f"\n[error] {exc}"))
            continue
        print("\n")
        history.append({"role": "assistant", "content": ans})


def cmd_idle(cfg, args) -> int:
    llm, memory, _, registry, specs, journal = _build(cfg)
    _preflight(cfg, llm)
    _autonomy_banner(cfg)
    backlog = cfg.backlog_file
    if not backlog.exists() or not backlog.read_text().strip():
        print(_c("33", f"Backlog is empty. Add topics (one per line) to {backlog}"))
        return 0
    lines = [ln.strip() for ln in backlog.read_text().splitlines() if ln.strip()]
    done = 0
    for topic in list(lines):
        print(_c("1", f"\n[curiosity] learning: {topic}"), file=sys.stderr)
        try:
            res = learn_topic(llm, cfg, memory, registry, specs, topic,
                              args.minutes, _emitter(args.verbose), journal=journal)
            print(_c("32", f"  ✓ saved {res.note_path.name}"), file=sys.stderr)
            done += 1
            lines.remove(topic)
            backlog.write_text("\n".join(lines) + ("\n" if lines else ""))
        except LLMError as exc:
            print(_c("31", f"  model error: {exc}"), file=sys.stderr)
            break
        if args.max and done >= args.max:
            break
    print(_c("1", f"\nWorked {done} backlog item(s)."))
    return 0


def cmd_scope(cfg, args) -> int:
    scope = Scope(cfg.scope_file)
    if args.action == "add":
        scope.add(args.host)
        print(f"Added to authorized scope: {args.host}")
        print(_c("33", "Only add hosts you are permitted to test."))
    else:
        hosts = scope.hosts()
        print("\n".join(hosts) if hosts else "(scope allowlist is empty)")
    return 0


def cmd_log(cfg, args) -> int:
    journal = Journal(cfg.log_file)
    entries = journal.read(last=args.last)
    print(format_entries(entries))
    return 0


def cmd_notes(cfg, args) -> int:
    memory = Memory(cfg)
    if args.action == "list":
        notes = memory.list_notes()
        print("\n".join(notes) if notes else "(no knowledge-base notes yet)")
    else:
        print(memory.read_note(args.title))
    return 0


# --- argparse ------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="operator", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--model", help="override the model")
    p.add_argument("--verbose", "-v", action="store_true", help="show observations")
    sub = p.add_subparsers(dest="cmd")

    sub.add_parser("sysinfo", help="report facts about this VPS")

    pt = sub.add_parser("task", help="run an agentic task")
    pt.add_argument("goal")
    pt.add_argument("--minutes", type=int, default=0, help="time budget")

    pr = sub.add_parser("recon", help="bug-bounty mentor (authorized only)")
    pr.add_argument("goal")

    pl = sub.add_parser("learn", help="research a topic and save a note")
    pl.add_argument("topic")
    pl.add_argument("--minutes", type=int, default=20)

    sub.add_parser("chat", help="step-by-step guidance")

    plog = sub.add_parser("log", help="show what the agent has done (activity journal)")
    plog.add_argument("--last", type=int, default=40, help="how many recent entries")

    pi = sub.add_parser("idle", help="work the curiosity backlog")
    pi.add_argument("--minutes", type=int, default=15)
    pi.add_argument("--max", type=int, default=0, help="max items this run")

    ps = sub.add_parser("scope", help="manage authorized-testing scope")
    ps.add_argument("action", choices=["add", "list"])
    ps.add_argument("host", nargs="?", default="")

    pn = sub.add_parser("notes", help="browse the knowledge base")
    pn.add_argument("action", choices=["list", "show"])
    pn.add_argument("title", nargs="?", default="")

    args = p.parse_args(argv)
    cfg = Config.from_env()
    if getattr(args, "model", None):
        cfg.model = args.model

    dispatch = {
        "sysinfo": cmd_sysinfo, "task": cmd_task, "recon": cmd_recon,
        "learn": cmd_learn, "chat": cmd_chat, "idle": cmd_idle,
        "scope": cmd_scope, "notes": cmd_notes, "log": cmd_log,
    }
    fn = dispatch.get(args.cmd)
    if fn is None:
        p.print_help()
        return 0
    return fn(cfg, args)


if __name__ == "__main__":
    raise SystemExit(main())
