"""The agent's tools. Each returns a short text 'observation'.

Tools are plain callables so they can be swapped with fakes in tests. The
registry also produces the tool documentation injected into the system prompt.
"""

from __future__ import annotations

import html
import platform
import re
import shutil
import subprocess
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path

from .config import Config
from .memory import Memory
from .safety import (
    Approver,
    Scope,
    is_hard_denied,
    mentions_active_tool,
)

_UA = "Mozilla/5.0 (X11; Linux x86_64) Operator/1.0"
_MAX_OBS = 6000


def _truncate(text: str, n: int = _MAX_OBS) -> str:
    text = text.strip()
    return text if len(text) <= n else text[:n] + f"\n...[truncated {len(text) - n} chars]"


@dataclass
class ToolSpec:
    name: str
    args: str
    description: str


class Tools:
    def __init__(self, config: Config, memory: Memory, approver: Approver) -> None:
        self.config = config
        self.memory = memory
        self.approver = approver
        self.scope = Scope(config.scope_file)

    # --- web -------------------------------------------------------------

    def web_search(self, query: str = "", k: int = 5, **_) -> str:
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": _UA})
            with urllib.request.urlopen(req, timeout=20) as resp:
                page = resp.read().decode("utf-8", errors="replace")
        except Exception as exc:  # noqa: BLE001
            return f"web_search error: {exc}"
        results = []
        for m in re.finditer(
            r'<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', page, re.S
        ):
            href, title = m.group(1), re.sub(r"<[^>]+>", "", m.group(2))
            # DDG wraps links: /l/?uddg=<encoded target>
            q = urllib.parse.urlparse(href).query
            params = urllib.parse.parse_qs(q)
            real = params.get("uddg", [href])[0]
            results.append((html.unescape(title.strip()), real))
            if len(results) >= k:
                break
        if not results:
            return "No results (or the search page format changed)."
        return "\n".join(f"{i+1}. {t}\n   {u}" for i, (t, u) in enumerate(results))

    def web_read(self, url: str = "", max_chars: int = 4000, **_) -> str:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": _UA})
            with urllib.request.urlopen(req, timeout=25) as resp:
                raw = resp.read().decode("utf-8", errors="replace")
        except Exception as exc:  # noqa: BLE001
            return f"web_read error: {exc}"
        raw = re.sub(r"(?is)<(script|style|noscript|svg).*?</\1>", " ", raw)
        text = re.sub(r"(?s)<[^>]+>", " ", raw)
        text = html.unescape(re.sub(r"[ \t]+", " ", text))
        text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)
        return _truncate(text, max_chars)

    # --- shell (approval + safety gated) ---------------------------------

    def shell(self, command: str = "", **_) -> str:
        command = command.strip()
        if not command:
            return "shell error: empty command."
        if is_hard_denied(command):
            return "DENIED: destructive command blocked by safety policy."

        active = mentions_active_tool(command)
        if active:
            if not self.config.allow_active_testing:
                return (
                    f"REFUSED: '{active}' is an active security-testing tool and "
                    "active testing is disabled. Enable it only for authorized "
                    "targets: set OPERATOR_ALLOW_ACTIVE_TESTING=true and add the "
                    "target with `operator scope add <host>`."
                )
            if not any(h in command.lower() for h in self.scope.hosts()):
                return (
                    f"REFUSED: '{active}' would run against a target not in your "
                    "authorized scope allowlist. Add it with "
                    "`operator scope add <host>` only if you are permitted to test it."
                )

        needs_approval = self.config.autonomy != "auto"
        if needs_approval and not self.approver(f"Run shell command?\n  $ {command}"):
            return "SKIPPED: you declined this command."

        try:
            proc = subprocess.run(
                command, shell=True, capture_output=True, text=True, timeout=180
            )
        except subprocess.TimeoutExpired:
            return "shell error: command timed out (180s)."
        out = (proc.stdout or "") + (("\n[stderr]\n" + proc.stderr) if proc.stderr else "")
        return _truncate(f"exit={proc.returncode}\n{out}".strip())

    # --- files -----------------------------------------------------------

    def read_file(self, path: str = "", **_) -> str:
        try:
            return _truncate(Path(path).expanduser().read_text(encoding="utf-8", errors="replace"))
        except Exception as exc:  # noqa: BLE001
            return f"read_file error: {exc}"

    def write_file(self, path: str = "", content: str = "", **_) -> str:
        p = Path(path).expanduser()
        if self.config.autonomy != "auto" and not self.approver(f"Write file {p}?"):
            return "SKIPPED: you declined the write."
        try:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content, encoding="utf-8")
            return f"wrote {len(content)} chars to {p}"
        except Exception as exc:  # noqa: BLE001
            return f"write_file error: {exc}"

    # --- memory ----------------------------------------------------------

    def remember(self, text: str = "", tags: str = "", **_) -> str:
        return self.memory.remember(text, tags)

    def recall(self, query: str = "", **_) -> str:
        return self.memory.recall(query)

    def save_note(self, title: str = "", content: str = "", **_) -> str:
        path = self.memory.write_note(title, content)
        return f"saved knowledge-base note: {path}"

    # --- system ----------------------------------------------------------

    def sysinfo(self, **_) -> str:
        lines = [f"platform: {platform.platform()}", f"python: {platform.python_version()}"]
        osr = Path("/etc/os-release")
        if osr.exists():
            for ln in osr.read_text(errors="replace").splitlines():
                if ln.startswith("PRETTY_NAME="):
                    lines.append("os: " + ln.split("=", 1)[1].strip().strip('"'))
        try:
            import os as _os
            lines.append(f"cpu_cores: {_os.cpu_count()}")
        except Exception:  # noqa: BLE001
            pass
        mem = Path("/proc/meminfo")
        if mem.exists():
            for ln in mem.read_text(errors="replace").splitlines():
                if ln.startswith("MemTotal:"):
                    lines.append("mem_total: " + ln.split(":", 1)[1].strip())
                    break
        try:
            du = shutil.disk_usage("/")
            lines.append(f"disk_free: {du.free // (1024**3)} GiB / {du.total // (1024**3)} GiB")
        except Exception:  # noqa: BLE001
            pass
        common = ["git", "curl", "wget", "python3", "go", "docker", "nmap", "subfinder",
                  "httpx", "nuclei", "ffuf", "jq", "dig"]
        present = [t for t in common if shutil.which(t)]
        lines.append("tools_installed: " + (", ".join(present) or "(none of the common set)"))
        return "\n".join(lines)


