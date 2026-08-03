import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TypingIndicator } from './TypingIndicator';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import { MessageContainer } from './MessageContainer';
import type { ChatMessage } from '@/types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
}

export const MessageList = ({ messages, isSending }: MessageListProps): React.JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isSending]);

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-6 py-6">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {message.role === 'user' ? (
                <UserMessage message={message} />
              ) : (
                <AIMessage message={message} />
              )}
            </motion.div>
          ))}

          {isSending && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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