"""Cyber-Mentor CLI.

  python -m cyber_mentor train           # drill the model until ready, then report
  python -m cyber_mentor train --verbose # show each round
  python -m cyber_mentor chat            # talk to the mentor (after it's ready)
  python -m cyber_mentor ask "question"  # one-shot question
"""

from __future__ import annotations

import argparse
import sys

from . import persona
from .config import Config
from .llm import LLM, LLMError, OllamaLLM
from .trainer import Report, train


# --- rendering -----------------------------------------------------------

_TTY = sys.stdout.isatty()


def _c(code: str, t: str) -> str:
    return f"\033[{code}m{t}\033[0m" if _TTY else t


def _bar(frac: float, width: int = 20) -> str:
    filled = int(round(frac * width))
    return "█" * filled + "░" * (width - filled)


def render_report(rep: Report) -> str:
    lines: list[str] = []
    lines.append(_c("1", "\n══════════ CYBER-MENTOR CAPABILITY REPORT ══════════"))
    lines.append(f"Model under test : {rep.model}")
    lines.append(f"Mindset          : {rep.mindset}")
    lines.append("")
    lines.append(_c("1", "Knowledge by domain:"))
    for d in rep.domains:
        pct = d.avg_score * 100
        lines.append(
            f"  {d.domain:<14} {_bar(d.avg_score)} {pct:5.1f}%  "
            f"({d.passed}/{d.total} passed)"
        )
    lines.append("")
    lines.append(_c("1", "Overall:"))
    lines.append(f"  Rubric coverage   : {rep.avg_score*100:5.1f}%")
    lines.append(f"  Questions passed  : {rep.overall_pass_rate*100:5.1f}%")
    lines.append(f"  Avg rounds/question: {rep.avg_rounds:.2f}")
    lines.append(
        f"  Readiness bar     : {rep.readiness_threshold*100:.0f}% of questions passed"
    )
    lines.append("")

    if rep.ready:
        lines.append(_c("32", "VERDICT: READY — clears the bar to be your successor."))
    else:
        weak = sorted(rep.domains, key=lambda d: d.avg_score)[:3]
        weak_str = ", ".join(f"{d.domain} ({d.avg_score*100:.0f}%)" for d in weak)
        lines.append(
            _c("33", "VERDICT: NOT YET READY — below the bar.")
        )
        lines.append(f"  Weakest areas: {weak_str}")
        lines.append(
            "  Try a stronger model (CYBER_MODEL=llama3.1 / qwen2.5:14b), raise "
            "CYBER_MAX_ROUNDS, or lower CYBER_READINESS."
        )
    lines.append(_c("1", "════════════════════════════════════════════════════"))
    return "\n".join(lines)


# --- subcommands ---------------------------------------------------------


def cmd_train(cfg: Config, args: argparse.Namespace) -> int:
    if args.model:
        cfg.model = args.model
    llm: LLM = OllamaLLM(cfg)
    _preflight(cfg, llm)
    print(
        f"Drilling '{cfg.model}' on cybersecurity "
        f"(pass≥{cfg.pass_threshold:.0%}, ready≥{cfg.readiness_threshold:.0%}, "
        f"≤{cfg.max_rounds} rounds/question). This runs locally and may take a while...\n",
        file=sys.stderr,
    )
    try:
        rep = train(llm, cfg, verbose=args.verbose, progress=True)
    except LLMError as exc:
        print(_c("31", f"\nLocal server error: {exc}"), file=sys.stderr)
        _ollama_hint(cfg)
        return 1
    # Final output only after the run completes.
    print(render_report(rep))
    return 0 if rep.ready else 2


def cmd_chat(cfg: Config, args: argparse.Namespace) -> int:
    if args.model:
        cfg.model = args.model
    llm = OllamaLLM(cfg)
    _preflight(cfg, llm)
    print(_c("1", f"Cyber-Mentor chat — model {cfg.model}. Ctrl-D to exit.\n"))
    history: list[dict[str, str]] = []
    while True:
        try:
            q = input(_c("36", "You > "))
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye.")
            return 0
        if not q.strip():
            continue
        history.append({"role": "user", "content": q})
        msgs = [{"role": "system", "content": persona.SYSTEM_PROMPT}, *history]
        print(_c("32", "\nMentor "), end="", flush=True)
        try:
            answer = llm.stream(msgs, lambda ch: print(ch, end="", flush=True))
        except LLMError as exc:
            history.pop()
            print(_c("31", f"\n[error] {exc}"))
            _ollama_hint(cfg)
            continue
        print("\n")
        history.append({"role": "assistant", "content": answer})


def cmd_ask(cfg: Config, args: argparse.Namespace) -> int:
    if args.model:
        cfg.model = args.model
    llm = OllamaLLM(cfg)
    msgs = persona.messages_for(args.question)
    try:
        llm.stream(msgs, lambda ch: print(ch, end="", flush=True))
    except LLMError as exc:
        print(_c("31", f"\n[error] {exc}"), file=sys.stderr)
        _ollama_hint(cfg)
        return 1
    print()
    return 0


# --- helpers -------------------------------------------------------------


def _preflight(cfg: Config, llm: OllamaLLM) -> None:
    try:
        models = llm.available_models()
    except LLMError:
        print(
            _c("33", f"⚠  Can't reach the local server at {cfg.base_url}."),
            file=sys.stderr,
        )
        _ollama_hint(cfg)
        return
    if models and cfg.model not in models:
        print(
            _c(
                "33",
                f"⚠  Model '{cfg.model}' isn't pulled. Run: ollama pull {cfg.model}\n"
                f"   Available: {', '.join(models) or '(none)'}",
            ),
            file=sys.stderr,
        )


def _ollama_hint(cfg: Config) -> None:
    print(
        "   Start Ollama:  ollama serve\n"
        f"   Pull a model:  ollama pull {cfg.model}",
        file=sys.stderr,
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="cyber_mentor",
        description="Local cybersecurity mentor with a train-until-ready loop.",
    )
    parser.add_argument("--model", help="override the local model to use")
    sub = parser.add_subparsers(dest="cmd")

    p_train = sub.add_parser("train", help="drill the model and report capability")
    p_train.add_argument("--verbose", action="store_true", help="show each round")

    sub.add_parser("chat", help="chat with the mentor")

    p_ask = sub.add_parser("ask", help="ask one question")
    p_ask.add_argument("question", help="the question to ask")

    args = parser.parse_args(argv)
    cfg = Config.from_env()

    if args.cmd == "train":
        return cmd_train(cfg, args)
    if args.cmd == "chat":
        return cmd_chat(cfg, args)
    if args.cmd == "ask":
        return cmd_ask(cfg, args)
    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
