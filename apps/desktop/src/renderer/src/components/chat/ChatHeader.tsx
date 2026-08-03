import { MoreHorizontal, Plus } from 'lucide-react';
import { Badge, Dropdown, Icon } from '@syami/ui';
import type { DropdownItem } from '@syami/ui';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';
import { useActiveConversation, useChatStore } from '@/stores/chat.store';

export const ChatHeader = (): React.JSX.Element => {
  const active = useActiveConversation();
  const newChat = useChatStore((state) => state.newChat);

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

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">{active?.title ?? 'New chat'}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="success" dot>
          Ready
        </Badge>
        <ThemeSwitch />
        <Dropdown trigger={<Icon icon={MoreHorizontal} size={18} />} items={menuItems} align="right" />
      </div>
    </header>
  );
};