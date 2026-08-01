"""Grades a model's answer against a question's rubric.

Grading is deterministic and rubric-driven so it is testable offline and does
not depend on a second model. Each rubric term may list synonyms with '|'; the
term counts as covered if any synonym appears in the answer (case-insensitive,
word-ish match). The score is the fraction of rubric terms covered.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from .question_bank import Question


@dataclass
class Grade:
    score: float           # 0.0 .. 1.0 rubric coverage
    passed: bool
    matched: list[str]
    missing: list[str]


def _term_covered(term: str, answer_lc: str) -> bool:
    for alt in term.split("|"):
        alt = alt.strip().lower()
        if not alt:
            continue
        # Anchor on a leading word boundary so short acronyms don't match inside
        # other words, but allow a trailing inflection (plural / verb form) so
        # "artifact" matches "artifacts" and "correlate" matches "correlates".
        pattern = r"(?<![a-z0-9])" + re.escape(alt) + r"(?:e?s|ed|ing)?(?![a-z0-9])"
        if re.search(pattern, answer_lc):
            return True
    return False


def grade(answer: str, question: Question, threshold: float) -> Grade:
    answer_lc = (answer or "").lower()
    matched: list[str] = []
    missing: list[str] = []
    for term in question.rubric:
        if _term_covered(term, answer_lc):
            matched.append(term)
        else:
            missing.append(term)

    total = len(question.rubric) or 1
    score = len(matched) / total
    # A near-empty answer never passes, regardless of accidental keyword hits.
    substantial = len(answer_lc.split()) >= 12
    passed = score >= threshold and substantial
    return Grade(score=score, passed=passed, matched=matched, missing=missing)


def study_notes_for(question: Question, grade_result: Grade) -> str:
    """Build corrective study notes fed back before a retry (in-context learning)."""
    missing_readable = ", ".join(t.split("|")[0] for t in grade_result.missing)
    return (
        f"Your previous answer missed these required points: {missing_readable}.\n"
        f"Reference (address these precisely and concisely):\n{question.reference}"
    )
