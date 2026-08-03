import { ollamaService } from '../ollama/index.js';

export interface AiChatParams {
  conversationId?: string;
  message: string;
}

export interface AiChatResult {
  reply: string;
  conversationId: string;
}

/**
 * Central AI orchestration service.
 *
 * Phase 1: placeholder only. Prompt building and AI request orchestration
 * are planned for Phase 7 (AI Integration). All AI requests must stay
 * behind the backend - the frontend never talks to Ollama directly.
 */
export class AiService {
  async chat(_params: AiChatParams): Promise<AiChatResult> {
    throw new Error('AI service is not implemented yet (planned for Phase 7)');
  }

  async getStatus() {
    return ollamaService.getStatus();
  }

  async getModels() {
    return ollamaService.getModels();
  }
}

export const aiService = new AiService();
