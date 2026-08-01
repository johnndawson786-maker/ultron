"""Entry point: `python -m local_chat`."""

from __future__ import annotations

from .chat import ChatSession
from .config import Config


def main() -> int:
    config = Config.from_env()
    ChatSession(config).run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
