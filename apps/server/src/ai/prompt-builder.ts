/**
 * Syami AI prompt builder (Phase 6).
 *
 * Assembles the final Ollama chat payload:
 * [system prompt (identity + personality + language + response rules), ...history, current]
 *
 * Prompt logic stays fully inside the backend and remains modular: adding
 * memory (already parametrized) or streaming never changes the routes.
 */
import type { OllamaChatMessage } from '../services/ollama/ollama.service.js';
import { detectLanguage } from './language-rules.js';
import { buildSystemPrompt } from './system-prompt.js';

export interface PromptHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface BuildChatParams {
  /** System prompt override (defaults to the built Syami AI prompt). */
  system?: string;
  /** Prior messages from the current conversation (never includes `current`). */
  history: PromptHistoryMessage[];
  /** The user message currently being answered. */
  current: { role: 'user'; content: string };
  /**
   * Future memory support: facts injected into the system context.
   * Unused in Phase 6 — wired so long-term memory can be added without
   * changing the prompt format.
   */
  memory?: string[];
}

export const buildChat = (params: BuildChatParams): OllamaChatMessage[] => {
  const messages: OllamaChatMessage[] = [];

  const language = detectLanguage(params.current.content);
  const systemParts = [params.system ?? buildSystemPrompt({ language })];

  if (params.memory && params.memory.length > 0) {
    systemParts.push(
      `Additional memory about the user:\n${params.memory
        .map((entry, index) => `${index + 1}. ${entry}`)
        .join('\n')}`,
    );
  }

  messages.push({ role: 'system', content: systemParts.join('\n\n') });

  for (const message of params.history) {
    messages.push(message);
  }

  messages.push(params.current);

  return messages;
};