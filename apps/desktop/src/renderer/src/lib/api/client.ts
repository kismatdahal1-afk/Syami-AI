import { isApiSuccess } from '@syami/shared';
import { ApiClientError } from './errors';
import { httpClient } from './http';
import type {
  AiStatus,
  ApiResponseEnvelope,
  ChatRequest,
  ChatResponse,
  ConversationSummary,
  HealthResponse,
  MessageItem,
  SettingsResponse,
} from './types';

/**
 * Typed API client for the Syami AI backend.
 *
 * Phase 1: only the health endpoint exists. Remaining methods are typed
 * placeholders for Chat, AI, and Settings APIs (Phase 5+).
 */
class ApiClient {
  async getHealth(): Promise<HealthResponse> {
    const { data } = await httpClient.get<ApiResponseEnvelope<HealthResponse>>('/v1/health');
    if (!isApiSuccess(data)) {
      throw new ApiClientError(data.message, 500, data);
    }
    return data.data;
  }

  async sendChatMessage(_request: ChatRequest): Promise<ChatResponse> {
    throw new Error('Chat API is not implemented yet');
  }

  async getChatHistory(): Promise<ConversationSummary[]> {
    throw new Error('Chat API is not implemented yet');
  }

  async getConversation(_conversationId: string): Promise<MessageItem[]> {
    throw new Error('Chat API is not implemented yet');
  }

  async getAiStatus(): Promise<AiStatus> {
    throw new Error('AI API is not implemented yet');
  }

  async getSettings(): Promise<SettingsResponse> {
    throw new Error('Settings API is not implemented yet');
  }
}

export const apiClient = new ApiClient();
