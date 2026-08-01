"""Offline tests for configuration parsing (no network / no API key needed).

Run with:  python -m pytest   (or)   python tests/test_config.py
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from claude_fable5_chat.config import DEFAULT_MODEL, Config  # noqa: E402


def _clear_env(monkeypatch_names: list[str]) -> None:
    for name in monkeypatch_names:
        os.environ.pop(name, None)


def test_defaults():
    _clear_env(
        ["FABLE5_MODEL", "FABLE5_EFFORT", "FABLE5_MAX_TOKENS", "FABLE5_USE_FALLBACK"]
    )
    cfg = Config.from_env()
    assert cfg.model == DEFAULT_MODEL == "claude-fable-5"
    assert cfg.effort == "high"
    assert cfg.max_tokens == 16000
    assert cfg.use_fallback is True


def test_env_overrides():
    os.environ["FABLE5_EFFORT"] = "xhigh"
    os.environ["FABLE5_MAX_TOKENS"] = "32000"
    os.environ["FABLE5_USE_FALLBACK"] = "false"
    cfg = Config.from_env()
    assert cfg.effort == "xhigh"
    assert cfg.max_tokens == 32000
    assert cfg.use_fallback is False
    _clear_env(["FABLE5_EFFORT", "FABLE5_MAX_TOKENS", "FABLE5_USE_FALLBACK"])


def test_invalid_effort_falls_back_to_high():
    os.environ["FABLE5_EFFORT"] = "turbo"
    cfg = Config.from_env()
    assert cfg.effort == "high"
    _clear_env(["FABLE5_EFFORT"])


def test_invalid_max_tokens_falls_back():
    os.environ["FABLE5_MAX_TOKENS"] = "not-a-number"
    cfg = Config.from_env()
    assert cfg.max_tokens == 16000
    _clear_env(["FABLE5_MAX_TOKENS"])


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"ok  {name}")
    print("All tests passed.")
