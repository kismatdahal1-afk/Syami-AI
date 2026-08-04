import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Icon } from '@syami/ui';
import { ConversationItem } from './ConversationItem';
import type { Conversation } from '@/types/chat';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  pinnedIds: string[];
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onPin: (id: string) => void;
}

const STAGGER = 0.04;

export const ConversationList = ({
  conversations,
  activeConversationId,
  pinnedIds,
  onSelect,
  onRename,
  onDelete,
  onPin,
}: ConversationListProps): React.JSX.Element => {
  return (
    <nav aria-label="Conversation history" className="flex flex-col gap-0.5">
      <AnimatePresence initial={false}>
        {conversations.length === 0 && (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 px-3 py-8 text-center text-xs text-muted-foreground"
          >
            <Icon icon={MessageSquare} size={16} />
            No conversations found
          </motion.p>
        )}
        {conversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2, delay: index * STAGGER, ease: 'easeOut' }}
          >
            <ConversationItem
              conversation={conversation}
              active={conversation.id === activeConversationId}
              pinned={pinnedIds.includes(conversation.id)}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onPin={onPin}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </nav>
  );
};