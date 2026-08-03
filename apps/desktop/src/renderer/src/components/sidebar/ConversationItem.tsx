import { cn } from '@syami/ui';
import { formatRelativeTime, truncate } from '@/lib/format';
import type { Conversation } from '@/types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
}

export const ConversationItem = ({
  conversation,
  active,
  onSelect,
}: ConversationItemProps): React.JSX.Element => {
  const preview = conversation.messages[conversation.messages.length - 1];

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'group flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors duration-150',
        active
          ? 'bg-primary/10 text-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className={cn('truncate text-sm font-medium', active ? 'text-primary' : 'text-foreground')}>
          {conversation.title}
        </span>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {formatRelativeTime(conversation.updatedAt)}
        </span>
      </span>
      {preview && <span className="truncate text-xs text-muted-foreground">{truncate(preview.content, 56)}</span>}
    </button>
  );
};