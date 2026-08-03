import { env } from './env.js';

/**
 * Centralized AI model configuration (Phase 5).
 *
 * Single source of truth for generation parameters. Values come from
 * environment variables (.env) with sensible defaults - never hardcode
 * model names or generation options in services or controllers.
 */
export interface AiConfig {
  model: string;
  temperature: number;
  numPredict: number;
  numCtx: number;
  timeoutMs: number;
}

export const aiConfig: AiConfig = {
  model: env.OLLAMA_MODEL,
  temperature: env.OLLAMA_TEMPERATURE,
  numPredict: env.OLLAMA_NUM_PREDICT,
  numCtx: env.OLLAMA_NUM_CTX,
  timeoutMs: env.OLLAMA_TIMEOUT_MS,
};

export default aiConfig;
