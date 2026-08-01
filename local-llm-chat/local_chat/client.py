"""Streaming client for a local OpenAI-compatible server (e.g. Ollama).

Pure standard library — no pip dependencies. It POSTs to
`/v1/chat/completions` with `stream: true` and parses the Server-Sent Events
response, yielding text as the local model generates it.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from .config import Config


class LocalServerError(RuntimeError):
    """Raised when the local server is unreachable or returns an error."""


@dataclass
class ChatResult:
    text: str
    model: str | None
    # Prompt/completion token counts if the server reports them (Ollama does).
    prompt_tokens: int | None
    completion_tokens: int | None


class LocalChatClient:
    """Talks to a local OpenAI-compatible chat server."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.config.api_key:
            headers["Authorization"] = f"Bearer {self.config.api_key}"
        return headers

    def _payload(self, messages: list[dict[str, Any]], stream: bool) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": self.config.model,
            "messages": messages,
            "temperature": self.config.temperature,
            "stream": stream,
        }
        if self.config.max_tokens and self.config.max_tokens > 0:
            payload["max_tokens"] = self.config.max_tokens
        return payload

    def check_server(self) -> list[str]:
        """Return the list of available model names, or raise LocalServerError."""
        req = urllib.request.Request(
            self.config.models_url, headers=self._headers(), method="GET"
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.URLError as exc:
            raise LocalServerError(str(getattr(exc, "reason", exc))) from exc
        except Exception as exc:  # noqa: BLE001
            raise LocalServerError(str(exc)) from exc
        return [m.get("id", "") for m in data.get("data", []) if m.get("id")]

    def stream_reply(
        self,
        messages: list[dict[str, Any]],
        on_text: Callable[[str], None] | None = None,
    ) -> ChatResult:
        """Stream one assistant turn and return the full result."""
        body = json.dumps(self._payload(messages, stream=True)).encode("utf-8")
        req = urllib.request.Request(
            self.config.chat_url, data=body, headers=self._headers(), method="POST"
        )

        parts: list[str] = []
        model_name: str | None = None
        prompt_tokens: int | None = None
        completion_tokens: int | None = None

        try:
            with urllib.request.urlopen(req, timeout=self.config.request_timeout) as resp:
                for raw in resp:  # HTTP response iterates line by line
                    line = raw.decode("utf-8", errors="replace").strip()
                    if not line or not line.startswith("data:"):
                        continue
                    data = line[len("data:"):].strip()
                    if data == "[DONE]":
                        break
                    try:
                        obj = json.loads(data)
                    except json.JSONDecodeError:
                        continue

                    if model_name is None:
                        model_name = obj.get("model")

                    for choice in obj.get("choices", []):
                        delta = choice.get("delta") or {}
                        chunk = delta.get("content")
                        if chunk:
                            parts.append(chunk)
                            if on_text is not None:
                                on_text(chunk)

                    usage = obj.get("usage")
                    if usage:
                        prompt_tokens = usage.get("prompt_tokens", prompt_tokens)
                        completion_tokens = usage.get(
                            "completion_tokens", completion_tokens
                        )
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")[:500]
            raise LocalServerError(
                f"Server returned HTTP {exc.code}: {detail}"
            ) from exc
        except urllib.error.URLError as exc:
            raise LocalServerError(str(getattr(exc, "reason", exc))) from exc

        return ChatResult(
            text="".join(parts),
            model=model_name,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
        )
