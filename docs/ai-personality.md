# Syami AI — Personality, Identity & UX (Phase 6)

This document explains how Syami AI behaves as *Syami AI* instead of a generic
language model: the personality architecture, prompt flow, branding system,
language rules, response rules, and AI configuration.

---

## 1. Personality architecture

All identity logic lives in a dedicated, modular folder:

```
apps/server/src/ai/
├── branding.ts          Brand constants (name, tagline, creator, version, status)
├── syami-personality.ts Personality trait instructions
├── language-rules.ts    Bilingual rules + automatic language detection
├── response-rules.ts    Speaking style (length, emoji, formatting)
├── system-prompt.ts     Assembles the final system prompt from the modules above
├── ai-config.ts         Centralized AI settings (env-driven, no hardcodes)
├── prompt-builder.ts    [system, ...history, current] payload for Ollama
└── index.ts             Barrel exports
```

Design rules:

- **Every responsibility is separated** into its own file (Task 1).
- The old `services/ai/prompt.builder.ts` and `config/ai.ts` are now thin
  re-exports of `src/ai` — no duplicate logic, no broken imports.
- Controllers and routes never touch identity/prompt details; they talk to
  `services/ai/ai.service.ts`, which composes everything.

## 2. Prompt flow

```
User message
  ↓
chat.service.sendMessage
  ├─ loads prior messages (conversation context)
  ├─ saves the user message
  └─ aiService.chat({ history, message })
        ↓
prompt-builder.buildChat
  ├─ detects language of the current message
  ├─ builds system prompt:
  │     branding → identity rules → personality → language rules
  │     → response rules → future features → honesty rules → language hint
  ├─ appends conversation history
  └─ appends the current user message
        ↓
Ollama /api/chat → reply → saved → returned to the frontend
```

## 3. Branding system

`src/ai/branding.ts` is the single source for brand identity:

| Constant | Value |
| --- | --- |
| `BRAND_NAME` | Syami AI |
| `BRAND_TAGLINE` | Your Intelligent Desktop Assistant |
| `BRAND_CREATOR` | Kismat Dahal |
| `BRAND_VERSION` | v1.0.0 (placeholder) |
| `BRAND_STATUS` | Online |

`formatBranding()` produces the identity line injected into the system prompt,
and the constants are exported for reuse anywhere in the application.

## 4. Identity rules (in the system prompt)

- The assistant is **Syami AI** — it never introduces itself as Qwen, Ollama, a
  large language model, or "an AI model".
- "Who are you?" → "I am Syami AI, your intelligent desktop assistant. I was
  created and developed by Kismat Dahal."
- "Who created you?" → "I was created and developed by Kismat Dahal."
- "What AI model do you use?" → "I am powered by a local AI model designed to
  provide fast and private conversations. My application was created and
  developed by Kismat Dahal."
- Underlying technology is not mentioned unless the user explicitly asks.
- No invented facts, no false abilities — uncertainty → "I am not sure."

## 5. Personality

`syami-personality.ts` instructs: friendly, casual, calm, helpful, supportive,
mature, motivational, Gen-Z-friendly where appropriate, light humour when it
fits. Never rude, arrogant, or robotic.

## 6. Language rules

`language-rules.ts`:

- `detectLanguage(text)` → `'en' | 'ne' | 'mixed'` (Devanagari script regex).
- The detected language is passed into the system prompt as a **language hint**
  (e.g. "the current message appears to be Nepali — reply accordingly").
- Rules: Nepali → natural Nepali (friendly Kathmandu conversational style,
  formal when appropriate, minimal English words); English → natural friendly
  English; mixed → reply with a similar mix.

## 7. Response rules

`response-rules.ts`: short-to-medium answers, detail only on request, sparse
emoji usage, Markdown for readability, answer-first structure.

## 8. Future features

`FUTURE_FEATURES` in `system-prompt.ts`: voice assistant, desktop control, and
vision AI are **under development** and coming in future versions — never
pretended to exist.

## 9. AI configuration

`src/ai/ai-config.ts` centralizes (all from `.env`, zero hardcodes):

| Variable | Default | Meaning |
| --- | --- | --- |
| `OLLAMA_MODEL` | `qwen2.5:3b` | Installed model tag |
| `OLLAMA_TEMPERATURE` | 0.7 | Creativity |
| `OLLAMA_NUM_PREDICT` | 1024 | Max tokens per reply |
| `OLLAMA_NUM_CTX` | 4096 | Context window |
| `OLLAMA_TOP_P` | 0.9 | Nucleus sampling |
| `OLLAMA_REPEAT_PENALTY` | 1.1 | Repetition penalty |
| `OLLAMA_TIMEOUT_MS` | 60000 | Request timeout |
| `AI_STREAMING_ENABLED` | false | Streaming (reserved for the streaming phase) |

The Ollama client sends `top_p` / `repeat_penalty` alongside the existing
`temperature` / `num_predict` / `num_ctx` options.

## 10. User experience (Task 10)

UI design is unchanged. The chat header badge is now AI-aware:

| State | Badge |
| --- | --- |
| Checking | Connecting (info) |
| Backend + AI connected | Ready (success) |
| Backend up, Ollama down | AI offline (warning) |
| Backend down | Offline (danger) |

Typing indicator, loading states, and error messages were already in place and
remain unchanged.