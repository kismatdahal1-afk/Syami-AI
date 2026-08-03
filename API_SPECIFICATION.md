# ============================================================

# API_SPECIFICATION.md

# Syami AI - Backend API Specification

# Version: 1.0.0

# ============================================================

> This document defines the official REST API specification for Syami AI.
> All frontend and backend communication must follow this specification.

---

# 1. API Overview

Architecture

Electron (React)

↓

Express Backend

↓

Services

↓

MongoDB / Ollama

The frontend never communicates directly with MongoDB or Ollama.

---

# 2. Base URL

Development

http://localhost:5000/api

Production

TBD

---

# 3. Response Format

Every endpoint should return the same structure.

Success

{
"success": true,
"message": "...",
"data": {}
}

Error

{
"success": false,
"message": "...",
"error": {}
}

---

# 4. API Versioning

Current Version

v1

Future

/api/v2

Never break older APIs.

---

# 5. Chat APIs

POST

/chat/message

Purpose

Send a user message to the AI.

Request

{
"conversationId": "...",
"message": "Hello"
}

Response

{
"reply": "...",
"conversationId": "..."
}

---

GET

/chat/history

Purpose

Return all conversations.

---

GET

/chat/:conversationId

Purpose

Return messages for one conversation.

---

DELETE

/chat/:conversationId

Purpose

Delete conversation.

---

PATCH

/chat/:conversationId

Purpose

Rename conversation.

---

# 6. AI APIs

GET

/ai/status

Purpose

Check whether Ollama is running.

Response

Running

Model Loaded

Version

---

GET

/ai/models

Purpose

List installed Ollama models.

---

POST

/ai/model

Purpose

Change active AI model.

---

# 7. Settings APIs

GET

/settings

Return application settings.

---

PATCH

/settings

Update settings.

Example

Theme

Language

Temperature

Preferred Model

---

# 8. Health APIs

GET

/health

Purpose

Application health check.

Response

Backend Status

Database Status

AI Status

Version

---

# 9. Future Voice APIs

POST

/voice/transcribe

Speech → Text

---

POST

/voice/speak

Text → Speech

Version 1

Reserved only.

---

# 10. Future Agent APIs

POST

/agent/run

Execute desktop command.

Example

Open VS Code

Open Chrome

Open Folder

---

POST

/agent/browser

Execute browser command.

---

POST

/agent/files

Execute file operation.

Version 1

Reserved only.

---

# 11. Future Vision APIs

POST

/vision/analyze

Analyze screenshot.

Version 1

Reserved only.

---

# 12. Validation Rules

Every endpoint must:

✓ Validate input

✓ Return proper HTTP status

✓ Return consistent JSON

✓ Handle errors gracefully

✓ Never expose stack traces

---

# 13. HTTP Status Codes

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error

---

# 14. Security Rules

Never expose:

Database URL

API Keys

Secrets

System Paths

Validate all incoming requests.

Sanitize user input.

---

# 15. Development Rules

Every new API must include:

Purpose

Request Schema

Response Schema

Validation

Error Handling

Documentation

---

# 16. Future Expansion

The API architecture must support:

• Streaming Responses

• WebSocket Communication

• Agent Mode

• Voice Assistant

• Vision AI

• Plugin System

without changing existing endpoints.

---

# End of Document

API_SPECIFICATION.md

Version 1.0.0
