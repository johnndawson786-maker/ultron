"""Configuration for the Operator agent.

Defaults to a local Ollama model (no API key) but is pluggable: point
OPERATOR_BASE_URL / OPERATOR_API_KEY / OPERATOR_MODEL at any OpenAI-compatible
endpoint to use a stronger model.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

DEFAULT_BASE_URL = "http://127.0.0.1:11434/v1"
DEFAULT_MODEL = "llama3.1"


def _i(name: str, default: int) -> int:
    raw = os.getenv(name)
    try:
        return int(raw) if raw and raw.strip() else default
    except ValueError:
        return default


def _f(name: str, default: float) -> float:
    raw = os.getenv(name)
    try:
        return float(raw) if raw and raw.strip() else default
    except ValueError:
        return default


def _b(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


@dataclass
class Config:
    # --- model / brain ---
    base_url: str = DEFAULT_BASE_URL
    model: str = DEFAULT_MODEL
    api_key: str | None = None
    temperature: float = 0.3
    request_timeout: int = 300

    # --- agent loop ---
    max_steps: int = 20            # max tool actions per task
    budget_seconds: int = 900      # wall-clock budget per task (default 15 min)

    # --- autonomy / safety ---
    # "approval" = ask before every shell command (default, safest)
    # "semi"     = read-only tools run freely, ask before shell/changes
    # "auto"     = run without prompting (use only when you trust the setup)
    autonomy: str = "approval"
    # Active security testing is OFF by default (learn + recon only). Turning it
    # on still requires every target to be in the scope allowlist.
    allow_active_testing: bool = False

    # --- storage ---
    data_dir: Path = Path(os.path.expanduser("~/.operator"))

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            base_url=os.getenv("OPERATOR_BASE_URL", DEFAULT_BASE_URL).rstrip("/"),
            model=os.getenv("OPERATOR_MODEL", DEFAULT_MODEL),
            api_key=os.getenv("OPERATOR_API_KEY") or None,
            temperature=_f("OPERATOR_TEMPERATURE", 0.3),
            request_timeout=_i("OPERATOR_TIMEOUT", 300),
            max_steps=_i("OPERATOR_MAX_STEPS", 20),
            budget_seconds=_i("OPERATOR_BUDGET_SECONDS", 900),
            autonomy=os.getenv("OPERATOR_AUTONOMY", "approval").strip().lower(),
            allow_active_testing=_b("OPERATOR_ALLOW_ACTIVE_TESTING", False),
            data_dir=Path(
                os.path.expanduser(os.getenv("OPERATOR_DATA_DIR", "~/.operator"))
            ),
        )

    @property
    def chat_url(self) -> str:
        return f"{self.base_url}/chat/completions"

    @property
    def models_url(self) -> str:
        return f"{self.base_url}/models"

    @property
    def kb_dir(self) -> Path:
        return self.data_dir / "kb"

    @property
    def scope_file(self) -> Path:
        return self.data_dir / "scope.txt"

    @property
    def backlog_file(self) -> Path:
        return self.data_dir / "backlog.txt"

    @property
    def facts_file(self) -> Path:
        return self.data_dir / "facts.jsonl"

    def ensure_dirs(self) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.kb_dir.mkdir(parents=True, exist_ok=True)
