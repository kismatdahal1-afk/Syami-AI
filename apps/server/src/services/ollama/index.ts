import { env } from '../../config/env.js';
import { OllamaService } from './ollama.service.js';

export const ollamaService = new OllamaService(
  env.OLLAMA_BASE_URL,
  env.OLLAMA_MODEL,
  env.OLLAMA_TIMEOUT_MS,
);
export type { OllamaChatMessage, OllamaGenerateParams, OllamaModel, OllamaStatus } from './ollama.service.js';