def build_registry(tools: Tools) -> tuple[dict, list[ToolSpec]]:
    """Return (name->callable, specs) for the agent and its prompt."""
    specs = [
        ToolSpec("web_search", "query, k?", "Search the web; returns titles + URLs."),
        ToolSpec("web_read", "url, max_chars?", "Fetch a URL and return its readable text."),
        ToolSpec("shell", "command", "Run a shell command on the VPS (approval-gated; destructive/active-scan blocked)."),
        ToolSpec("read_file", "path", "Read a local file."),
        ToolSpec("write_file", "path, content", "Write a local file (approval-gated)."),
        ToolSpec("remember", "text, tags?", "Store a durable fact in memory."),
        ToolSpec("recall", "query", "Search your memory and knowledge base."),
        ToolSpec("save_note", "title, content", "Save a structured knowledge-base note."),
        ToolSpec("sysinfo", "(none)", "Report facts about this VPS (OS, CPU, mem, disk, installed tools)."),
    ]
    registry = {
        "web_search": tools.web_search,
        "web_read": tools.web_read,
        "shell": tools.shell,
        "read_file": tools.read_file,
        "write_file": tools.write_file,
        "remember": tools.remember,
        "recall": tools.recall,
        "save_note": tools.save_note,
        "sysinfo": tools.sysinfo,
    }
    return registry, specs
