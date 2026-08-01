"""Safety layer: destructive-command blocking, approval gates, and scope control.

Two independent protections:

1. Command safety — obviously destructive shell commands are hard-denied; every
   other command is approval-gated according to the autonomy setting.
2. Scope — active security testing is off by default and, even when enabled,
   only runs against hosts you have listed in the authorized scope allowlist.
   This is what keeps bug-bounty work legal: you test only what you're allowed
   to test.
"""

from __future__ import annotations

import re
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

# Commands that are never run, regardless of autonomy setting.
_HARD_DENY = [
    r"\brm\s+-rf\s+/(?:\s|$)",        # rm -rf /
    r"\brm\s+-rf\s+/\*",
    r"\bmkfs\b",                        # format a filesystem
    r"\bdd\b[^\n]*\bof=/dev/",          # overwrite a block device
    r">\s*/dev/sd[a-z]",
    r"\b:\(\)\s*\{\s*:\|:&\s*\}\s*;",  # fork bomb
    r"\bshutdown\b|\breboot\b|\bhalt\b|\bpoweroff\b",
    r"\bmv\s+/\s|\bchown\s+-R[^\n]*\s/\s",
    r"\bchmod\s+-R\s+0*\s+/",
    r"curl[^\n]*\|\s*(sudo\s+)?(bash|sh)\b",   # curl | sh (pipe-to-shell)
    r"wget[^\n]*\|\s*(sudo\s+)?(bash|sh)\b",
]

# Tools associated with ACTIVE testing (send traffic to a target). Gated behind
# both `allow_active_testing` and the scope allowlist.
ACTIVE_TOOLS = (
    "nmap", "masscan", "nuclei", "sqlmap", "ffuf", "gobuster", "dirb", "dirbuster",
    "hydra", "medusa", "wpscan", "nikto", "metasploit", "msfconsole", "wfuzz",
    "feroxbuster", "arjun", "dalfox", "commix",
)


@dataclass
class Decision:
    allowed: bool
    needs_approval: bool
    reason: str


def is_hard_denied(command: str) -> bool:
    c = command.strip()
    return any(re.search(p, c) for p in _HARD_DENY)


def mentions_active_tool(command: str) -> str | None:
    toks = re.findall(r"[a-zA-Z0-9_\-]+", command.lower())
    for t in ACTIVE_TOOLS:
        if t in toks:
            return t
    return None


class Scope:
    """The authorized-targets allowlist (one host/domain per line)."""

    def __init__(self, path: Path) -> None:
        self.path = path

    def hosts(self) -> list[str]:
        if not self.path.exists():
            return []
        out = []
        for line in self.path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                out.append(line.lower())
        return out

    def add(self, host: str) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        hosts = set(self.hosts())
        host = host.strip().lower()
        if host and host not in hosts:
            with self.path.open("a", encoding="utf-8") as f:
                f.write(host + "\n")

    def covers(self, target: str) -> bool:
        target = target.strip().lower()
        for h in self.hosts():
            # Match the host itself or any subdomain of it.
            if target == h or target.endswith("." + h):
                return True
        return False


# An approver takes a human-readable prompt and returns True to proceed.
Approver = Callable[[str], bool]


def cli_approver(prompt: str) -> bool:
    try:
        ans = input(f"{prompt}  [y/N] ").strip().lower()
    except (EOFError, KeyboardInterrupt):
        return False
    return ans in ("y", "yes")


def auto_approver(_: str) -> bool:
    return True


def deny_approver(_: str) -> bool:
    return False
