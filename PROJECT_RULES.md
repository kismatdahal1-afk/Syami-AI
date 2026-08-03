# ============================================================

# PROJECT_RULES.md

# Syami AI - Official Project Rules

# Version: 1.0.0

# ============================================================

> This document defines the official development rules for Syami AI. Every AI coding assistant and contributor must follow these rules before writing or modifying code.

---

# 1. Project Overview

Project Name:
Syami AI

Platform:
Desktop Application

Architecture:
Electron + React + Node.js + Express + MongoDB Atlas + Ollama

Modes:

- Chat Mode (Version 1)
- Agent Mode (Future)

Languages:

- English
- Nepali

---

# 2. Project Vision

Build a modern desktop AI assistant that starts as a premium AI chat application and evolves into a powerful desktop AI agent.

Core goals:

- Clean Architecture
- Modular Design
- Reusable Components
- Scalability
- Performance
- Excellent User Experience

---

# 3. Official Tech Stack

Desktop

- Electron

Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- React Router

Backend

- Node.js
- Express
- TypeScript

AI

- Ollama
- Qwen 2.5

Database

- MongoDB Atlas

ORM

- Prisma

---

# 4. Architecture Rules

The frontend must never communicate directly with Ollama or MongoDB.

Communication Flow

React

↓

Express Backend

↓

AI / Database

Chat Mode and Agent Mode must share:

- Backend
- AI Engine
- Database
- Memory
- Settings

Only the user interface changes.

---

# 5. Coding Standards

Always use:

- TypeScript
- Functional Components
- Strong Typing
- Reusable Components

Avoid:

- JavaScript
- Duplicate Logic
- Hardcoded Values
- Large Components
- Unnecessary Dependencies

Write clean, readable, and maintainable code.

---

# 6. Folder Rules

Organize code by responsibility.

Examples:

apps/

packages/

components/

services/

hooks/

database/

ai/

voice/

desktop/

docs/

Never mix frontend and backend logic.

---

# 7. UI Principles

The interface should feel:

- Modern
- Minimal
- Futuristic
- Premium
- Fast

Support:

- Dark Mode
- Light Mode

Keep animations smooth and purposeful.

---

# 8. Backend Rules

The backend is responsible for:

- Business Logic
- AI Requests
- Database Access
- API Validation
- Error Handling

The backend must never contain UI logic.

---

# 9. Database Rules

Use:

- MongoDB Atlas
- Prisma ORM

Never hardcode:

- API Keys
- Secrets
- Database URLs

Always use `.env`.

---

# 10. AI Rules

The AI engine must remain independent from the UI.

Every AI request should follow:

User

↓

Frontend

↓

Backend

↓

Ollama

↓

Backend

↓

Frontend

Keep prompt-building logic inside the backend.

---

# 11. Development Workflow

Always follow this order:

1. Plan
2. Design
3. Build
4. Test
5. Document
6. Review
7. Release

Never skip documentation.

---

# 12. Development Principles

Before writing code:

- Understand the requirement.
- Reuse existing components.
- Keep files small.
- Keep functions focused.
- Avoid unnecessary complexity.

Every feature should improve the project without breaking existing functionality.

---

# 13. Future Compatibility

The architecture must support future modules:

- Voice Assistant
- Agent Mode
- Desktop Automation
- Browser Automation
- Vision AI
- Long-Term Memory
- Plugin System

without requiring a major redesign.

---

# 14. Final Rule

Always prioritize:

1. Clean Architecture
2. Readability
3. Maintainability
4. Reusability
5. Performance
6. User Experience

If a new feature violates these principles, redesign it before implementation.

---

# End of Document

Version 1.0.0
Official Development Rules for Syami AI
