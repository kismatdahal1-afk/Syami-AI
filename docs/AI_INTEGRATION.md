# Syami AI — AI Integration (Phase 5)

This document describes how Syami AI connects to a local **Ollama** server running the
**Qwen 2.5** instruct model. It covers the AI service architecture, the request flow,
the prompt builder, configuration, setup, and testing.

---

## 1. Updated folder structure

Phase 5 additions are marked with ✚.

```
apps/server/
├── prisma/
│   ├── schema.prisma              Conversation, Message, Settings models
│   └── seed.ts                    Demo data
└── src/
    ├── ai/                        ✚ Personality, branding, prompt & config (Phase 6)
    ├── config/
    │   ├── env.ts                 Zod-validated env vars (incl. OLLAMA_*)
    │   ├── constants.ts           App name, version, API prefix/version
    │   └── ai.ts                  Bridge → src/ai/ai-config.ts
    ├── controllers/
    │   ├── chat.controller.ts
    │   ├── settings.controller.ts
    │   ├── health.controller.ts
    │   └── ai.controller.ts       ✚ GET /ai/status, GET /ai/models
    ├── routes/
    │   ├── index.ts               mounts health, ai, chat, settings
    │   └── v1/
    │       ├── health.routes.ts
    │       ├── ai.routes.ts       ✚ /status, /models
    │       ├── chat.routes.ts
    │       └── settings.routes.ts
    ├── services/
    │   ├── chat.service.ts        ✚ AI pipeline (context -> reply -> persist)
    │   ├── settings.service.ts
    │   ├── health.service.ts      ✚ includes ai.status
    │   ├── index.ts
    │   ├── ai/
    │   │   ├── ai.service.ts      ✚ orchestration (build prompt, call Ollama, map errors)
    │   │   ├── prompt.builder.ts  ✚ bridge → src/ai/prompt-builder.ts
    │   │   ├── ollama.service.ts  ✚ re-export (single source in services/ollama)
    │   │   ├── reply.service.ts   Phase 4 mock — now offline fallback only
    │   │   └── index.ts
    │   └── ollama/
    │       ├── ollama.service.ts  ✚ real Ollama HTTP client (axios)
    │       ├── errors.ts          ✚ typed Ollama errors (connection/model/timeout/empty)
    │       └── index.ts           ✚ singleton for shared connection reuse
    ├── middleware/
    │   ├── validate.middleware.ts
    │   ├── errorHandler.middleware.ts  ✚ reveals messages flagged `expose`
    │   └── notFound.middleware.ts
    ├── utils/
    │   ├── errors.ts              ✚ HttpError.expose + aiUnavailable/aiTimeout
    │   ├── ApiResponse.ts
    │   └── asyncHandler.ts
    ├── types/chat.ts
    ├── app.ts
    └── server.ts

apps/desktop/src/renderer/src/lib/api/
├── client.ts                     ✚ chat timeout + getAiStatus/getAiModels
├── types.ts                      ✚ AiStatusInfo, AiModelsInfo
├── http.ts
├── errors.ts
└── index.ts
```

---

## 2. AI service architecture

Three layers keep AI isolated from controllers and routes.

| Layer | File | Responsibility |
| --- | --- | --- |
| Orchestration | `services/ai/ai.service.ts` | Build prompt, call Ollama, map typed errors to HTTP errors |
| Prompting | `src/ai/prompt-builder.ts` + `system-prompt.ts` | Identity/branding prompt + conversation history + current message |
| Transport | `services/ollama/ollama.service.ts` | HTTP client for the Ollama API (axios) |

The transport is instantiated once as a singleton in `services/ollama/index.ts` and
reused for every request, so HTTP connections are pooled (never recreated).

`services/ai/ollama.service.ts` re-exports the transport so consumers can import from
`services/ai` per the architecture docs while the implementation stays single-sourced
in `services/ollama` (no duplicate logic).

---

## 3. Ollama integration

The Ollama client calls the local Ollama HTTP API:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET /api/version` | status check (`running`, `version`) |
| `GET /api/tags` | list installed models |
| `POST /api/chat` | send messages, return the response |

`POST /api/chat` is called with:

```json
{
  "model": "qwen2.5:3b",
  "messages": [{ "role": "system", "content": "..." }, ...],
  "stream": false,
  "options": { "temperature": 0.7, "num_predict": 1024, "num_ctx": 4096 }
}
```

A `streamGenerate()` seam already reads Ollama's NDJSON stream (`stream: true`) and
yields content chunks as an async generator. Nothing consumes it yet — it exists so
Phase 8 (Streaming Chat) can turn it on with minimal changes.

### Request flow (chat)

```
React UI
  ↓ axios POST /v1/chat/message  { conversationId?, message }
Express route → validateBody(sendMessageSchema) → sendMessageController
  ↓
chat.service.sendMessage
    1. ensure conversation (create with title from message, or 404)
    2. load prior messages from the conversation  ← Task 5 context
    3. persist the user message
    4. aiService.chat({ history, message })
         prompt-builder.buildChat → [system, ...history, user]
         ollamaService.generate   → Ollama POST /api/chat
    5. persist the assistant reply, touch updatedAt
    6. return { conversationId, reply }
  ↓
