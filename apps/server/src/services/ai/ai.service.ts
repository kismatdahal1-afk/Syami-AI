import { aiConfig } from '../../config/ai.js';
import { aiTimeout, aiUnavailable } from '../../utils/errors.js';
import { ollamaService } from '../ollama/index.js';
import { OllamaError, OllamaTimeoutError } from '../ollama/errors.js';
import type { PromptHistoryMessage } from './prompt.builder.js';
import { buildChat } from './prompt.builder.js';
import type { OllamaModel } from './ollama.service.js';
export interface AiChatParams {
  /** Prior messages from the current conversation (conversational context). */
  history: PromptHistoryMessage[];
  /** The user message being answered. */
  message: string;
}

export interface AiStatusInfo {
  running: boolean;
  version?: string;
  model: string;
}

/**
 * Central AI orchestration service (Phase 5).
 *
 * Responsibilities:
 * - build prompts from conversation context (prompt.builder)
 * - send requests to Ollama (ollama.service)
 * - translate Ollama failures into user-friendly HttpErrors
 *
 * Keeps Ollama isolated from controllers - controllers only ever touch
 * this service (or the chat service), never Ollama directly.
 */
export class AiService {
  async chat(params: AiChatParams): Promise<string> {
    const messages = buildChat({
      history: params.history,
      current: { role: 'user', content: params.message },
    });

    try {
      return await ollamaService.generate({
        model: aiConfig.model,
        messages,
        temperature: aiConfig.temperature,
        numPredict: aiConfig.maxTokens,
        numCtx: aiConfig.contextWindow,
        topP: aiConfig.topP,
        repeatPenalty: aiConfig.repeatPenalty,
      });
    } catch (error) {
      if (error instanceof OllamaTimeoutError) throw aiTimeout(error.message);
      if (error instanceof OllamaError) throw aiUnavailable(error.message);
      throw error;
    }
  }

  async getStatus(): Promise<AiStatusInfo> {
    const status = await ollamaService.getStatus();
    return { running: status.running, version: status.version, model: aiConfig.model };
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      return await ollamaService.getModels();
    } catch (error) {
      if (error instanceof OllamaError) throw aiUnavailable(error.message);
      throw error;
    }
  }
}

export const aiService = new AiService();