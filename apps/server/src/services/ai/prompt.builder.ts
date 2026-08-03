import type { OllamaChatMessage } from '../ollama/ollama.service.js';

export interface PromptHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface BuildChatParams {
  /** System prompt override (defaults to SYAMI_SYSTEM_PROMPT). */
  system?: string;
  /** Prior messages from the current conversation (never includes `current`). */
  history: PromptHistoryMessage[];
  /** The user message currently being answered. */
  current: { role: 'user'; content: string };
  /**
   * Future memory support: facts/notes injected into the system context.
   * Unused in Phase 5 - wired so long-term memory can be added without
   * touching the prompt format.
   */
  memory?: string[];
}

/**
 * System prompt for Syami AI.
 *
 * Bilingual by design: answers follow the user's language (English or
 * Nepali) and use Markdown for structure.
 */
export const SYAMI_SYSTEM_PROMPT = [
  'You are Syami AI, a modern desktop AI assistant.',
  'Be helpful, accurate, and concise.',
  'Always respond in the same language the user writes in — English for English messages, Nepali (नेपाली) for Nepali messages.',
  'Use Markdown (headings, lists, tables, code blocks) where it improves readability.',
  'If a question is unclear or ambiguous, ask one short clarifying question.',
  'Never claim capabilities you do not have.',
].join(' ');

/**
 * Builds the Ollama chat payload for /api/chat:
 * [system, ...history, current].
 *
 * Prompt logic stays in the backend and is fully separate from API routes.
 */
export const buildChat = (params: BuildChatParams): OllamaChatMessage[] => {
  const messages: OllamaChatMessage[] = [];

  const systemParts = [params.system ?? SYAMI_SYSTEM_PROMPT];
  if (params.memory && params.memory.length > 0) {
    systemParts.push(`Additional memory about the user:\n${params.memory.map((entry, index) => `${index + 1}. ${entry}`).join('\n')}`);
  }
  messages.push({ role: 'system', content: systemParts.join('\n\n') });

  for (const message of params.history) {
    messages.push(message);
  }

  messages.push(params.current);

  return messages;
};
