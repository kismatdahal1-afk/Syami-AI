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
      {conversations.length === 0 && (
        <p className="flex flex-col items-center gap-2 px-3 py-8 text-center text-xs text-muted-foreground">
          <Icon icon={MessageSquare} size={16} />
          No conversations found
        </p>
      )}
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          active={conversation.id === activeConversationId}
          pinned={pinnedIds.includes(conversation.id)}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
          onPin={onPin}
        />
      ))}
    </nav>
  );
};
