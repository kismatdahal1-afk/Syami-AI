import { MessageSquare, PanelLeftOpen, Search, SquarePen } from 'lucide-react';
import { Avatar, cn, Icon } from '@syami/ui';
import { SyamiLogo } from '@/components/common/SyamiLogo';
import type { SettingsPanel } from '@/components/settings/SettingsDialog';
import { SettingsMenu } from './SettingsMenu';

interface SidebarRailProps {
  onExpand: () => void;
  onNewChat: () => void;
  onSearch: () => void;
  onOpenPanel: (panel: SettingsPanel) => void;
}

const RAIL_BUTTON_CLASSES =
  'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-[color,background-color,transform] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const SidebarRail = ({
  onExpand,
  onNewChat,
  onSearch,
  onOpenPanel,
}: SidebarRailProps): React.JSX.Element => {
  return (
    <div className="flex h-full w-full flex-col items-center gap-1 py-2.5">
      <button
        type="button"
        onClick={onExpand}
        aria-label="Syami AI - Expand sidebar"
        title="Expand sidebar"
        className={cn(RAIL_BUTTON_CLASSES, 'text-foreground hover:bg-muted')}
      >
        <SyamiLogo className="h-8 w-8" alt="Syami AI" />
      </button>

      <button
        type="button"
        onClick={onExpand}
        aria-label="Expand sidebar"
        title="Expand sidebar"
        className={cn(RAIL_BUTTON_CLASSES, 'text-muted-foreground hover:bg-muted hover:text-foreground')}
      >
        <Icon icon={PanelLeftOpen} size={18} />
      </button>

      <div className="my-1 h-px w-8 shrink-0 bg-border" role="separator" />

      <button
        type="button"
        onClick={onNewChat}
        aria-label="New chat"
        title="New chat"
        className={cn(RAIL_BUTTON_CLASSES, 'text-muted-foreground hover:bg-muted hover:text-foreground')}
      >
        <Icon icon={SquarePen} size={17} />
      </button>

      <button
        type="button"
        onClick={onSearch}
        aria-label="Search chats"
        title="Search chats"
        className={cn(RAIL_BUTTON_CLASSES, 'text-muted-foreground hover:bg-muted hover:text-foreground')}
      >
        <Icon icon={Search} size={18} />
      </button>

      <button
        type="button"
        onClick={onExpand}
        aria-label="Recent conversations"
        title="Recent conversations"
        className={cn(RAIL_BUTTON_CLASSES, 'text-muted-foreground hover:bg-muted hover:text-foreground')}
      >
        <Icon icon={MessageSquare} size={17} />
      </button>

      <div className="min-h-0 flex-1" />

      <div className="flex w-full flex-col items-center gap-1 pt-2">
        <SettingsMenu
          icon={
            <span className="shrink-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary p-[2px]">
              <Avatar name="Local User" size="sm" className="h-5 w-5 text-[10px] font-semibold" />
            </span>
          }
          className={cn(RAIL_BUTTON_CLASSES, 'px-0 py-0')}
          onSelect={onOpenPanel}
        />
      </div>
    </div>
  );
};