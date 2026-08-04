import { create } from 'zustand';
import { smartTitle } from '@syami/shared';
import { apiClient } from '@/lib/api';
import type { ConversationItem, ConversationSummary, MessageItem } from '@/lib/api/types';
import type { ChatMessage, Conversation } from '@/types/chat';

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Something went wrong';

const toTimestamp = (iso: string): number => new Date(iso).getTime();

const toMessage = (message: MessageItem): ChatMessage => ({
  id: message.id,
  role: message.role,
  content: message.content,
  createdAt: toTimestamp(message.createdAt),
});

const fromSummary = (summary: ConversationSummary): Conversation => ({
  id: summary.id,
  title: summary.title,
  createdAt: toTimestamp(summary.createdAt),
  updatedAt: toTimestamp(summary.updatedAt),
  messages: [],
  messagesLoaded: false,
});

const fromDetail = (detail: ConversationItem): Conversation => ({
  id: detail.id,
  title: detail.title,
  createdAt: toTimestamp(detail.createdAt),
  updatedAt: toTimestamp(detail.updatedAt),
  messages: detail.messages.map(toMessage),
  messagesLoaded: true,
});

const PIN_STORAGE_KEY = 'syami.pinned-conversations';

const readPinnedIds = (): string[] => {
  try {
    const stored = window.localStorage.getItem(PIN_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isSending: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  pinnedIds: string[];
  /** Incremented every time an assistant reply is appended (drives the typewriter reveal). */
  lastReplyAt: number;
  loadHistory: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  newChat: () => void;
  sendMessage: (content: string) => Promise<boolean>;
  renameConversation: (id: string, title: string) => Promise<boolean>;
  deleteConversation: (id: string) => Promise<boolean>;
  togglePin: (id: string) => void;
  clearError: () => void;
}

let optimisticSequence = 0;
const nextOptimisticId = (): string => {
  optimisticSequence += 1;
  return `local-msg-${Date.now()}-${optimisticSequence}`;
};

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isSending: false,
  isLoadingHistory: false,
  error: null,
  pinnedIds: readPinnedIds(),
  lastReplyAt: 0,

  loadHistory: async () => {
    set({ isLoadingHistory: true, error: null });
    try {
      const summaries = await apiClient.getChatHistory();
      set((state) => ({
        conversations: summaries.map(fromSummary),
        isLoadingHistory: false,
        activeConversationId:
          state.activeConversationId && summaries.some((c) => c.id === state.activeConversationId)
            ? state.activeConversationId
            : (summaries[0]?.id ?? null),
        pinnedIds: state.pinnedIds.filter((id) => summaries.some((c) => c.id === id)),
      }));
    } catch (error) {
      set({ isLoadingHistory: false, error: errorMessage(error) });
    }
  },

  selectConversation: async (id) => {
    const existing = get().conversations.find((conversation) => conversation.id === id);
    if (!existing) return;

    set({ activeConversationId: id, error: null });
    if (existing.local || existing.messagesLoaded) return;

    try {
      const detail = await apiClient.getConversation(id);
      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id ? fromDetail(detail) : conversation,
        ),
      }));
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },

  newChat: () => {
    const { activeConversationId, conversations } = get();
    const current = conversations.find((conversation) => conversation.id === activeConversationId);

    if (current && current.messages.length === 0) {
      set({ activeConversationId: current.id, isSending: false, error: null });
      return;
    }

    const now = Date.now();
    const conversation: Conversation = {
      id: `local-conv-${now}`,
      title: 'New chat',
      createdAt: now,
      updatedAt: now,
      messages: [],
      messagesLoaded: true,
      local: true,
    };
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: conversation.id,
      isSending: false,
      error: null,
    }));
  },

  sendMessage: async (content) => {
    const { activeConversationId, isSending, conversations } = get();
    if (!activeConversationId || isSending) return false;

    const trimmed = content.trim();
    if (!trimmed) return false;

    const activeConversation = conversations.find((c) => c.id === activeConversationId);
    if (!activeConversation) return false;

    const now = Date.now();
    const userMessage: ChatMessage = {
      id: nextOptimisticId(),
      role: 'user',
      content: trimmed,
      createdAt: now,
    };

    const isLocalConversation = activeConversation.local === true;

    set((state) => ({
      isSending: true,
      error: null,
      conversations: state.conversations.map((conversation) => {
        if (conversation.id !== activeConversationId) return conversation;
        return {
          ...conversation,
          updatedAt: now,
          title:
            isLocalConversation &&
            conversation.messages.length === 0 &&
            conversation.title === 'New chat'
              ? smartTitle(trimmed)
              : conversation.title,
          messages: [...conversation.messages, userMessage],
        };
      }),
    }));

    try {
      const response = await apiClient.sendChatMessage({
        conversationId: isLocalConversation ? undefined : activeConversationId,
        message: trimmed,
      });

      const serverId = response.conversationId;
      const replyAt = Date.now();
      const replyMessage: ChatMessage = {
        id: `server-reply-${replyAt}`,
        role: 'assistant',
        content: response.reply,
        createdAt: replyAt,
      };

      set((state) => ({
        isSending: false,
        activeConversationId:
          state.activeConversationId === activeConversationId
            ? serverId
            : state.activeConversationId,
        lastReplyAt: Date.now(),
        conversations: state.conversations.map((conversation) => {
          if (conversation.id !== activeConversationId) return conversation;
          return {
            ...conversation,
            id: serverId,
            local: false,
            messagesLoaded: true,
            updatedAt: replyAt,
            messages: [...conversation.messages, replyMessage],
          };
        }),
      }));

      return true;
    } catch (error) {
      set((state) => ({
        isSending: false,
        error: errorMessage(error),
        conversations: state.conversations.map((conversation) => {
          if (conversation.id !== activeConversationId) return conversation;
          return {
            ...conversation,
            messages: conversation.messages.filter((message) => message.id !== userMessage.id),
          };
        }),
      }));
      return false;
    }
  },

  renameConversation: async (id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return false;

    const existing = get().conversations.find((conversation) => conversation.id === id);
    if (!existing) return false;

    if (existing.local) {
      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id ? { ...conversation, title: trimmed } : conversation,
        ),
      }));
      return true;
    }

    try {
      const summary = await apiClient.renameConversation(id, trimmed);
      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id ? { ...conversation, title: summary.title } : conversation,
        ),
      }));
      return true;
    } catch (error) {
      set({ error: errorMessage(error) });
      return false;
    }
  },

  deleteConversation: async (id) => {
    const existing = get().conversations.find((conversation) => conversation.id === id);
    if (!existing) return false;

    const remaining = get().conversations.filter((conversation) => conversation.id !== id);
    const nextActive =
      get().activeConversationId === id
        ? (remaining[0]?.id ?? null)
        : get().activeConversationId;

    try {
      if (!existing.local) {
        await apiClient.deleteConversation(id);
      }
    } catch (error) {
      set({ error: errorMessage(error) });
      return false;
    }

    set({
      conversations: remaining,
      activeConversationId: nextActive,
      pinnedIds: get().pinnedIds.filter((pinnedId) => pinnedId !== id),
      error: null,
    });
    return true;
  },

  togglePin: (id) => {
    const { pinnedIds } = get();
    const next = pinnedIds.includes(id)
      ? pinnedIds.filter((pinnedId) => pinnedId !== id)
      : [id, ...pinnedIds];
    try {
      window.localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable - pins persist for this session only
    }
    set({ pinnedIds: next });
  },

  clearError: () => set({ error: null }),
}));

export const useActiveConversation = (): Conversation | null =>
  useChatStore((state) => state.conversations.find((c) => c.id === state.activeConversationId) ?? null);
