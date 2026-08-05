import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TypingIndicator } from './TypingIndicator';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import { MessageContainer } from './MessageContainer';
import { useChatStore } from '@/stores/chat.store';
import type { ChatMessage } from '@/types/chat';

interface MessageListProps {
  conversationId: string;
  messages: ChatMessage[];
  isSending: boolean;
}

const SCROLL_THRESHOLD = 80;

/** Remembers each conversation's scroll position, so switching away and back restores your spot. */
const savedScrollPositions = new Map<string, number>();

export const MessageList = ({
  conversationId,
  messages,
  isSending,
}: MessageListProps): React.JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const prevReplyAtRef = useRef(0);
  const prevIdsRef = useRef<string[]>([]);
  const lastScrollHeightRef = useRef(0);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const lastReplyAt = useChatStore((state) => state.lastReplyAt);

  const isNearBottom = (): boolean => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
  };

  const handleScroll = (): void => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = isNearBottom();
    savedScrollPositions.set(conversationId, el.scrollTop);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth'): void => {
    const el = scrollRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  // Detect a fresh assistant reply and reveal it with the typewriter.
  useEffect(() => {
    if (lastReplyAt === 0 || prevReplyAtRef.current === lastReplyAt) return;
    prevReplyAtRef.current = lastReplyAt;
    const last = messages[messages.length - 1];
    const isFreshReply = last && last.role === 'assistant' && Date.now() - last.createdAt < 60_000;
    if (isFreshReply) {
      setStreamingMessageId(last.id);
    }
  }, [lastReplyAt, messages]);

  // Track the user's scrolling - this decides whether the view may follow new content.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [conversationId]);

  // Conversation switch: restore the user's saved spot, or jump to the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const currentIds = messages.map((message) => message.id);
    const switched = !prevIdsRef.current.some((id) => currentIds.includes(id));
    prevIdsRef.current = currentIds;
    if (!switched) return;

    const saved = savedScrollPositions.get(conversationId);
    if (saved !== undefined) {
      el.scrollTop = saved;
      stickToBottomRef.current = isNearBottom();
    } else {
      stickToBottomRef.current = true;
      el.scrollTop = el.scrollHeight;
    }
    lastScrollHeightRef.current = el.scrollHeight;
  }, [conversationId, messages]);

  // Gentle follow for new messages (your own message, a completed reply) -
  // only while the user is still at the bottom.
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isSending]);

  // While the reply types out: follow the bottom ONLY while the user stays at the
  // bottom and the content actually grows. Scrolling up is always free - the view
  // never fights the user while the AI is replying.
  useEffect(() => {
    if (!streamingMessageId) return;
    let frame = 0;
    const tick = (): void => {
      const el = scrollRef.current;
      if (!el) return;
      if (stickToBottomRef.current && el.scrollHeight !== lastScrollHeightRef.current) {
        lastScrollHeightRef.current = el.scrollHeight;
        el.scrollTop = el.scrollHeight;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [streamingMessageId]);

  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-6 pb-40 pt-6">
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
