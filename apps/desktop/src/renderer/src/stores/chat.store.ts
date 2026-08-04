import { create } from 'zustand';
import axios from 'axios';
import { smartTitle } from '@syami/shared';
import { apiClient } from '@/lib/api';
import type { ConversationItem, ConversationSummary, MessageItem } from '@/lib/api/types';
import type { ChatMessage, Conversation } from '@/types/chat';

let activeRequestController: AbortController | null = null;

const isRequestCancelled = (error: unknown): boolean => axios.isCancel(error);

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
  /** In-memory first-message conversation, held outside Recent Conversations until the reply succeeds. */
  activeDraft: Conversation | null;
  isSending: boolean;
  isLoadingHistory: boolean;
  isLoadingConversation: boolean;
  error: string | null;
  pinnedIds: string[];
  /** Incremented every time an assistant reply is appended (drives the typewriter reveal). */
  lastReplyAt: number;
  loadHistory: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  newChat: () => void;
  sendMessage: (content: string) => Promise<boolean>;
  /** Removes the last AI reply and re-asks the same prompt. */
  regenerate: () => Promise<boolean>;
  /** Replaces a user message with new content and regenerates the reply. */
  editMessage: (id: string, content: string) => Promise<boolean>;
  /** Aborts the in-flight AI generation immediately. */
  stopGenerating: () => void;
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
  activeDraft: null,
  isSending: false,
  isLoadingHistory: true,
  isLoadingConversation: false,
  error: null,
  pinnedIds: readPinnedIds(),
  lastReplyAt: 0,

  loadHistory: async () => {
    set({ isLoadingHistory: true, error: null });
    try {
      const summaries = await apiClient.getChatHistory();
      const activeId =
        get().activeConversationId && summaries.some((c) => c.id === get().activeConversationId)
          ? get().activeConversationId
          : (summaries[0]?.id ?? null);
      set((state) => ({
        conversations: summaries.map(fromSummary),
        isLoadingHistory: false,
        activeConversationId: activeId,
        pinnedIds: state.pinnedIds.filter((id) => summaries.some((c) => c.id === id)),
      }));
      if (activeId) {
        await get().selectConversation(activeId);
      }
    } catch (error) {
      set({ isLoadingHistory: false, error: errorMessage(error) });
    }
  },

  selectConversation: async (id) => {
    const existing = get().conversations.find((conversation) => conversation.id === id);
    if (!existing) return;

    set({ activeConversationId: id, activeDraft: null, error: null });
    if (existing.local || existing.messagesLoaded) return;

    set({ isLoadingConversation: true });
    try {
      const detail = await apiClient.getConversation(id);
      set((state) => ({
        conversations:
          state.activeConversationId === id
            ? state.conversations.map((conversation) =>
                conversation.id === id ? fromDetail(detail) : conversation,
              )
            : state.conversations,
        isLoadingConversation: false,
      }));
    } catch (error) {
      set((state) => ({
        isLoadingConversation: false,
        error: state.activeConversationId === id ? errorMessage(error) : state.error,
      }));
    }
  },

  newChat: () => {
    set({ activeConversationId: null, activeDraft: null, isSending: false, error: null });
  },

  sendMessage: async (content) => {
    const { activeConversationId, activeDraft, isSending, conversations } = get();
    if (isSending) return false;

    const trimmed = content.trim();
    if (!trimmed) return false;

    const now = Date.now();
    const userMessage: ChatMessage = {
      id: nextOptimisticId(),
      role: 'user',
      content: trimmed,
      createdAt: now,
    };

    // First message of a brand-new chat: create an in-memory draft that is NOT
    // added to Recent Conversations. The backend creates the conversation and
    // we commit it to the sidebar only once the reply succeeds.
    const isFreshConversation = !activeConversationId && !activeDraft;

    if (isFreshConversation) {
      const draft: Conversation = {
        id: `draft-${now}`,
        title: smartTitle(trimmed),
        createdAt: now,
        updatedAt: now,
        messages: [userMessage],
        messagesLoaded: true,
        local: true,
      };
      set({ activeDraft: draft, isSending: true, error: null });
    } else {
      const activeConversation = conversations.find((c) => c.id === activeConversationId);
      if (!activeConversation) return false;

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
    }

    try {
      const controller = new AbortController();
      activeRequestController = controller;
      const response = await apiClient.sendChatMessage({
        conversationId: activeConversationId ?? undefined,
        message: trimmed,
        signal: controller.signal,
      });
      if (activeRequestController === controller) {
        activeRequestController = null;
      }

      const serverId = response.conversationId;
      const replyAt = Date.now();
      const replyMessage: ChatMessage = {
        id: `server-reply-${replyAt}`,
        role: 'assistant',
        content: response.reply,
        createdAt: replyAt,
      };

      if (isFreshConversation) {
        // Commit the draft to Recent Conversations now that the first reply exists.
        const committed: Conversation = {
          id: serverId,
          title: smartTitle(trimmed),
          createdAt: now,
          updatedAt: replyAt,
          messages: [userMessage, replyMessage],
          messagesLoaded: true,
        };
        set((state) => ({
          isSending: false,
          activeDraft: null,
          activeConversationId:
            state.activeConversationId === null ? serverId : state.activeConversationId,
          lastReplyAt: Date.now(),
          conversations: [committed, ...state.conversations],
        }));
      } else {
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
      }

      return true;
    } catch (error) {
      activeRequestController = null;
      if (isRequestCancelled(error)) {
        if (isFreshConversation) {
          // Draft never existed in the sidebar - discard it on cancel.
          set({ isSending: false, activeDraft: null });
        } else {
          // Keep the user's message, the reply just never arrived.
          set({ isSending: false });
        }
        return false;
      }
      if (isFreshConversation) {
        // The draft never existed in the sidebar, so discard it entirely.
        set({ isSending: false, activeDraft: null, error: errorMessage(error) });
      } else {
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
      }
      return false;
    }
  },

  regenerate: async () => {
    const { activeConversationId, isSending, conversations } = get();
    if (!activeConversationId || isSending) return false;

    const conversation = conversations.find((c) => c.id === activeConversationId);
    if (!conversation || !conversation.messagesLoaded) return false;

    const messages = conversation.messages;
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) return false;

    const prompt = messages[lastUserIndex].content;
    const trimmedMessages = messages.slice(0, lastUserIndex + 1);

    set((state) => ({
      isSending: true,
      error: null,
      conversations: state.conversations.map((conversation) =>
        conversation.id === activeConversationId
          ? { ...conversation, messages: trimmedMessages }
          : conversation,
      ),
    }));

    try {
      const controller = new AbortController();
      activeRequestController = controller;
      const response = await apiClient.sendChatMessage({
        conversationId: activeConversationId,
        message: prompt,
        signal: controller.signal,
      });
      if (activeRequestController === controller) {
        activeRequestController = null;
      }

      const replyAt = Date.now();
      const replyMessage: ChatMessage = {
        id: `server-reply-${replyAt}`,
        role: 'assistant',
        content: response.reply,
        createdAt: replyAt,
      };

      set((state) => ({
        isSending: false,
        lastReplyAt: Date.now(),
        conversations: state.conversations.map((conversation) =>
          conversation.id === activeConversationId
            ? { ...conversation, updatedAt: replyAt, messages: [...trimmedMessages, replyMessage] }
            : conversation,
        ),
      }));
      return true;
    } catch (error) {
      activeRequestController = null;
      set((state) => ({
        isSending: false,
        error: isRequestCancelled(error) ? null : errorMessage(error),
        conversations: state.conversations.map((conversation) =>
          conversation.id === activeConversationId
            ? { ...conversation, messages: trimmedMessages }
            : conversation,
        ),
      }));
      return false;
    }
  },

  editMessage: async (id, content) => {
    const { activeConversationId, isSending, conversations } = get();
    if (!activeConversationId || isSending) return false;

    const trimmed = content.trim();
    if (!trimmed) return false;

    const conversation = conversations.find((c) => c.id === activeConversationId);
    if (!conversation || !conversation.messagesLoaded) return false;

    const index = conversation.messages.findIndex((m) => m.id === id);
    if (index === -1 || conversation.messages[index].role !== 'user') return false;

    const updatedMessage: ChatMessage = { ...conversation.messages[index], content: trimmed };
    const updatedMessages = [...conversation.messages.slice(0, index), updatedMessage];

    set((state) => ({
      isSending: true,
      error: null,
      conversations: state.conversations.map((c) =>
        c.id === activeConversationId ? { ...c, messages: updatedMessages } : c,
      ),
    }));

    try {
      const controller = new AbortController();
      activeRequestController = controller;
      const response = await apiClient.sendChatMessage({
        conversationId: activeConversationId,
        message: trimmed,
        signal: controller.signal,
      });
      if (activeRequestController === controller) {
        activeRequestController = null;
      }

      const replyAt = Date.now();
      const replyMessage: ChatMessage = {
        id: `server-reply-${replyAt}`,
        role: 'assistant',
        content: response.reply,
        createdAt: replyAt,
      };

      set((state) => ({
        isSending: false,
        lastReplyAt: Date.now(),
        conversations: state.conversations.map((c) =>
          c.id === activeConversationId
            ? { ...c, updatedAt: replyAt, messages: [...updatedMessages, replyMessage] }
            : c,
        ),
      }));
      return true;
    } catch (error) {
      activeRequestController = null;
      set((state) => ({
        isSending: false,
        error: isRequestCancelled(error) ? null : errorMessage(error),
        conversations: state.conversations.map((c) =>
          c.id === activeConversationId ? { ...c, messages: updatedMessages } : c,
        ),
      }));
      return false;
    }
  },

  stopGenerating: () => {
    activeRequestController?.abort();
    activeRequestController = null;
    set({ isSending: false });
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

    if (nextActive) {
      await get().selectConversation(nextActive);
    }
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
  useChatStore(
    (state) =>
      state.conversations.find((c) => c.id === state.activeConversationId) ??
      state.activeDraft ??
      null,
  );
