"""Configuration — everything runs locally against Ollama, no API key."""

from __future__ import annotations

import os
from dataclasses import dataclass

DEFAULT_BASE_URL = "http://127.0.0.1:11434/v1"
DEFAULT_MODEL = "llama3.1"  # a stronger default; security Q&A benefits from it


def _f(name: str, default: float) -> float:
    raw = os.getenv(name)
    try:
        return float(raw) if raw and raw.strip() else default
    except ValueError:
        return default


def _i(name: str, default: int) -> int:
    raw = os.getenv(name)
    try:
        return int(raw) if raw and raw.strip() else default
    except ValueError:
        return default


@dataclass
class Config:
    base_url: str = DEFAULT_BASE_URL
    model: str = DEFAULT_MODEL
    temperature: float = 0.2  # low temp → precise, deterministic answers
    request_timeout: int = 300
    api_key: str | None = None

    # Training-loop knobs
    pass_threshold: float = 0.6      # rubric coverage to pass a single question
    max_rounds: int = 3              # retries per question (with study notes fed back)
    readiness_threshold: float = 0.8  # overall pass-rate to be "successor-ready"

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            base_url=os.getenv("CYBER_BASE_URL", DEFAULT_BASE_URL).rstrip("/"),
            model=os.getenv("CYBER_MODEL", DEFAULT_MODEL),
            temperature=_f("CYBER_TEMPERATURE", 0.2),
            request_timeout=_i("CYBER_TIMEOUT", 300),
            api_key=os.getenv("CYBER_API_KEY") or None,
            pass_threshold=_f("CYBER_PASS_THRESHOLD", 0.6),
            max_rounds=_i("CYBER_MAX_ROUNDS", 3),
            readiness_threshold=_f("CYBER_READINESS", 0.8),
        )

    @property
    def chat_url(self) -> str:
        return f"{self.base_url}/chat/completions"

    @property
    def models_url(self) -> str:
        return f"{self.base_url}/models"
