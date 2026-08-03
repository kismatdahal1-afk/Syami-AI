import type { MessageRole } from '@prisma/client';

export interface MessageOut {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ConversationSummaryOut {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationOut extends ConversationSummaryOut {
  messages: MessageOut[];
}

export interface SendMessageRequest {
  conversationId?: string;
  message: string;
}

export interface SendMessageResult {
  conversationId: string;
  reply: string;
}

export interface RenameConversationRequest {
  title: string;
}

export interface SettingsOut {
  theme: string;
  language: string;
  createdAt: string;
}

export interface UpdateSettingsRequest {
  theme?: string;
  language?: string;
}