React UI renders the reply (unchanged UI, markdown + code highlighting)
```

### Error handling (Task 8)

`services/ollama/errors.ts` defines typed failures the transport throws:

| Failure | When | User-facing message |
| --- | --- | --- |
| `OllamaConnectionError` | ECONNREFUSED / host unreachable | "Ollama is not running — start it with `ollama serve`…" |
| `OllamaModelError` | HTTP 404 from `/api/chat` | "AI model "qwen2.5:3b" is not installed — run `ollama pull qwen2.5:3b`" |
| `OllamaTimeoutError` | request timeout (configurable) | "AI request timed out — please try again" |
| `OllamaEmptyResponseError` | no content returned | "AI returned an empty response — please try again" |
| `OllamaRequestError` | any other failure | "AI request failed: …" |

`AiService` maps these to `503 (aiUnavailable)` or `504 (aiTimeout)` `HttpError`s. The
error handler surfaces them only because `HttpError.expose` is set — ordinary 5xx
messages remain masked.

---

## 4. Prompt builder

The prompt system lives in `src/ai/` (Phase 6): `system-prompt.ts` assembles
the Syami AI identity prompt (branding, personality, language rules, response
rules, future features), and `prompt-builder.ts` returns the Ollama message
array `[system, ...history, current]` with an automatic language hint.

- `SYSTEM_PROMPT` — defines the Syami AI persona; bilingual instruction
  (answer in the language the user writes: English or Nepali); wants Markdown
  output.
- `buildChat({ system?, history, current, memory? })` returns the Ollama message
  array `[system, ...history, current]`.
- `memory` is defined and documented but unused in Phase 6, so long-term memory
  can be added later without changing the prompt format.

See `docs/ai-personality.md` for the full personality, branding, language, and
response-rule architecture.

---

## 5. Configuration variables

Centralized in `src/ai/ai-config.ts` via `aiConfig` (`src/config/ai.ts` is a
bridge). All values come from `.env`
(see `apps/server/.env.example`), never hardcoded in the codebase.

| Variable | Default | Purpose |
| --- | --- | --- |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server address |
| `OLLAMA_MODEL` | `qwen2.5:3b` | Model tag pulled locally (swap e.g. `qwen2.5` for a bigger size) |
| `OLLAMA_TEMPERATURE` | `0.7` | Generation temperature (0–2) |
| `OLLAMA_NUM_PREDICT` | `1024` | Max tokens per reply (Ollama `num_predict`) |
| `OLLAMA_NUM_CTX` | `4096` | Context window size (Ollama `num_ctx`) |
| `OLLAMA_TOP_P` | `0.9` | Nucleus sampling (Ollama `top_p`) |
| `OLLAMA_REPEAT_PENALTY` | `1.1` | Repetition penalty (Ollama `repeat_penalty`) |
| `OLLAMA_TIMEOUT_MS` | `60000` | Per-request timeout for the Ollama client |
| `AI_STREAMING_ENABLED` | `false` | Streaming responses (reserved for the streaming phase) |

---

## 6. Manual setup steps

```powershell
# 1. Install Ollama (skip if already installed)
winget install Ollama.Ollama

# 2. Pull the Qwen 2.5 model used by the app
ollama pull qwen2.5:3b
#    to use a bigger model:  ollama pull qwen2.5   then set OLLAMA_MODEL=qwen2.5

# 3. (Ollama usually auto-starts) ensure the server is running
ollama serve

# 4. Verify Ollama responds
Invoke-RestMethod http://localhost:11434/api/version

# 5. Ensure environment variables in apps/server/.env
#    OLLAMA_BASE_URL, OLLAMA_MODEL (defaults are fine on most setups)

# 6. Start backend, then desktop (two terminals)
npm run dev:server
npm run dev:desktop
```

---

## 7. Testing instructions

Backend-only smoke tests (server running):

```powershell
# Ollama connectivity
Invoke-RestMethod http://localhost:5000/api/v1/ai/status
Invoke-RestMethod http://localhost:5000/api/v1/ai/models
Invoke-RestMethod http://localhost:5000/api/v1/health   # ai.status = connected

# Real AI reply (new conversation) — returns { conversationId, reply }
Invoke-RestMethod http://localhost:5000/api/v1/chat/message `
  -Method Post -ContentType 'application/json' `
  -Body '{"message":"What is physics in simple terms?"}'

# Continuity (Task 5): reuse the returned conversationId for a follow-up
Invoke-RestMethod http://localhost:5000/api/v1/chat/message `
  -Method Post -ContentType 'application/json' `
  -Body '{"conversationId":"<id>","message":"And gravity? Link it to my last question."}'

# Error path: stop Ollama, then
Invoke-RestMethod http://localhost:5000/api/v1/chat/message `
  -Method Post -ContentType 'application/json' `
  -Body '{"message":"ping"}'        # → 503 with a friendly message
```

In-app (desktop):
- English and Nepali messages render as real AI replies with markdown/code support.
- A follow-up message references the earlier context (proves conversation history is sent).
- Stop Ollama → sending shows the friendly "Ollama is not running" banner; start it → works again.
- Replies + conversations persist in MongoDB (reload the app or `GET /chat/history`).

---

## 8. Future (Phases 8+)

- Streaming responses wired to `ollamaService.streamGenerate()` — NDJSON → progressive
  frontend rendering, stop generation, regenerate.
- Long-term memory feeds `buildChat({ memory })`.
- Model switching via settings surfaces `POST /ai/model` (reserved in the API spec).