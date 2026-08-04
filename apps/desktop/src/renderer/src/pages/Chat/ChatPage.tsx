import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loading } from '@syami/ui';
import { useActiveConversation, useChatStore } from '@/stores/chat.store';
import { ChatInput, type ChatInputHandle } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { MessageList } from '@/components/chat/MessageList';
import { OfflineNotice } from '@/components/chat/OfflineNotice';

const ChatPage = (): React.JSX.Element => {
  const active = useActiveConversation();
  const isSending = useChatStore((state) => state.isSending);
  const error = useChatStore((state) => state.error);
  const isLoadingHistory = useChatStore((state) => state.isLoadingHistory);
  const isLoadingConversation = useChatStore((state) => state.isLoadingConversation);
  const inputRef = useRef<ChatInputHandle>(null);

  const loading = isLoadingHistory || isLoadingConversation;

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {error && <OfflineNotice message={error} />}
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex min-h-0 flex-1 items-center justify-center"
          >
            <Loading size="md" />
          </motion.div>
        ) : active ? (
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative flex min-h-0 flex-1 flex-col"
          >
            <MessageList messages={active.messages} isSending={isSending} />
            <ChatInput ref={inputRef} />
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative flex min-h-0 flex-1 flex-col"
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
