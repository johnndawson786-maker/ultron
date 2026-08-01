"""Entry point: `python -m claude_fable5_chat`."""

from __future__ import annotations

import sys

import anthropic

from .chat import ChatSession, red, yellow
from .config import Config


def main() -> int:
    config = Config.from_env()

    if not config.api_key:
        # Not fatal — the SDK can still use an `ant auth login` profile — but
        # warn, since most users run this with an API key.
        print(
            yellow(
                "Warning: ANTHROPIC_API_KEY is not set. The app will try an "
                "`ant auth login` profile; set the key in a .env or your shell "
                "if you don't have one.\n"
            ),
            file=sys.stderr,
        )

    session = ChatSession(config)
    try:
        session.run()
    except anthropic.AuthenticationError:
        print(red("Authentication failed. Check your ANTHROPIC_API_KEY."), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
