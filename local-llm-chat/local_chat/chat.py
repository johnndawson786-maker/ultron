"""Interactive terminal chat loop for a locally-run model."""

from __future__ import annotations

import sys
from typing import Any

from .client import ChatResult, LocalChatClient, LocalServerError
from .config import Config

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


def banner(cfg: Config) -> str:
    return f"""{bold('Local Chat')}  {dim('v1 · fully offline, no API key')}
{dim('Model:')} {cyan(cfg.model)}   {dim('Server:')} {cyan(cfg.base_url)}
{dim('Type your message and press Enter. Commands:')}
  {cyan('/reset')}    {dim('clear the conversation')}
  {cyan('/model')}   {dim('show or switch the model')}
  {cyan('/system')} {dim('show or set the system prompt')}
  {cyan('/temp')}     {dim('show or set temperature (0.0-2.0)')}
  {cyan('/help')}     {dim('show this help')}
  {cyan('/exit')}     {dim('quit (Ctrl-D also works)')}
"""


class ChatSession:
    """Owns the conversation history and drives the REPL."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.client = LocalChatClient(config)
        # OpenAI-style history begins with the system prompt.
        self.messages: list[dict[str, Any]] = []

    def _base_messages(self) -> list[dict[str, Any]]:
        return [{"role": "system", "content": self.config.system_prompt}, *self.messages]

    # --- commands --------------------------------------------------------

    def _handle_command(self, line: str) -> None:
        parts = line.strip().split(maxsplit=1)
        cmd = parts[0].lower()
        arg = parts[1].strip() if len(parts) > 1 else ""

        if cmd in ("/exit", "/quit"):
            raise EOFError
        if cmd == "/help":
            print(banner(self.config))
        elif cmd == "/reset":
            self.messages.clear()
            print(dim("Conversation cleared."))
        elif cmd == "/model":
            if not arg:
                print(dim(f"Model is {bold(self.config.model)}."))
                self._print_available_models()
            else:
                self.config.model = arg
                print(dim(f"Model set to {bold(self.config.model)}."))
        elif cmd == "/system":
            if not arg:
                print(dim("Current system prompt:"))
                print(self.config.system_prompt)
            else:
                self.config.system_prompt = arg
                print(dim("System prompt updated."))
        elif cmd == "/temp":
            if not arg:
                print(dim(f"Temperature is {bold(str(self.config.temperature))}."))
            else:
                try:
                    self.config.temperature = max(0.0, min(2.0, float(arg)))
                    print(dim(f"Temperature set to {bold(str(self.config.temperature))}."))
                except ValueError:
                    print(red("Temperature must be a number between 0.0 and 2.0."))
        else:
            print(red(f"Unknown command: {cmd}. Try /help."))

    def _print_available_models(self) -> None:
        try:
            models = self.client.check_server()
        except LocalServerError:
            return
        if models:
            print(dim("Available locally: " + ", ".join(models)))

    # --- one turn --------------------------------------------------------

    def _send(self, user_text: str) -> None:
        self.messages.append({"role": "user", "content": user_text})

        def on_text(chunk: str) -> None:
            print(chunk, end="", flush=True)

        print(green(bold("\nAssistant ")), end="", flush=True)
        try:
            result: ChatResult = self.client.stream_reply(
                self._base_messages(), on_text=on_text
            )
        except LocalServerError as exc:
            self.messages.pop()  # keep history clean
            print(red(f"\n[Local server error] {exc}"))
            print(
                yellow(
                    "Is the server running? For Ollama:\n"
                    "  1. Start it:   ollama serve\n"
                    f"  2. Pull model: ollama pull {self.config.model}\n"
                )
            )
            return

        print()  # end streamed line

        if not result.text.strip():
            self.messages.pop()
            print(yellow("[No response received from the model.]"))
            return

        self.messages.append({"role": "assistant", "content": result.text})

        if result.prompt_tokens is not None or result.completion_tokens is not None:
            p = result.prompt_tokens or 0
            c = result.completion_tokens or 0
            print(dim(f"\n{p} prompt / {c} completion tokens"))

    # --- REPL ------------------------------------------------------------

    def run(self) -> None:
        print(banner(self.config))
        # Friendly upfront check so failures are obvious before the first message.
        self._preflight()
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

    def _preflight(self) -> None:
        try:
            models = self.client.check_server()
        except LocalServerError as exc:
            print(
                yellow(
                    f"⚠  Could not reach the local server at {self.config.base_url}\n"
                    f"   ({exc})\n"
                    "   Start Ollama with `ollama serve`, then "
                    f"`ollama pull {self.config.model}`.\n"
                )
            )
            return
        if models and self.config.model not in models:
            print(
                yellow(
                    f"⚠  Model '{self.config.model}' isn't pulled yet. "
                    f"Run:  ollama pull {self.config.model}\n"
                    f"   Available now: {', '.join(models) or '(none)'}\n"
                )
            )
