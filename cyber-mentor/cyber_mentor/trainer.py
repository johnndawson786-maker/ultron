"""The train-until-ready loop.

For each question: ask the model, grade the answer, and — if it falls short —
feed back the missing points as study notes and re-ask (in-context learning),
up to `max_rounds`. Advance when the answer is satisfactory. After the whole
bank, compute per-domain knowledge and a readiness verdict.

The final report is produced only once the run completes — matching the
"don't give output until it's capable" requirement.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass, field

from . import persona
from .config import Config
from .examiner import Grade, grade, study_notes_for
from .llm import LLM
from .question_bank import QUESTIONS, Question


@dataclass
class QuestionResult:
    question: Question
    passed: bool
    rounds: int
    best_score: float
    missing: list[str]
    final_answer: str


@dataclass
class DomainScore:
    domain: str
    passed: int
    total: int
    avg_score: float

    @property
    def pass_rate(self) -> float:
        return self.passed / self.total if self.total else 0.0


@dataclass
class Report:
    model: str
    mindset: str
    results: list[QuestionResult] = field(default_factory=list)
    domains: list[DomainScore] = field(default_factory=list)
    overall_pass_rate: float = 0.0
    avg_score: float = 0.0
    avg_rounds: float = 0.0
    ready: bool = False
    readiness_threshold: float = 0.8


def _drill_one(
    llm: LLM, question: Question, cfg: Config, verbose: bool
) -> QuestionResult:
    study: str | None = None
    best: Grade | None = None
    passed_any = False
    last_answer = ""
    rounds = 0
    for attempt in range(1, cfg.max_rounds + 1):
        rounds = attempt
        answer = llm.complete(persona.messages_for(question.prompt, study))
        last_answer = answer
        g = grade(answer, question, cfg.pass_threshold)
        if best is None or g.score > best.score:
            best = g
        if verbose:
            print(
                f"    round {attempt}: score={g.score:.2f} "
                f"{'PASS' if g.passed else 'retry'}",
                file=sys.stderr,
            )
        if g.passed:
            passed_any = True
            break
        # Not satisfactory — teach the missing points, then re-ask.
        study = study_notes_for(question, g)

    assert best is not None
    return QuestionResult(
        question=question,
        passed=passed_any,
        rounds=rounds,
        best_score=best.score,
        missing=[t.split("|")[0] for t in best.missing],
        final_answer=last_answer,
    )


def train(
    llm: LLM,
    cfg: Config,
    questions: tuple[Question, ...] = QUESTIONS,
    verbose: bool = False,
    progress: bool = True,
) -> Report:
    results: list[QuestionResult] = []
    total = len(questions)

    for idx, q in enumerate(questions, start=1):
        if progress:
            print(
                f"[{idx}/{total}] {q.domain:<14} {q.id} ...",
                end="",
                file=sys.stderr,
                flush=True,
            )
        if verbose:
            print(file=sys.stderr)
            print(f"[{idx}/{total}] {q.id} — {q.prompt}", file=sys.stderr)

        res = _drill_one(llm, q, cfg, verbose)
        results.append(res)

        if progress and not verbose:
            verdict = "PASS" if res.passed else "WEAK"
            print(
                f" {verdict} (best {res.best_score:.2f}, {res.rounds} round"
                f"{'s' if res.rounds != 1 else ''})",
                file=sys.stderr,
                flush=True,
            )

    return _summarize(cfg, results)


def _summarize(cfg: Config, results: list[QuestionResult]) -> Report:
    from .question_bank import domains as domain_order

    by_domain: dict[str, list[QuestionResult]] = {}
    for r in results:
        by_domain.setdefault(r.question.domain, []).append(r)

    domain_scores: list[DomainScore] = []
    for d in domain_order():
        rs = by_domain.get(d, [])
        if not rs:
            continue
        passed = sum(1 for r in rs if r.passed)
        avg = sum(r.best_score for r in rs) / len(rs)
        domain_scores.append(DomainScore(d, passed, len(rs), avg))

    n = len(results) or 1
    overall_pass = sum(1 for r in results if r.passed) / n
    avg_score = sum(r.best_score for r in results) / n
    avg_rounds = sum(r.rounds for r in results) / n
    ready = overall_pass >= cfg.readiness_threshold

    return Report(
        model=cfg.model,
        mindset=persona.MINDSET_SUMMARY,
        results=results,
        domains=domain_scores,
        overall_pass_rate=overall_pass,
        avg_score=avg_score,
        avg_rounds=avg_rounds,
        ready=ready,
        readiness_threshold=cfg.readiness_threshold,
    )
