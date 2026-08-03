/**
 * Phase 5 entry point for the AI engine.
 *
 * Re-exports the Ollama transport from services/ollama so consumers can
 * import everything from services/ai per the architecture docs, while the
 * implementation itself stays single-sourced in services/ollama.
 */
export { OllamaService } from '../ollama/ollama.service.js';
export type {
  OllamaChatMessage,
  OllamaGenerateParams,
  OllamaModel,
  OllamaStatus,
} from '../ollama/ollama.service.js';
