"""Configuration for the local chat app.

Everything runs against a local server (default: Ollama on 127.0.0.1:11434),
so there is no API key and nothing leaves your machine. All settings can be
overridden with environment variables.
"""

from __future__ import annotations

import os
from dataclasses import dataclass

# Ollama exposes an OpenAI-compatible API at /v1. LM Studio and llama.cpp's
# server do too, so this app works with any of them by changing LOCAL_BASE_URL.
DEFAULT_BASE_URL = "http://127.0.0.1:11434/v1"

# A small, fast, capable default. Pull it with:  ollama pull llama3.2
DEFAULT_MODEL = "llama3.2"

DEFAULT_SYSTEM_PROMPT = (
    "You are a helpful, friendly assistant running locally on the user's "
    "machine. Answer clearly and lead with the useful part. Keep responses "
    "focused; expand only when the question needs depth."
)


def _env_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None or not raw.strip():
        return default
    try:
        return float(raw)
    except ValueError:
        return default


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

    base_url: str = DEFAULT_BASE_URL
    model: str = DEFAULT_MODEL
    system_prompt: str = DEFAULT_SYSTEM_PROMPT
    temperature: float = 0.7
    # 0 / negative means "no explicit limit" — let the server decide.
    max_tokens: int = 0
    # Only sent if set; local servers don't require auth, but some proxies do.
    api_key: str | None = None
    request_timeout: int = 300

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            base_url=os.getenv("LOCAL_BASE_URL", DEFAULT_BASE_URL).rstrip("/"),
            model=os.getenv("LOCAL_MODEL", DEFAULT_MODEL),
            system_prompt=os.getenv("LOCAL_SYSTEM_PROMPT", DEFAULT_SYSTEM_PROMPT),
            temperature=_env_float("LOCAL_TEMPERATURE", 0.7),
            max_tokens=_env_int("LOCAL_MAX_TOKENS", 0),
            api_key=os.getenv("LOCAL_API_KEY") or None,
            request_timeout=_env_int("LOCAL_TIMEOUT", 300),
        )

    @property
    def chat_url(self) -> str:
        return f"{self.base_url}/chat/completions"

    @property
    def models_url(self) -> str:
        return f"{self.base_url}/models"
