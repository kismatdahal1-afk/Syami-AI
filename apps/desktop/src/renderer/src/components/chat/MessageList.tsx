import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TypingIndicator } from './TypingIndicator';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import { MessageContainer } from './MessageContainer';
import { useChatStore } from '@/stores/chat.store';
import type { ChatMessage } from '@/types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
}

const SCROLL_THRESHOLD = 80;

export const MessageList = ({ messages, isSending }: MessageListProps): React.JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const prevReplyAtRef = useRef(0);
  const prevIdsRef = useRef<string[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const lastReplyAt = useChatStore((state) => state.lastReplyAt);

  const handleScroll = (): void => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth'): void => {
    const el = scrollRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  useEffect(() => {
    if (lastReplyAt === 0 || prevReplyAtRef.current === lastReplyAt) return;
    prevReplyAtRef.current = lastReplyAt;
    const last = messages[messages.length - 1];
    const isFreshReply = last && last.role === 'assistant' && Date.now() - last.createdAt < 60_000;
    if (isFreshReply) {
      setStreamingMessageId(last.id);
    }
  }, [lastReplyAt, messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const currentIds = messages.map((message) => message.id);
    const switchedConversation = !prevIdsRef.current.some((id) => currentIds.includes(id));
    if (switchedConversation) {
      stickToBottomRef.current = true;
    }
    prevIdsRef.current = currentIds;
    scrollToBottom(isSending ? 'auto' : 'smooth');
  }, [messages, isSending]);

  useEffect(() => {
    if (!streamingMessageId) return;
    let frame = 0;
    const tick = (): void => {
      scrollToBottom('auto');
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [streamingMessageId]);

  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-6 py-6">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {message.role === 'user' ? (
                <UserMessage message={message} />
              ) : (
                <AIMessage
                  message={message}
                  streaming={streamingMessageId === message.id && message.id === lastMessageId}
                  onStreamEnd={() =>
                    setStreamingMessageId((current) => (current === message.id ? null : current))
                  }
                />
              )}
            </motion.div>
          ))}

          {isSending && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <MessageContainer role="assistant" avatarName="Syami AI" name="Syami AI">
                <span className="sr-only">Syami AI is typing</span>
                <TypingIndicator />
              </MessageContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};