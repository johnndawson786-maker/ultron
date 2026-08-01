"""Persistent memory + knowledge base.

This is how the agent "learns" without changing model weights: it writes facts
and topic notes to disk and recalls them later. Functionally, its knowledge of
your topics grows across runs.
"""

from __future__ import annotations

import json
import re
import time
from pathlib import Path

from .config import Config


def _slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:60] or "note"


class Memory:
    def __init__(self, config: Config) -> None:
        self.config = config
        config.ensure_dirs()

    # --- facts -----------------------------------------------------------

    def remember(self, text: str, tags: str = "") -> str:
        rec = {"ts": time.time(), "text": text, "tags": tags}
        with self.config.facts_file.open("a", encoding="utf-8") as f:
            f.write(json.dumps(rec) + "\n")
        return "stored"

    def _all_facts(self) -> list[dict]:
        if not self.config.facts_file.exists():
            return []
        out = []
        for line in self.config.facts_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                try:
                    out.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
        return out

    def recall(self, query: str, k: int = 5) -> str:
        terms = [t for t in re.findall(r"[a-z0-9]+", query.lower()) if len(t) > 2]
        scored: list[tuple[int, str]] = []
        # Facts
        for rec in self._all_facts():
            blob = (rec.get("text", "") + " " + rec.get("tags", "")).lower()
            score = sum(blob.count(t) for t in terms)
            if score:
                scored.append((score, "fact: " + rec.get("text", "")))
        # Knowledge-base notes (title + first lines)
        for note in self.config.kb_dir.glob("*.md"):
            text = note.read_text(encoding="utf-8", errors="replace")
            blob = text.lower()
            score = sum(blob.count(t) for t in terms)
            if score:
                head = "\n".join(text.splitlines()[:3])
                scored.append((score, f"note [{note.name}]:\n{head}"))
        scored.sort(key=lambda x: -x[0])
        if not scored:
            return "No relevant memory found."
        return "\n---\n".join(s for _, s in scored[:k])

    # --- knowledge base --------------------------------------------------

    def write_note(self, title: str, content: str) -> Path:
        path = self.config.kb_dir / f"{_slug(title)}.md"
        header = f"# {title}\n\n_learned: {time.strftime('%Y-%m-%d %H:%M')}_\n\n"
        path.write_text(header + content, encoding="utf-8")
        return path

    def read_note(self, title_or_slug: str) -> str:
        slug = _slug(title_or_slug)
        path = self.config.kb_dir / f"{slug}.md"
        if path.exists():
            return path.read_text(encoding="utf-8", errors="replace")
        return f"No note found for '{title_or_slug}'."

    def list_notes(self) -> list[str]:
        return sorted(p.name for p in self.config.kb_dir.glob("*.md"))
