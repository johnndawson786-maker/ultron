"""Thin wrapper around the Anthropic SDK, specialised for Claude Fable 5.

Key Fable 5 rules this module encodes (see the Anthropic docs):

* Thinking is always on — never send a `thinking` config other than adaptive,
  and never send `budget_tokens` (both 400). Depth is controlled with
  `output_config.effort`.
* The raw chain of thought is never returned. With `display: "summarized"` you
  get a readable summary; the default is empty-text thinking blocks.
* Safety classifiers may decline a request: HTTP 200 with
  `stop_reason == "refusal"`. Always check `stop_reason` before reading text.
* Opt into server-side refusal fallbacks so a declined request is retried on
  a fallback model within the same call.
* Stream long responses so the request doesn't hit HTTP timeouts.
* When continuing a conversation on the same model, pass thinking blocks back
  unchanged — so we append the full `response.content`, not just the text.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any

import anthropic

from .config import FALLBACK_BETA, Config


@dataclass
class StreamResult:
    """What a completed streamed turn produced."""

    text: str
    # Full content blocks from the final message — appended verbatim to the
    # conversation so thinking blocks replay unchanged on the same model.
    content: list[Any]
    stop_reason: str | None
    model: str  # the model that actually produced the message
    refused: bool
    input_tokens: int
    output_tokens: int


class FableChatClient:
    """Sends conversations to Claude Fable 5 and streams the reply."""

    def __init__(self, config: Config) -> None:
        self.config = config
        # A bare constructor resolves credentials from ANTHROPIC_API_KEY or an
        # `ant auth login` profile. Passing api_key=None is equivalent.
        self.client = anthropic.Anthropic(api_key=config.api_key)

    def _request_kwargs(self, messages: list[dict[str, Any]]) -> dict[str, Any]:
        kwargs: dict[str, Any] = {
            "model": self.config.model,
            "max_tokens": self.config.max_tokens,
            "system": self.config.system_prompt,
            "messages": messages,
            # effort lives inside output_config, not top-level.
            "output_config": {"effort": self.config.effort},
        }
        if self.config.show_thinking:
            # Opt into a readable reasoning summary (default is omitted).
            kwargs["thinking"] = {"type": "adaptive", "display": "summarized"}
        if self.config.use_fallback:
            # Server-side refusal fallback (Claude API only).
            kwargs["betas"] = [FALLBACK_BETA]
            kwargs["fallbacks"] = [{"model": self.config.fallback_model}]
        return kwargs

    def stream_reply(
        self,
        messages: list[dict[str, Any]],
        on_text: "Any" = None,
        on_thinking: "Any" = None,
    ) -> StreamResult:
        """Stream one assistant turn.

        `on_text(chunk)` is called for each chunk of the visible answer.
        `on_thinking(chunk)` is called for each chunk of the reasoning summary
        (only when show_thinking is enabled).
        """
        kwargs = self._request_kwargs(messages)

        # When fallbacks are enabled we must use the beta endpoint; otherwise
        # the plain streaming endpoint is fine. Both expose the same helpers.
        stream_ctx = (
            self.client.beta.messages.stream(**kwargs)
            if self.config.use_fallback
            else self.client.messages.stream(**kwargs)
        )

        with stream_ctx as stream:
            for event in stream:
                etype = getattr(event, "type", None)
                if etype != "content_block_delta":
                    continue
                delta = event.delta
                dtype = getattr(delta, "type", None)
                if dtype == "text_delta" and on_text is not None:
                    on_text(delta.text)
                elif dtype == "thinking_delta" and on_thinking is not None:
                    on_thinking(delta.thinking)

            final = stream.get_final_message()

        text = "".join(b.text for b in final.content if b.type == "text")
        return StreamResult(
            text=text,
            content=final.content,
            stop_reason=final.stop_reason,
            model=final.model,
            refused=final.stop_reason == "refusal",
            input_tokens=final.usage.input_tokens,
            output_tokens=final.usage.output_tokens,
        )
