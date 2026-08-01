"""Interactive terminal chat loop for Claude Fable 5."""

from __future__ import annotations

import sys
from typing import Any

import anthropic

from .client import FableChatClient, StreamResult
from .config import VALID_EFFORTS, Config


# --- tiny ANSI helpers (no external deps) --------------------------------

_USE_COLOR = sys.stdout.isatty()


def _c(code: str, text: str) -> str:
    return f"\033[{code}m{text}\033[0m" if _USE_COLOR else text


def bold(t: str) -> str:
    return _c("1", t)


def dim(t: str) -> str:
    return _c("2", t)


def cyan(t: str) -> str:
    return _c("36", t)


def green(t: str) -> str:
    return _c("32", t)


def yellow(t: str) -> str:
    return _c("33", t)


def red(t: str) -> str:
    return _c("31", t)


BANNER = f"""{bold('Claude Fable 5 Chat')}  {dim('v1')}
{dim('Type your message and press Enter. Commands:')}
  {cyan('/reset')}    {dim('clear the conversation')}
  {cyan('/effort')}  {dim('show or set effort (low|medium|high|xhigh|max)')}
  {cyan('/system')} {dim('show or set the system prompt')}
  {cyan('/help')}     {dim('show this help')}
  {cyan('/exit')}     {dim('quit (Ctrl-D also works)')}
"""


class ChatSession:
    """Owns the conversation history and drives the REPL."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.client = FableChatClient(config)
        self.messages: list[dict[str, Any]] = []

    # --- command handling ------------------------------------------------

    def _handle_command(self, line: str) -> bool:
        """Return True if the input was a command (already handled)."""
        parts = line.strip().split(maxsplit=1)
        cmd = parts[0].lower()
        arg = parts[1].strip() if len(parts) > 1 else ""

        if cmd in ("/exit", "/quit"):
            raise EOFError
        if cmd == "/help":
            print(BANNER)
        elif cmd == "/reset":
            self.messages.clear()
            print(dim("Conversation cleared."))
        elif cmd == "/effort":
            if not arg:
                print(dim(f"Effort is {bold(self.config.effort)}."))
            elif arg.lower() in VALID_EFFORTS:
                self.config.effort = arg.lower()
                print(dim(f"Effort set to {bold(self.config.effort)}."))
            else:
                print(red(f"Invalid effort. Choose one of: {', '.join(VALID_EFFORTS)}"))
        elif cmd == "/system":
            if not arg:
                print(dim("Current system prompt:"))
                print(self.config.system_prompt)
            else:
                self.config.system_prompt = arg
                print(dim("System prompt updated. (Applies to the next reply.)"))
        else:
            print(red(f"Unknown command: {cmd}. Try /help."))
        return True

    # --- one turn --------------------------------------------------------

    def _send(self, user_text: str) -> None:
        self.messages.append({"role": "user", "content": user_text})

        printed_thinking = {"active": False}

        def on_thinking(chunk: str) -> None:
            if not printed_thinking["active"]:
                print(dim("\n[thinking] "), end="", flush=True)
                printed_thinking["active"] = True
            print(dim(chunk), end="", flush=True)

        def on_text(chunk: str) -> None:
            if printed_thinking["active"]:
                print("\n")
                printed_thinking["active"] = False
            print(chunk, end="", flush=True)

        print(green(bold("\nFable ")), end="", flush=True)
        try:
            result: StreamResult = self.client.stream_reply(
                self.messages,
                on_text=on_text,
                on_thinking=on_thinking if self.config.show_thinking else None,
            )
        except anthropic.APIStatusError as exc:
            # Remove the user turn we optimistically appended so history stays clean.
            self.messages.pop()
            print(red(f"\n[API error {exc.status_code}] {exc.message}"))
            return
        except anthropic.APIConnectionError:
            self.messages.pop()
            print(red("\n[Network error] Could not reach the API. Check your connection."))
            return

        print()  # end the streamed line

        if result.refused:
            # The whole chain (including any fallback) declined.
            self.messages.pop()  # don't keep an empty assistant turn
            print(yellow("\n[Fable declined this request for safety reasons.]"))
            return

        # Preserve the full content (incl. thinking blocks) for same-model replay.
        self.messages.append({"role": "assistant", "content": result.content})

        note = f"{result.input_tokens} in / {result.output_tokens} out tokens"
        if result.model and result.model not in self.config.model:
            note += f" · served by {result.model}"
        print(dim(f"\n{note}"))

    # --- REPL ------------------------------------------------------------

    def run(self) -> None:
        print(BANNER)
        while True:
            try:
                line = input(cyan(bold("You > ")))
            except (EOFError, KeyboardInterrupt):
                print(dim("\nGoodbye."))
                return

            if not line.strip():
                continue
            if line.strip().startswith("/"):
                try:
                    self._handle_command(line)
                except EOFError:
                    print(dim("Goodbye."))
                    return
                continue

            self._send(line)
