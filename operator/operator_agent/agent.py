"""The agent loop: plan -> act -> observe -> reflect, via a JSON action protocol.

The model emits one JSON action per turn; we execute the named tool and feed the
observation back. Robust JSON extraction tolerates the stray prose that small
local models sometimes add.
"""

from __future__ import annotations

import json
import time
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

from .llm import LLM


@dataclass
class Step:
    thought: str
    action: str
    args: dict[str, Any]
    observation: str


@dataclass
class RunResult:
    answer: str
    steps: list[Step] = field(default_factory=list)
    stopped_reason: str = "finished"


def extract_action(text: str) -> dict[str, Any] | None:
    """Pull the first balanced JSON object out of the model's reply."""
    start = text.find("{")
    while start != -1:
        depth = 0
        in_str = False
        esc = False
        for i in range(start, len(text)):
            ch = text[i]
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == '"':
                    in_str = False
            else:
                if ch == '"':
                    in_str = True
                elif ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        blob = text[start : i + 1]
                        try:
                            obj = json.loads(blob)
                            if isinstance(obj, dict) and "action" in obj:
                                obj.setdefault("args", {})
                                obj.setdefault("thought", "")
                                if not isinstance(obj["args"], dict):
                                    obj["args"] = {}
                                return obj
                        except json.JSONDecodeError:
                            break  # try next '{'
        start = text.find("{", start + 1)
    return None


# on_event(kind, payload) — kind in {"thought","action","observation","note"}
Emitter = Callable[[str, str], None]


class Agent:
    def __init__(
        self,
        llm: LLM,
        registry: dict[str, Callable[..., str]],
        system_prompt: str,
        max_steps: int = 20,
        budget_seconds: int = 900,
        emit: Emitter | None = None,
    ) -> None:
        self.llm = llm
        self.registry = registry
        self.system_prompt = system_prompt
        self.max_steps = max_steps
        self.budget_seconds = budget_seconds
        self.emit = emit or (lambda kind, payload: None)

    def run(self, goal: str) -> RunResult:
        messages: list[dict[str, Any]] = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"Task: {goal}"},
        ]
        steps: list[Step] = []
        deadline = time.monotonic() + self.budget_seconds

        for _ in range(self.max_steps):
            if time.monotonic() > deadline:
                return self._wrap_up(messages, steps, "time budget reached")

            reply = self.llm.complete(messages)
            action = extract_action(reply)

            if action is None:
                messages.append({"role": "assistant", "content": reply})
                messages.append({
                    "role": "user",
                    "content": "That was not a valid JSON action. Reply with exactly one "
                    "JSON object: {\"thought\":..., \"action\":..., \"args\":{...}}.",
                })
                continue

            name = action["action"]
            args = action["args"]
            thought = action.get("thought", "")
            if thought:
                self.emit("thought", thought)

            if name == "finish":
                answer = str(args.get("answer", "")).strip() or "(no answer provided)"
                return RunResult(answer=answer, steps=steps, stopped_reason="finished")

            self.emit("action", f"{name}({_fmt_args(args)})")
            tool = self.registry.get(name)
            if tool is None:
                observation = f"Unknown tool '{name}'. Available: {', '.join(self.registry)}."
            else:
                try:
                    observation = tool(**args)
                except TypeError as exc:
                    observation = f"Bad arguments for {name}: {exc}"
                except Exception as exc:  # noqa: BLE001
                    observation = f"{name} raised: {exc}"

            self.emit("observation", observation)
            steps.append(Step(thought, name, args, observation))
            messages.append({"role": "assistant", "content": json.dumps(action)})
            messages.append({"role": "user", "content": f"Observation:\n{observation}"})

        return self._wrap_up(messages, steps, "step budget reached")

    def _wrap_up(self, messages, steps, reason) -> RunResult:
        """Ask the model for a final answer when the budget is exhausted."""
        messages.append({
            "role": "user",
            "content": "You are out of budget. Give your best final answer now as plain "
            "text (no JSON), based on what you've gathered.",
        })
        try:
            answer = self.llm.complete(messages).strip()
        except Exception as exc:  # noqa: BLE001
            answer = f"(could not synthesize final answer: {exc})"
        return RunResult(answer=answer or "(no answer)", steps=steps, stopped_reason=reason)


def _fmt_args(args: dict[str, Any]) -> str:
    parts = []
    for k, v in args.items():
        s = str(v).replace("\n", " ")
        parts.append(f"{k}={s[:60]}")
    return ", ".join(parts)
