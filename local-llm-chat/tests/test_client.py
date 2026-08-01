"""Tests for the local chat client and config — fully offline.

The client test spins up a tiny in-process HTTP server that speaks the
OpenAI-compatible streaming (SSE) protocol, so it proves the streaming parser
works end-to-end without needing Ollama installed.

Run with:  python tests/test_client.py   (or)   python -m pytest
"""

from __future__ import annotations

import json
import os
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from local_chat.client import LocalChatClient, LocalServerError  # noqa: E402
from local_chat.config import Config  # noqa: E402


# --- a mock OpenAI-compatible server ------------------------------------

_SSE_CHUNKS = ["Hello", ", ", "world", "!"]


class _MockHandler(BaseHTTPRequestHandler):
    def log_message(self, *args):  # silence
        pass

    def do_GET(self):
        if self.path.endswith("/models"):
            body = json.dumps(
                {"data": [{"id": "llama3.2"}, {"id": "qwen2.5"}]}
            ).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        _ = self.rfile.read(length)  # consume request body
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.end_headers()
        for i, chunk in enumerate(_SSE_CHUNKS):
            evt = {
                "model": "llama3.2",
                "choices": [{"delta": {"content": chunk}, "index": 0}],
            }
            self.wfile.write(f"data: {json.dumps(evt)}\n\n".encode())
            self.wfile.flush()
        final = {
            "model": "llama3.2",
            "choices": [{"delta": {}, "finish_reason": "stop"}],
            "usage": {"prompt_tokens": 11, "completion_tokens": 4},
        }
        self.wfile.write(f"data: {json.dumps(final)}\n\n".encode())
        self.wfile.write(b"data: [DONE]\n\n")
        self.wfile.flush()


def _serve() -> tuple[HTTPServer, str]:
    server = HTTPServer(("127.0.0.1", 0), _MockHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    host, port = server.server_address
    return server, f"http://{host}:{port}/v1"


# --- tests --------------------------------------------------------------


def test_streaming_end_to_end():
    server, base = _serve()
    try:
        cfg = Config(base_url=base, model="llama3.2")
        client = LocalChatClient(cfg)

        received: list[str] = []
        result = client.stream_reply(
            [{"role": "user", "content": "hi"}], on_text=received.append
        )
        assert "".join(received) == "Hello, world!"
        assert result.text == "Hello, world!"
        assert result.prompt_tokens == 11
        assert result.completion_tokens == 4
        assert result.model == "llama3.2"
    finally:
        server.shutdown()


def test_check_server_lists_models():
    server, base = _serve()
    try:
        client = LocalChatClient(Config(base_url=base))
        models = client.check_server()
        assert "llama3.2" in models and "qwen2.5" in models
    finally:
        server.shutdown()


def test_unreachable_server_raises():
    # Nothing is listening on this port.
    client = LocalChatClient(Config(base_url="http://127.0.0.1:9/v1"))
    try:
        client.check_server()
    except LocalServerError:
        return
    raise AssertionError("expected LocalServerError")


def test_config_defaults_and_urls():
    for name in ("LOCAL_BASE_URL", "LOCAL_MODEL", "LOCAL_TEMPERATURE"):
        os.environ.pop(name, None)
    cfg = Config.from_env()
    assert cfg.model == "llama3.2"
    assert cfg.base_url == "http://127.0.0.1:11434/v1"
    assert cfg.chat_url.endswith("/chat/completions")
    assert cfg.models_url.endswith("/models")


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print(f"ok  {name}")
    print("All tests passed.")
