"""Cyber-Mentor: a local cybersecurity expert with a train-until-ready loop.

Runs entirely on your machine (Ollama, no API key). It drills a local model on
cybersecurity questions, grades each answer, feeds back what was missed, and
only "graduates" the model once it clears a capability bar — then reports how
much it knows and lets you chat with it.
"""

__version__ = "1.0.0"
