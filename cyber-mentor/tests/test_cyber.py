"""Offline tests — no Ollama, no network. A fake LLM drives the loop.

Run:  python3 tests/test_cyber.py   (or)   python -m pytest
"""

from __future__ import annotations

import os
import sys
from typing import Any, Callable

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from cyber_mentor.config import Config  # noqa: E402
from cyber_mentor.examiner import grade  # noqa: E402
from cyber_mentor.question_bank import QUESTIONS  # noqa: E402
from cyber_mentor.trainer import train  # noqa: E402

_BY_PROMPT = {q.prompt: q for q in QUESTIONS}
_WEAK = "This is a generic filler answer that does not really address the specifics asked."


class FakeLLM:
    """Returns a weak answer first, then the reference once study notes appear.

    This exercises the ask -> grade -> feed-back -> re-ask loop.
    """

    def __init__(self, always_reference: bool = False) -> None:
        self.always_reference = always_reference

    def complete(self, messages: list[dict[str, Any]]) -> str:
        has_study = any(
            m["role"] == "system" and "Study notes" in m["content"] for m in messages
        )
        user = next(m for m in messages if m["role"] == "user")["content"]
        q = _BY_PROMPT.get(user)
        if q is None:
            return _WEAK
        if self.always_reference or has_study:
            return q.reference
        return _WEAK

    def stream(self, messages, on_text: Callable[[str], None]) -> str:  # pragma: no cover
        text = self.complete(messages)
        on_text(text)
        return text


# --- examiner tests ------------------------------------------------------


def test_reference_answer_passes():
    q = QUESTIONS[0]
    g = grade(q.reference, q, threshold=0.6)
    assert g.passed, (g.score, g.missing)
    assert g.score >= 0.6


def test_empty_answer_fails():
    q = QUESTIONS[0]
    g = grade("", q, threshold=0.6)
    assert not g.passed
    assert g.score == 0.0


def test_word_boundary_no_false_match():
    # "aes" must not match inside "phrases"; a sentence with no rubric terms scores 0.
    q = next(q for q in QUESTIONS if any("AES" in t for t in q.rubric))
    g = grade("Common phrases about databases and phases of the moon.", q, 0.6)
    assert g.score < 0.5


# --- trainer / feedback-loop tests --------------------------------------


def test_feedback_loop_recovers_on_retry():
    cfg = Config(max_rounds=3, pass_threshold=0.6, readiness_threshold=0.8)
    rep = train(FakeLLM(), cfg, questions=QUESTIONS, verbose=False, progress=False)
    # Every question should pass by round 2 (reference is fed back), so >= 2 rounds avg.
    assert rep.overall_pass_rate == 1.0
    assert rep.ready is True
    assert all(r.rounds >= 2 for r in rep.results)


def test_first_try_pass_uses_one_round():
    cfg = Config(max_rounds=3, pass_threshold=0.6, readiness_threshold=0.8)
    rep = train(FakeLLM(always_reference=True), cfg, questions=QUESTIONS, progress=False)
    assert rep.ready is True
    assert all(r.rounds == 1 for r in rep.results)


def test_weak_model_not_ready():
    class DumbLLM(FakeLLM):
        def complete(self, messages):
            return _WEAK  # never improves

    cfg = Config(max_rounds=2, pass_threshold=0.6, readiness_threshold=0.8)
    rep = train(DumbLLM(), cfg, questions=QUESTIONS, progress=False)
    assert rep.overall_pass_rate == 0.0
    assert rep.ready is False


def test_report_has_all_domains():
    from cyber_mentor.question_bank import domains

    cfg = Config()
    rep = train(FakeLLM(always_reference=True), cfg, progress=False)
    reported = {d.domain for d in rep.domains}
    assert reported == set(domains())


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"ok  {name}")
    print("All tests passed.")
