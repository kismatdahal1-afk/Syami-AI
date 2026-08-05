import { isApiSuccess } from '@syami/shared';
import { ApiClientError } from './errors';
import { httpClient } from './http';
import type {
  AiModelsInfo,
  AiStatusInfo,
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

/** Local AI generation can take well over the default 10s client timeout. */
const CHAT_TIMEOUT_MS = 300_000;

/**
 * Typed API client for the Syami AI backend.
 *
 * Phase 4: health, chat, and settings endpoints are wired.
 * Phase 5: AI endpoints (status/models) + long chat timeouts.
 */
class ApiClient {
  async getHealth(): Promise<HealthResponse> {
    const { data } = await httpClient.get<ApiResponseEnvelope<HealthResponse>>('/v1/health');
    return unwrap(data);
  }

  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data } = await httpClient.post<ApiResponseEnvelope<ChatResponse>>(
      '/v1/chat/message',
      request,
      { timeout: CHAT_TIMEOUT_MS, signal: request.signal },
    );
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

  async getAiStatus(): Promise<AiStatusInfo> {
    const { data } = await httpClient.get<ApiResponseEnvelope<AiStatusInfo>>('/v1/ai/status');
    return unwrap(data);
  }

  async getAiModels(): Promise<AiModelsInfo[]> {
    const { data } = await httpClient.get<ApiResponseEnvelope<AiModelsInfo[]>>('/v1/ai/models');
    return unwrap(data);
  }
}

export const apiClient = new ApiClient();