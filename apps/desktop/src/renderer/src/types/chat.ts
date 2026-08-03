export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  /** true once messages have been fetched from the backend */
  messagesLoaded: boolean;
  /** true for conversations created locally that have not been persisted yet */
  local?: boolean;
}