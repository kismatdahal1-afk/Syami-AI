import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useActiveConversation, useChatStore } from '@/stores/chat.store';
import { ChatInput, type ChatInputHandle } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { MessageList } from '@/components/chat/MessageList';
import { OfflineNotice } from '@/components/chat/OfflineNotice';

const ChatPage = (): React.JSX.Element => {
  const active = useActiveConversation();
  const isSending = useChatStore((state) => state.isSending);
  const error = useChatStore((state) => state.error);
  const inputRef = useRef<ChatInputHandle>(null);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {error && <OfflineNotice message={error} />}
      <AnimatePresence mode="wait" initial={false}>
        {active && active.messages.length > 0 ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <MessageList messages={active.messages} isSending={isSending} />
          </motion.div>
        ) : (
          <EmptyState
            key="welcome"
            onInsert={(prompt) => inputRef.current?.insertText(prompt)}
          />
        )}
      </AnimatePresence>
      <ChatInput ref={inputRef} />
    </div>
  );
};

export default ChatPage;
