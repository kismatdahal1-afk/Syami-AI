import { Cpu, Menu, MoreHorizontal, SquarePen } from 'lucide-react';
import { Badge, Button, Dropdown, Icon } from '@syami/ui';
import type { DropdownItem } from '@syami/ui';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { useActiveConversation, useChatStore } from '@/stores/chat.store';
import { SyamiLogo } from '@/components/common/SyamiLogo';

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' }> = {
  checking: { label: 'Connecting', variant: 'info' },
  online: { label: 'Ready', variant: 'success' },
  'ai-offline': { label: 'AI offline', variant: 'warning' },
  offline: { label: 'Offline', variant: 'danger' },
};

interface ChatHeaderProps {
  onMenuClick?: () => void;
}

export const ChatHeader = ({ onMenuClick }: ChatHeaderProps): React.JSX.Element => {
  const active = useActiveConversation();
  const newChat = useChatStore((state) => state.newChat);
  const { status, data } = useBackendHealth();

  const menuItems: DropdownItem[] = [
    {
      id: 'new-chat',
      label: 'New chat',
      icon: <Icon icon={SquarePen} size={16} />,
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

  // Backend reachable but Ollama down -> distinct "AI offline" state.
  const effectiveStatus =
    status === 'online' && data?.ai?.status === 'disconnected' ? 'ai-offline' : status;
  const badge = STATUS_BADGE[effectiveStatus];
  const model = data?.ai?.model ?? null;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Toggle sidebar"
            onClick={onMenuClick}
            className="shrink-0"
          >
            <Icon icon={Menu} size={18} />
          </Button>
        )}
        <SyamiLogo className="h-7 w-7" alt="Syami AI" />
        <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">{active?.title ?? 'New chat'}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {model && (
          <span
            className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground sm:flex"
            title={`Current AI model: ${model}`}
          >
            <Icon icon={Cpu} size={13} className="text-accent" />
            {model}
          </span>
        )}
        <Badge variant={badge.variant} dot>
          {badge.label}
        </Badge>
        <Dropdown trigger={<Icon icon={MoreHorizontal} size={18} />} items={menuItems} align="right" />
      </div>
    </header>
  );
};