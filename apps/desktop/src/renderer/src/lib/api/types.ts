import type { ApiResponse, HealthData } from '@syami/shared';

export type HealthResponse = HealthData;

export interface ChatRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
  conversationId: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ConversationItem extends ConversationSummary {
  messages: MessageItem[];
}

export interface AiStatus {
  running: boolean;
  version?: string;
}

export interface SettingsResponse {
  theme: string;
  language: 'en' | 'ne';
  createdAt: string;
}

export type ApiResponseEnvelope<T> = ApiResponse<T>;
