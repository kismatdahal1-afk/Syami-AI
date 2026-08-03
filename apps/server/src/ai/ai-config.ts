/**
 * Syami AI model configuration (Phase 6).
 *
 * Centralized AI settings driven by environment variables — no hardcoded
 * generation values anywhere else in the project.
 */
import { env } from '../config/env.js';

export interface AiConfig {
  model: string;
  temperature: number;
  /** Max tokens per reply (Ollama num_predict). */
  maxTokens: number;
  /** Context window size (Ollama num_ctx). */
  contextWindow: number;
  /** Nucleus sampling (Ollama top_p). */
  topP: number;
  /** Repetition penalty (Ollama repeat_penalty). */
  repeatPenalty: number;
  timeoutMs: number;
  streaming: {
    /** Streaming responses are enabled (frontend support arrives later). */
    enabled: boolean;
  };
}

export const aiConfig: AiConfig = {
  model: env.OLLAMA_MODEL,
  temperature: env.OLLAMA_TEMPERATURE,
  maxTokens: env.OLLAMA_NUM_PREDICT,
  contextWindow: env.OLLAMA_NUM_CTX,
  topP: env.OLLAMA_TOP_P,
  repeatPenalty: env.OLLAMA_REPEAT_PENALTY,
  timeoutMs: env.OLLAMA_TIMEOUT_MS,
  streaming: {
    enabled: env.AI_STREAMING_ENABLED,
  },
};

export default aiConfig;