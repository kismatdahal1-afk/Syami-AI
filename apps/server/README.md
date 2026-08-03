# @syami/server — Syami AI Backend

Express + TypeScript + MongoDB Atlas (Prisma ORM) backend for Syami AI.

## Folder structure

```
apps/server/
├── prisma/
│   ├── schema.prisma        Conversation, Message, Settings models
│   └── seed.ts              Demo data (settings + 3 conversations)
└── src/
    ├── config/
    │   ├── env.ts           Zod-validated environment variables
    │   └── constants.ts     App name, version, API prefix/version
    ├── controllers/         Thin request/response layer (no business logic)
    ├── routes/
    │   └── v1/              health, chat, settings routers
    ├── services/            Business logic (chat, settings, health)
    │   └── ai/reply.service.ts   Mock reply generator (future AI seam)
    ├── middleware/          errorHandler, notFound, zod validation
    ├── database/            Prisma client + connection/error mapping
    ├── utils/               ApiResponse envelope, asyncHandler, HttpError
    ├── types/               API DTOs
    ├── app.ts               Express app assembly
    └── server.ts            Bootstrapping
```

## API flow

```
React UI (apps/desktop)
   ↓  axios → http://localhost:5000/api
Express app
   ↓
routes → middleware (validation) → controllers → services (Prisma) → MongoDB Atlas
   ↓
ApiResponse envelope: { success, message?, data } | { success:false, message, error? }
   ↑
React UI
```

Every response follows the envelope from `API_SPECIFICATION.md`. Controllers never
contain business logic — everything lives in services. Database connection errors are
mapped to `503 Database unavailable` (the app degrades gracefully and the health
endpoint reports `database.status`).

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
| GET | `/api/v1/health` | Health + database connectivity status |
| GET | `/api/v1/chat/history` | Conversation summaries, newest first |
| GET | `/api/v1/chat/:conversationId` | One conversation with messages |
| POST | `/api/v1/chat/message` | Send a message; creates a conversation when no `conversationId` is given; returns `{ conversationId, reply }` (mock reply until the AI phase) |
| DELETE | `/api/v1/chat/:conversationId` | Delete a conversation (cascades messages) |
| PATCH | `/api/v1/chat/:conversationId` | Rename a conversation `{ title }` |
| GET | `/api/v1/settings` | Application settings (stored or defaults) |
| PATCH | `/api/v1/settings` | Partial settings update `{ theme?, language? }` |

## Environment variables

See `.env.example`. Required:

- `DATABASE_URL` — MongoDB Atlas connection string (`apps/server/.env`, git-ignored)
- `PORT` (default 5000), `CORS_ORIGINS` (comma-separated allowed origins),
  `DB_CONNECT_ON_START` (optional eager connect; health check runs regardless),
  `OLLAMA_BASE_URL`/`OLLAMA_MODEL` (reserved for the AI phase)

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
