import { create } from 'zustand';
import { pickReply, seedConversations } from '../data/mockChat';
import { titleFromText } from '../lib/format';
import type { ChatMessage, Conversation } from '../types/chat';

const REPLY_DELAY_MS = 1100;

let messageSequence = 0;
const nextMessageId = (): string => {
  messageSequence += 1;
  return `m-${Date.now()}-${messageSequence}`;
};

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isSending: boolean;
  newChat: () => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => void;
}

const createEmptyConversation = (): Conversation => {
  const now = Date.now();
  return {
    id: `conv-${now}`,
    title: 'New chat',
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
};

export const useChatStore = create<ChatState>()((set, get) => {
  const seeded = seedConversations();

  return {
    conversations: seeded,
    activeConversationId: seeded[0]?.id ?? null,
    isSending: false,

    newChat: () => {
      const conversation = createEmptyConversation();
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
        isSending: false,
      }));
    },

    selectConversation: (id) => set({ activeConversationId: id }),

    sendMessage: (content) => {
      const { activeConversationId, isSending } = get();
      if (!activeConversationId || isSending) return;
      const trimmed = content.trim();
      if (!trimmed) return;

      const now = Date.now();
      const userMessage: ChatMessage = {
        id: nextMessageId(),
        role: 'user',
        content: trimmed,
        createdAt: now,
      };

      set((state) => ({
        isSending: true,
        conversations: state.conversations.map((conversation) => {
          if (conversation.id !== activeConversationId) return conversation;
          const isFirstMessage = conversation.messages.length === 0;
          return {
            ...conversation,
            title: isFirstMessage ? titleFromText(trimmed) : conversation.title,
            updatedAt: now,
            messages: [...conversation.messages, userMessage],
          };
        }),
      }));

      window.setTimeout(() => {
        const reply: ChatMessage = {
          id: nextMessageId(),
          role: 'assistant',
          content: pickReply(),
          createdAt: Date.now(),
        };

        set((state) => ({
          isSending: false,
          conversations: state.conversations.map((conversation) => {
            if (conversation.id !== state.activeConversationId) return conversation;
            return {
              ...conversation,
              updatedAt: reply.createdAt,
              messages: [...conversation.messages, reply],
            };
          }),
        }));
      }, REPLY_DELAY_MS);
    },
  };
});

export const useActiveConversation = (): Conversation | null =>
  useChatStore((state) => {
    const active = state.conversations.find((conversation) => conversation.id === state.activeConversationId);
    return active ?? null;
  });
