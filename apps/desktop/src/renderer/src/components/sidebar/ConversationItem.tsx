import { useState } from 'react';
import { MoreHorizontal, Pencil, Pin, PinOff, Trash2 } from 'lucide-react';
import { cn, Dropdown, Icon } from '@syami/ui';
import type { DropdownItem } from '@syami/ui';
import { DeleteConversationModal } from './DeleteConversationModal';
import { formatRelativeTime, truncate } from '@/lib/format';
import type { Conversation } from '@/types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  pinned: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onPin: (id: string) => void;
}

export const ConversationItem = ({
  conversation,
  active,
  pinned,
  onSelect,
  onRename,
  onDelete,
  onPin,
}: ConversationItemProps): React.JSX.Element => {
  const [draft, setDraft] = useState(conversation.title);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  const commitRename = async (): Promise<void> => {
    setEditing(false);
    const trimmed = draft.trim();
    if (!trimmed || trimmed === conversation.title) return;
    const ok = await onRename(conversation.id, trimmed);
    if (!ok) setDraft(conversation.title);
  };

  const menuItems: DropdownItem[] = [
    {
      id: 'rename',
      label: 'Rename',
      icon: <Icon icon={Pencil} size={14} />,
      onClick: () => {
        setDraft(conversation.title);
        setEditing(true);
      },
    },
    {
      id: 'pin',
      label: pinned ? 'Unpin' : 'Pin',
      icon: <Icon icon={pinned ? PinOff : Pin} size={14} />,
      onClick: () => onPin(conversation.id),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Icon icon={Trash2} size={14} />,
      variant: 'danger',
      onClick: () => setConfirmDelete(true),
    },
  ];

  return (
    <>
      <div className="group relative">
        <div
          role="button"
          tabIndex={0}
          aria-current={active ? 'true' : undefined}
          onClick={() => onSelect(conversation.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect(conversation.id);
            }
          }}
          className={cn(
            'flex w-full cursor-pointer flex-col gap-0.5 rounded-lg py-2 pl-3 pr-8 text-left transition-colors duration-150',
            active
              ? 'bg-primary/10 text-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            pinned && !active && 'bg-accent-subtle/50 hover:bg-muted',
          )}
        >
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={() => void commitRename()}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void commitRename();
                if (event.key === 'Escape') {
                  setDraft(conversation.title);
                  setEditing(false);
                }
              }}
              onClick={(event) => event.stopPropagation()}
              aria-label="Conversation title"
              className="min-w-0 flex-1 rounded border border-input bg-background px-1.5 py-0.5 text-sm text-foreground outline-none focus:border-primary/60 focus:shadow-glow-primary"
            />
          ) : (
            <span className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5">
                {pinned && (
                  <Icon icon={Pin} size={12} className="shrink-0 text-accent" aria-label="Pinned" />
                )}
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-sm font-medium',
                    active ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {conversation.title}
                </span>
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {formatRelativeTime(conversation.updatedAt)}
              </span>
            </span>
          )}

          {lastMessage && !editing && (
            <span className="truncate text-xs text-muted-foreground">
              {truncate(lastMessage.content, 56)}
            </span>
          )}
        </div>

        {!editing && (
          <div
            className={cn(
              'absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md opacity-0 transition-opacity duration-150',
              'group-hover:opacity-100 group-focus-within:opacity-100',
              active && 'opacity-100',
            )}
          >
            <Dropdown
              hideCaret
              align="right"
              triggerClassName="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              trigger={<Icon icon={MoreHorizontal} size={15} />}
              items={menuItems}
            />
          </div>
        )}
      </div>

      <DeleteConversationModal
        open={confirmDelete}
        title={conversation.title}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          const ok = await onDelete(conversation.id);
          if (ok) setConfirmDelete(false);
        }}
      />
    </>
  );
};