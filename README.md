# Syami AI

A modern desktop AI assistant (Chat Mode v1, Agent Mode in the future) built as a
clean monorepo.

- **Desktop:** Electron + React + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB Atlas via Prisma
- **AI:** Ollama (Qwen 2.5)

## Project Structure

```
apps/
  desktop/   Electron shell + React renderer + preload script
  server/    Express backend (routes, controllers, services, middleware)
packages/
  shared/    Shared types and constants consumed by both apps
docs/        Phase documentation
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment files (secrets are never committed):

   ```bash
   copy apps\server\.env.example apps\server\.env
   copy apps\desktop\.env.example apps\desktop\.env
   ```

3. Generate the Prisma client (no models yet, configured for MongoDB Atlas):

   ```bash
   npm run prisma:generate
   ```

4. Run the full stack (backend on port 5000 + Electron desktop):

   ```bash
   npm run dev
   ```

## Useful Scripts

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Run backend + desktop together      |
| `npm run dev:server`  | Backend only (Express)              |
| `npm run dev:desktop` | Desktop only (Electron)             |
| `npm run build`       | Build all apps                      |
| `npm run typecheck`   | TypeScript checks across workspaces |
| `npm run lint`        | ESLint                              |
| `npm run format`      | Prettier formatting                 |

## External Dependencies (manual setup)

> Note: Prisma is pinned to the 6.x line because Prisma 7 does not support MongoDB yet.

- **MongoDB Atlas** - required from Phase 6. Create a free cluster and set the
  connection string as `DATABASE_URL` in `apps/server/.env`.
- **Ollama** - required from Phase 7. Install from <https://ollama.com> and run
  `ollama pull qwen2.5:3b`.

## Documentation

See `PROJECT_RULES.md`, `PROJECT_ROADMAP.md`, `SYSTEM_ARCHITECTURE.md`, and
`API_SPECIFICATION.md` at the repository root.

Current phase: **Phase 1 - Project Initialization**.
