import { isApiSuccess } from '@syami/shared';
import { ApiClientError } from './errors';
import { httpClient } from './http';
import type {
  ApiResponseEnvelope,
  ChatRequest,
  ChatResponse,
  ConversationItem,
  ConversationSummary,
  HealthResponse,
  MessageItem,
  SettingsResponse,
} from './types';

const unwrap = <T>(response: ApiResponseEnvelope<T>): T => {
  if (!isApiSuccess(response)) {
    throw new ApiClientError(response.message, 500, response);
  }
  return response.data;
};

/**
 * Typed API client for the Syami AI backend.
 *
 * Phase 4: health, chat, and settings endpoints are wired. AI endpoints
 * (status/models) arrive with the AI integration phase.
 */
class ApiClient {
  async getHealth(): Promise<HealthResponse> {
    const { data } = await httpClient.get<ApiResponseEnvelope<HealthResponse>>('/v1/health');
    return unwrap(data);
  }

  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data } = await httpClient.post<ApiResponseEnvelope<ChatResponse>>('/v1/chat/message', request);
    return unwrap(data);
  }

  async getChatHistory(): Promise<ConversationSummary[]> {
    const { data } = await httpClient.get<ApiResponseEnvelope<ConversationSummary[]>>('/v1/chat/history');
    return unwrap(data);
  }

  async getConversation(conversationId: string): Promise<ConversationItem> {
    const { data } = await httpClient.get<ApiResponseEnvelope<ConversationItem>>(
      `/v1/chat/${conversationId}`,
    );
    return unwrap(data);
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const { data } = await httpClient.delete<ApiResponseEnvelope<null>>(`/v1/chat/${conversationId}`);
    unwrap(data);
  }

  async renameConversation(conversationId: string, title: string): Promise<ConversationSummary> {
    const { data } = await httpClient.patch<ApiResponseEnvelope<ConversationSummary>>(
      `/v1/chat/${conversationId}`,
      { title },
    );
    return unwrap(data);
  }

  async getConversationMessages(_conversationId: string): Promise<MessageItem[]> {
    return (await this.getConversation(_conversationId)).messages;
  }

  async getSettings(): Promise<SettingsResponse> {
    const { data } = await httpClient.get<ApiResponseEnvelope<SettingsResponse>>('/v1/settings');
    return unwrap(data);
  }
}

export const apiClient = new ApiClient();