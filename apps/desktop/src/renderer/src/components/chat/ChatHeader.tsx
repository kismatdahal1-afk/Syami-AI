import { useState } from 'react';
import { MoreHorizontal, SquarePen } from 'lucide-react';
import { Badge, Dropdown, Icon } from '@syami/ui';
import type { DropdownItem } from '@syami/ui';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { useActiveConversation, useChatStore } from '@/stores/chat.store';
import { SyamiLogo } from '@/components/common/SyamiLogo';
import { SettingsDialog, type SettingsPanel } from '@/components/settings/SettingsDialog';

export const ChatHeader = (): React.JSX.Element => {
  const active = useActiveConversation();
  const newChat = useChatStore((state) => state.newChat);
  const { status, data } = useBackendHealth();
  const [settingsPanel, setSettingsPanel] = useState<SettingsPanel | null>(null);

  const menuItems: DropdownItem[] = [
    {
      id: 'new-chat',
      label: 'New chat',
      icon: <Icon icon={SquarePen} size={16} />,
      onClick: () => newChat(),
    },
    {
      id: 'about',
      label: 'About Syami AI',
      separatorBefore: true,
      onClick: () => setSettingsPanel('about'),
    },
  ];

  const connected = status === 'online' && data?.ai?.status === 'connected';
  const badge = connected
    ? { label: 'Online', variant: 'success' as const }
    : { label: 'Offline', variant: 'warning' as const };

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5">
      <div className="flex min-w-0 items-center gap-3">
        <SyamiLogo className="h-7 w-7" alt="Syami AI" />
        <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">{active?.title ?? 'New chat'}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={badge.variant} dot>
          {badge.label}
        </Badge>
        <Dropdown trigger={<Icon icon={MoreHorizontal} size={18} />} items={menuItems} align="right" />
      </div>
      </header>
      <SettingsDialog panel={settingsPanel} onClose={() => setSettingsPanel(null)} />
    </>
  );
};