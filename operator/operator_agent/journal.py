"""Activity journal — a durable record of everything the agent does.

Because the default autonomy is "auto" (it acts without asking), the journal is
what makes it accountable: every task, every tool call, every command, and every
result is written here so you can always ask "what did you do?" via
`operator log`.
"""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any


class Journal:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def event(self, kind: str, **data: Any) -> None:
        rec = {"ts": time.time(), "kind": kind, **data}
        try:
            with self.path.open("a", encoding="utf-8") as f:
                f.write(json.dumps(rec, default=str) + "\n")
        except Exception:  # noqa: BLE001 - logging must never crash the agent
            pass

    def read(self, last: int = 40) -> list[dict[str, Any]]:
        if not self.path.exists():
            return []
        lines = self.path.read_text(encoding="utf-8", errors="replace").splitlines()
        out: list[dict[str, Any]] = []
        for ln in lines[-last:]:
            ln = ln.strip()
            if not ln:
                continue
            try:
                out.append(json.loads(ln))
            except json.JSONDecodeError:
                continue
        return out


def format_entries(entries: list[dict[str, Any]]) -> str:
    """Human-readable rendering of journal entries for `operator log`."""
    if not entries:
        return "(no activity recorded yet)"
    lines: list[str] = []
    for e in entries:
        ts = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(e.get("ts", 0)))
        kind = e.get("kind", "?")
        if kind == "task":
            lines.append(f"\n[{ts}] TASK: {e.get('goal', '')}")
        elif kind == "step":
            args = e.get("args", {})
            arg_str = ", ".join(f"{k}={str(v)[:60]}" for k, v in args.items())
            obs = str(e.get("observation", "")).replace("\n", " ")
            lines.append(f"[{ts}]   → {e.get('action')}({arg_str})")
            lines.append(f"[{ts}]     ↳ {obs[:200]}")
        elif kind == "finish":
            ans = str(e.get("answer", "")).replace("\n", " ")
            lines.append(f"[{ts}]   ✓ finished: {ans[:200]}")
        elif kind == "stopped":
            lines.append(f"[{ts}]   ■ stopped: {e.get('reason', '')}")
        else:
            lines.append(f"[{ts}] {kind}: {json.dumps({k: v for k, v in e.items() if k not in ('ts', 'kind')})[:200]}")
    return "\n".join(lines)
