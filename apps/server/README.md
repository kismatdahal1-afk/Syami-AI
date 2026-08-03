# @syami/server — Syami AI Backend

Express + TypeScript + MongoDB Atlas (Prisma ORM) + Ollama (Qwen 2.5) backend for Syami AI.

## Folder structure

```
apps/server/
├── prisma/
│   ├── schema.prisma        Conversation, Message, Settings models
│   └── seed.ts              Demo data (settings + 3 conversations)
└── src/
    ├── ai/                Personality, branding, prompt & AI config system
    ├── config/
    │   ├── env.ts           Zod-validated environment variables
    │   ├── constants.ts     App name, version, API prefix/version
    │   └── ai.ts            Bridge to src/ai/ai-config.ts
    ├── controllers/         Thin request/response layer (no business logic)
    ├── routes/
    │   └── v1/              health, ai, chat, settings routers
    ├── services/            Business logic (chat, settings, health)
    │   ├── ai/              Orchestration, prompt bridge, reply fallback
    │   └── ollama/          Ollama HTTP client + typed errors (singleton)
    ├── middleware/          errorHandler, notFound, zod validation
    ├── database/            Prisma client + connection/error mapping
    ├── utils/               ApiResponse envelope, asyncHandler, HttpError
    ├── types/               API DTOs
    ├── app.ts               Express app assembly
    └── server.ts            Bootstrapping
```

See `docs/AI_INTEGRATION.md` for the AI transport architecture and
`docs/ai-personality.md` for the Syami AI personality, branding, and rules.

## API flow

```
React UI (apps/desktop)
   ↓  axios → http://localhost:5000/api
Express app
   ↓
routes → middleware (validation) → controllers → services → MongoDB Atlas / Ollama
   ↓
ApiResponse envelope: { success, message?, data } | { success:false, message, error? }
   ↑
React UI
```

Every response follows the envelope from `API_SPECIFICATION.md`. Controllers never
contain business logic — everything lives in services. Database connection errors are
mapped to `503 Database unavailable` and Ollama failures to friendly `503/504`
messages (flagged `expose`, so the app degrades gracefully and the health endpoint
reports `database.status` and `ai.status`).

## Database models

| Model | Fields |
| --- | --- |
| Conversation | id, title, createdAt, updatedAt, messages[] |
| Message | id, conversationId (FK), role (`user`/`assistant`), content, createdAt |
| Settings | id, theme, language, createdAt, updatedAt |

Relations: Conversation 1—N Message (cascade delete on conversation removal).

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | Health + database + AI connectivity status |
| GET | `/api/v1/ai/status` | Ollama running, version, configured model |
| GET | `/api/v1/ai/models` | Installed Ollama models |
| GET | `/api/v1/chat/history` | Conversation summaries, newest first |
| GET | `/api/v1/chat/:conversationId` | One conversation with messages |
| POST | `/api/v1/chat/message` | Send a message; creates a conversation when no `conversationId` is given; includes prior messages as context and returns `{ conversationId, reply }` (real Qwen reply) |
| DELETE | `/api/v1/chat/:conversationId` | Delete a conversation (cascades messages) |
| PATCH | `/api/v1/chat/:conversationId` | Rename a conversation `{ title }` |
| GET | `/api/v1/settings` | Application settings (stored or defaults) |
| PATCH | `/api/v1/settings` | Partial settings update `{ theme?, language? }` |

## Environment variables

See `.env.example`. Required:

- `DATABASE_URL` — MongoDB Atlas connection string (`apps/server/.env`, git-ignored)
- `PORT` (default 5000), `CORS_ORIGINS` (comma-separated allowed origins),
  `DB_CONNECT_ON_START` (optional eager connect; health check runs regardless)
- Ollama: `OLLAMA_BASE_URL` (default `http://localhost:11434`), `OLLAMA_MODEL`
  (default `qwen2.5:3b`), `OLLAMA_TEMPERATURE`, `OLLAMA_NUM_PREDICT`,
  `OLLAMA_NUM_CTX`, `OLLAMA_TOP_P`, `OLLAMA_REPEAT_PENALTY`,
  `OLLAMA_TIMEOUT_MS`, `AI_STREAMING_ENABLED` — loaded centrally via
  `src/ai/ai-config.ts`

## Commands

```bash
npm run prisma:generate   # generate Prisma Client
npm run db:push           # sync schema to MongoDB
npm run db:seed           # insert demo data
npm run dev               # tsx watch server
npm run build             # tsc compile
```

## Frontend communication

The desktop app talks to this backend through `apps/desktop/src/renderer/src/lib/api`
(axios instance with `VITE_API_BASE_URL`, response envelope unwrapping, and unified
error extraction). The chat store (`stores/chat.store.ts`) loads history, lazy-loads
conversation messages, and sends messages optimistically, adopting the server-side
conversation id for locally created chats.
