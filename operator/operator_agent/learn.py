"""LEARN mode: research a topic in a time budget, then persist what was learned.

After the research loop, the gathered observations are synthesized into a
structured knowledge-base note plus a self-check quiz, so the knowledge is
durable and reusable — this is the agent's practical "learning".
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from .agent import Agent, Emitter, RunResult
from .config import Config
from .journal import Journal
from .llm import LLM
from .memory import Memory
from .prompts import learn_system
from .tools import ToolSpec


@dataclass
class LearnResult:
    topic: str
    note_path: Path
    summary: str
    steps: int


def learn_topic(
    llm: LLM,
    cfg: Config,
    memory: Memory,
    registry: dict,
    specs: list[ToolSpec],
    topic: str,
    minutes: int,
    emit: Emitter | None = None,
    journal: Journal | None = None,
) -> LearnResult:
    budget = max(60, minutes * 60)
    agent = Agent(
        llm,
        registry,
        learn_system(specs),
        max_steps=cfg.max_steps,
        budget_seconds=budget,
        emit=emit,
        journal=journal,
    )
    goal = (
        f"Research the topic: '{topic}'. Check what you already know with recall, then "
        f"use web_search and web_read to gather accurate, concrete facts from authoritative "
        f"sources. Focus on practical, correct specifics. When you have enough, finish with "
        f"a short summary of what you learned."
    )
    result: RunResult = agent.run(goal)

    note_body = _synthesize_note(llm, topic, result)
    quiz = _make_quiz(llm, topic, note_body)
    full = note_body + "\n\n## Self-check quiz\n\n" + quiz
    note_path = memory.write_note(topic, full)
    memory.remember(f"Studied '{topic}'. Note saved at {note_path}.", tags="learn")

    return LearnResult(
        topic=topic,
        note_path=note_path,
        summary=result.answer.strip(),
        steps=len(result.steps),
    )


def _context_from(result: RunResult) -> str:
    chunks = [f"[{s.action}] {s.observation}" for s in result.steps]
    ctx = "\n\n".join(chunks)
    if result.answer:
        ctx += "\n\nAgent summary:\n" + result.answer
    return ctx[:8000]


def _synthesize_note(llm: LLM, topic: str, result: RunResult) -> str:
    ctx = _context_from(result)
    prompt = (
        f"From the research notes below about '{topic}', write a concise, accurate "
        f"knowledge-base note in Markdown with these sections:\n"
        f"## Overview\n## Key concepts\n## Practical steps\n## Common pitfalls\n## Sources\n\n"
        f"Be specific and technically correct. Only include facts supported by the notes; "
        f"do not invent details. Under Sources, list any URLs that appeared.\n\n"
        f"RESEARCH NOTES:\n{ctx}"
    )
    try:
        return llm.complete(
            [
                {"role": "system", "content": "You write precise technical notes."},
                {"role": "user", "content": prompt},
            ]
        ).strip() or "(synthesis produced no content)"
    except Exception as exc:  # noqa: BLE001
        return f"(note synthesis failed: {exc})\n\nRaw research context:\n{ctx}"


def _make_quiz(llm: LLM, topic: str, note_body: str) -> str:
    prompt = (
        f"Based on this note about '{topic}', write 5 short self-check questions, each "
        f"followed by a one-line answer. Format:\n1. Q...\n   A...\n\nNOTE:\n{note_body[:4000]}"
    )
    try:
        return llm.complete(
            [
                {"role": "system", "content": "You write concise study quizzes."},
                {"role": "user", "content": prompt},
            ]
        ).strip() or "(no quiz generated)"
    except Exception as exc:  # noqa: BLE001
        return f"(quiz generation failed: {exc})"
