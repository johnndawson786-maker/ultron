"""Configuration for the Claude Fable 5 chat app.

All settings can be overridden with environment variables (see .env.example).
Nothing here hardcodes an API key — the Anthropic SDK resolves credentials
from the environment (ANTHROPIC_API_KEY) or an `ant auth login` profile.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field

# Claude Fable 5 — Anthropic's most capable widely released model.
# See README for the API characteristics this app relies on.
DEFAULT_MODEL = "claude-fable-5"

# Server-side refusal fallback: Fable 5's safety classifiers can decline a
# request (HTTP 200 with stop_reason "refusal"). When enabled, the API re-runs
# the request on the fallback model in the same call. claude-opus-4-8 is the
# supported fallback target.
DEFAULT_FALLBACK_MODEL = "claude-opus-4-8"
FALLBACK_BETA = "server-side-fallback-2026-06-01"

DEFAULT_SYSTEM_PROMPT = (
    "You are Fable, a sharp, friendly assistant powered by Claude Fable 5. "
    "Answer clearly and lead with the outcome. Keep responses focused and "
    "concise; expand only when the question calls for depth."
)

VALID_EFFORTS = ("low", "medium", "high", "xhigh", "max")


def _env_bool(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None or not raw.strip():
        return default
    try:
        return int(raw)
    except ValueError:
        return default


@dataclass
class Config:
    """Runtime configuration, populated from the environment."""

    model: str = DEFAULT_MODEL
    system_prompt: str = DEFAULT_SYSTEM_PROMPT
    # Streaming default is generous — timeouts aren't a concern when streaming,
    # so give the model room. Fable 5 supports up to 128K output tokens.
    max_tokens: int = 16000
    effort: str = "high"  # low | medium | high | xhigh | max
    use_fallback: bool = True
    fallback_model: str = DEFAULT_FALLBACK_MODEL
    # Show a readable summary of the model's reasoning as it thinks.
    show_thinking: bool = False
    api_key: str | None = field(default=None, repr=False)

    @classmethod
    def from_env(cls) -> "Config":
        effort = os.getenv("FABLE5_EFFORT", "high").strip().lower()
        if effort not in VALID_EFFORTS:
            effort = "high"
        return cls(
            model=os.getenv("FABLE5_MODEL", DEFAULT_MODEL),
            system_prompt=os.getenv("FABLE5_SYSTEM_PROMPT", DEFAULT_SYSTEM_PROMPT),
            max_tokens=_env_int("FABLE5_MAX_TOKENS", 16000),
            effort=effort,
            use_fallback=_env_bool("FABLE5_USE_FALLBACK", True),
            fallback_model=os.getenv("FABLE5_FALLBACK_MODEL", DEFAULT_FALLBACK_MODEL),
            show_thinking=_env_bool("FABLE5_SHOW_THINKING", False),
            # If unset, the SDK still finds credentials (env or ant profile).
            api_key=os.getenv("ANTHROPIC_API_KEY"),
        )
