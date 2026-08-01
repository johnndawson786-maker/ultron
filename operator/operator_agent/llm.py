"""Pluggable LLM client — local Ollama or any OpenAI-compatible API.

Standard library only. Exposes a tiny protocol so the agent can be tested with
a fake model offline.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from collections.abc import Callable
from typing import Any, Protocol

from .config import Config


class LLMError(RuntimeError):
    pass


class LLM(Protocol):
    def complete(self, messages: list[dict[str, Any]]) -> str: ...
    def stream(self, messages: list[dict[str, Any]], on_text: Callable[[str], None]) -> str: ...


class ChatLLM:
    def __init__(self, config: Config) -> None:
        self.config = config

    def _headers(self) -> dict[str, str]:
        h = {"Content-Type": "application/json"}
        if self.config.api_key:
            h["Authorization"] = f"Bearer {self.config.api_key}"
        return h

    def _payload(self, messages: list[dict[str, Any]], stream: bool) -> dict[str, Any]:
        return {
            "model": self.config.model,
            "messages": messages,
            "temperature": self.config.temperature,
            "stream": stream,
        }

    def available_models(self) -> list[str]:
        req = urllib.request.Request(self.config.models_url, headers=self._headers())
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except Exception as exc:  # noqa: BLE001
            raise LLMError(str(getattr(exc, "reason", exc))) from exc
        return [m.get("id", "") for m in data.get("data", []) if m.get("id")]

    def complete(self, messages: list[dict[str, Any]]) -> str:
        body = json.dumps(self._payload(messages, False)).encode()
        req = urllib.request.Request(
            self.config.chat_url, data=body, headers=self._headers(), method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=self.config.request_timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            raise LLMError(f"HTTP {exc.code}: {exc.read().decode(errors='replace')[:300]}") from exc
        except urllib.error.URLError as exc:
            raise LLMError(str(getattr(exc, "reason", exc))) from exc
        return ((data.get("choices") or [{}])[0].get("message") or {}).get("content", "") or ""

    def stream(self, messages: list[dict[str, Any]], on_text: Callable[[str], None]) -> str:
        body = json.dumps(self._payload(messages, True)).encode()
        req = urllib.request.Request(
            self.config.chat_url, data=body, headers=self._headers(), method="POST"
        )
        parts: list[str] = []
        try:
            with urllib.request.urlopen(req, timeout=self.config.request_timeout) as resp:
                for raw in resp:
                    line = raw.decode("utf-8", errors="replace").strip()
                    if not line.startswith("data:"):
                        continue
                    payload = line[len("data:"):].strip()
                    if payload == "[DONE]":
                        break
                    try:
                        obj = json.loads(payload)
                    except json.JSONDecodeError:
                        continue
                    for ch in obj.get("choices", []):
                        chunk = (ch.get("delta") or {}).get("content")
                        if chunk:
                            parts.append(chunk)
                            on_text(chunk)
        except urllib.error.HTTPError as exc:
            raise LLMError(f"HTTP {exc.code}: {exc.read().decode(errors='replace')[:300]}") from exc
        except urllib.error.URLError as exc:
            raise LLMError(str(getattr(exc, "reason", exc))) from exc
        return "".join(parts)
