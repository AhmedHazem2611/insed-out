# Server

## AI Provider Configuration

Set these environment variables (e.g., in a `.env` file in `server/`):

- `CHAT_API_BASE_URL` - OpenAI-compatible base URL (e.g. `https://api.openai.com/v1` or your ChatAnywhere base)
- `CHAT_API_KEY` - API key for the provider
- `CHAT_MODEL` - Optional, default `gpt-4o-mini`
- `USE_PY_AI` - Optional, if `true` the server will call `server/AI/chat_once.py`
- `PYTHON_CMD` - Optional, Python command to run (e.g. `python`, `python3`)

Example `.env`:

```
PORT=4000
HOST=0.0.0.0
CHAT_API_BASE_URL=https://api.chatanywhere.org/v1
CHAT_API_KEY=sk-XXXX
CHAT_MODEL=gpt-4o-mini
# Optional: use Python integration
# USE_PY_AI=true
# PYTHON_CMD=python
```

## Run

```bash
npm run dev
# or build and start
npm run build && npm start
```

## Test (Node HTTP provider)

```bash
curl -X POST http://localhost:4000/api/ai/reply \
  -H "Content-Type: application/json" \
  -d '{"prompt":"hello"}'
```

## Test (Python provider)

```bash
# In server/.env set USE_PY_AI=true (and CHAT_* envs)
# Then:
curl -X POST http://localhost:4000/api/ai/reply \
  -H "Content-Type: application/json" \
  -d '{"prompt":"hello from python"}'
``` 