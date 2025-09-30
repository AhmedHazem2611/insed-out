#!/usr/bin/env python3
import os
import sys
import json
import requests

BASE_URL = os.environ.get("CHAT_API_BASE_URL", "https://api.openai.com/v1")
API_KEY = os.environ.get("CHAT_API_KEY")
MODEL = os.environ.get("CHAT_MODEL", "gpt-4o-mini")
SYSTEM_PROMPT = os.environ.get("CHAT_SYSTEM_PROMPT", "You are a warm, supportive therapist. Speak briefly and clearly.")
SYSTEM_PROMPT_FILE = os.environ.get("CHAT_SYSTEM_PROMPT_FILE")

# If a system prompt file is provided, it overrides
if SYSTEM_PROMPT_FILE and os.path.isfile(SYSTEM_PROMPT_FILE):
	try:
		with open(SYSTEM_PROMPT_FILE, 'r', encoding='utf-8') as f:
			SYSTEM_PROMPT = f.read()
	except Exception as e:
		print(f"Failed to read CHAT_SYSTEM_PROMPT_FILE: {e}", file=sys.stderr)

if not API_KEY:
	print("CHAT_API_KEY is not set", file=sys.stderr)
	sys.exit(2)

# Read prompt: prefer argv[1], else JSON on stdin {"prompt": "..."}
prompt = None
if len(sys.argv) > 1:
	prompt = " ".join(sys.argv[1:]).strip()
else:
	try:
		data = sys.stdin.read()
		if data:
			obj = json.loads(data)
			prompt = (obj.get("prompt") or "").strip()
	except Exception:
		pass

if not prompt:
	print("No prompt provided", file=sys.stderr)
	sys.exit(3)

try:
	resp = requests.post(
		f"{BASE_URL}/chat/completions",
		headers={
			"Authorization": f"Bearer {API_KEY}",
			"Content-Type": "application/json",
		},
		json={
			"model": MODEL,
			"messages": [
				{"role": "system", "content": SYSTEM_PROMPT},
				{"role": "user", "content": prompt},
			],
		},
		timeout=60,
	)
	if resp.status_code != 200:
		print(f"Upstream error: {resp.status_code} {resp.text}", file=sys.stderr)
		sys.exit(4)
	data = resp.json()
	reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
	print(reply)
	sys.exit(0)
except requests.Timeout:
	print("Request to provider timed out", file=sys.stderr)
	sys.exit(5)
except Exception as e:
	print(f"Unexpected error: {e}", file=sys.stderr)
	sys.exit(6) 