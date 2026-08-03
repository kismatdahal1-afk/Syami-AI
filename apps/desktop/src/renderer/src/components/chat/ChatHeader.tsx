import { MoreHorizontal, Plus } from 'lucide-react';
import { Badge, Dropdown, Icon } from '@syami/ui';
import type { DropdownItem } from '@syami/ui';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';
import { useActiveConversation, useChatStore } from '@/stores/chat.store';

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'danger' | 'info' }> = {
  checking: { label: 'Connecting', variant: 'info' },
  online: { label: 'Ready', variant: 'success' },
  offline: { label: 'Offline', variant: 'danger' },
};

export const ChatHeader = (): React.JSX.Element => {
  const active = useActiveConversation();
  const newChat = useChatStore((state) => state.newChat);
  const { status } = useBackendHealth();

  const menuItems: DropdownItem[] = [
    {
      id: 'new-chat',
      label: 'New chat',
      icon: <Icon icon={Plus} size={16} />,
      onClick: newChat,
    },
    {
      id: 'about',
      label: 'About Syami AI',
      separatorBefore: true,
      onClick: () => {
        /* informational placeholder */
      },
    },
  ];

  const badge = STATUS_BADGE[status];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">{active?.title ?? 'New chat'}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={badge.variant} dot>
          {badge.label}
        </Badge>
        <ThemeSwitch />
        <Dropdown trigger={<Icon icon={MoreHorizontal} size={18} />} items={menuItems} align="right" />
      </div>
    </header>
  );
};