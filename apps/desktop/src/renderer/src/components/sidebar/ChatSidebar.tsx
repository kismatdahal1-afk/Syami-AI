import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { APP_VERSION } from '@syami/shared';
import { Avatar, Icon } from '@syami/ui';
import { SyamiLogo } from '@/components/common/SyamiLogo';
import { useChatStore } from '@/stores/chat.store';
import { ConversationList } from './ConversationList';
import { NewChatButton } from './NewChatButton';
import { SearchChats } from './SearchChats';
import { SettingsDialog, type SettingsPanel } from './SettingsDialog';
import { SettingsMenu } from './SettingsMenu';
import { SidebarRail } from './SidebarRail';

const DEFAULT_SIDEBAR_WIDTH = 288;
const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 400;
const RAIL_WIDTH = 56;
const WIDTH_STORAGE_KEY = 'syami.sidebar-width';

/** Motion-design curve: expo-out feels like a spring without the bounce. */
const SIDEBAR_TRANSITION = { type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] } as const;
const CONTENT_TRANSITION = { duration: 0.22, ease: 'easeOut' } as const;

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  resizable?: boolean;
}

const readStoredWidth = (): number => {
  try {
    const stored = window.localStorage.getItem(WIDTH_STORAGE_KEY);
    const parsed = stored ? Number.parseInt(stored, 10) : NaN;
    if (Number.isFinite(parsed)) {
      return Math.min(Math.max(parsed, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
    }
  } catch {
    // Storage unavailable - fall back to default width
  }
  return DEFAULT_SIDEBAR_WIDTH;
};

export const ChatSidebar = ({
  collapsed,
  onToggle,
  resizable = true,
}: ChatSidebarProps): React.JSX.Element => {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const isLoadingHistory = useChatStore((state) => state.isLoadingHistory);
  const pinnedIds = useChatStore((state) => state.pinnedIds);
  const loadHistory = useChatStore((state) => state.loadHistory);
  const newChat = useChatStore((state) => state.newChat);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const renameConversation = useChatStore((state) => state.renameConversation);
  const deleteConversation = useChatStore((state) => state.deleteConversation);
  const togglePin = useChatStore((state) => state.togglePin);

  const [width, setWidth] = useState(resizable ? readStoredWidth() : DEFAULT_SIDEBAR_WIDTH);
  const [query, setQuery] = useState('');
  const [focusSearch, setFocusSearch] = useState(false);
  const [settingsPanel, setSettingsPanel] = useState<SettingsPanel | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);
  const widthRef = useRef(width);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!collapsed && focusSearch) {
      searchInputRef.current?.focus();
      setFocusSearch(false);
    }
  }, [collapsed, focusSearch]);

  const persistWidth = useCallback((next: number): void => {
    try {
      window.localStorage.setItem(WIDTH_STORAGE_KEY, String(next));
    } catch {
      // Storage unavailable - width resets on restart
    }
  }, []);

  const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>): void => {
    dragState.current = { startX: event.clientX, startWidth: width };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleResizeMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!dragState.current) return;
    const delta = event.clientX - dragState.current.startX;
    const next = Math.min(Math.max(dragState.current.startWidth + delta, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
    setWidth(next);
  };

  const handleResizeEnd = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!dragState.current) return;
    dragState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    persistWidth(widthRef.current);
  };

  const expand = (): void => {
    if (collapsed) onToggle();
  };

  const handleRailNewChat = (): void => {
    newChat();
    expand();
  };

  const handleRailSearch = (): void => {
    setFocusSearch(true);
    expand();
  };

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? conversations.filter(
        (conversation) =>
          conversation.title.toLowerCase().includes(normalized) ||
          conversation.messages.some((message) => message.content.toLowerCase().includes(normalized)),
      )
    : conversations;

  const pinned = filtered.filter((conversation) => pinnedIds.includes(conversation.id));
  const unpinned = filtered.filter((conversation) => !pinnedIds.includes(conversation.id));
  const sorted = [...pinned, ...unpinned];

  return (
    <>
      <motion.aside
        aria-label="Chat sidebar"
        className="group relative flex h-full shrink-0 overflow-hidden border-r border-border bg-surface"
        initial={false}
        animate={{ width: collapsed ? RAIL_WIDTH : width }}
        transition={SIDEBAR_TRANSITION}
      >
        <AnimatePresence initial={false}>
          {collapsed ? (
            <motion.div
              key="rail"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={CONTENT_TRANSITION}
            >
              <SidebarRail
                onExpand={expand}
                onNewChat={handleRailNewChat}
                onSearch={handleRailSearch}
                onOpenPanel={setSettingsPanel}
              />
            </motion.div>
          ) : (
          <motion.div
            key="full"
            className="absolute inset-0 flex h-full w-full flex-col"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={CONTENT_TRANSITION}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 px-3 pb-3 pt-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <SyamiLogo className="h-8 w-8 shrink-0" alt="Syami AI" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                  Syami AI Assistant
                </p>
                <p className="truncate text-xs text-muted-foreground">Version v{APP_VERSION}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-pressed={!collapsed}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon icon={collapsed ? PanelLeftOpen : PanelLeftClose} size={18} />
            </button>
          </div>

          <div className="relative shrink-0 px-3 pb-3">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 right-2 h-24 w-32 rounded-full bg-primary/15 blur-2xl" />
              <div className="absolute -bottom-8 -left-6 h-20 w-28 rounded-full bg-accent/15 blur-2xl" />
            </div>
            <div className="relative flex flex-col gap-2.5">
              <SearchChats
                ref={searchInputRef}
                query={query}
                onChange={setQuery}
                onClear={() => setQuery('')}
              />
              <NewChatButton onClick={newChat} disabled={isLoadingHistory} />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <p className="px-2 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Recent Conversations
            </p>
            <ConversationList
              conversations={sorted}
              activeConversationId={activeConversationId}
              pinnedIds={pinnedIds}
              onSelect={(id) => void selectConversation(id)}
              onRename={(id, title) => renameConversation(id, title)}
              onDelete={(id) => deleteConversation(id)}
              onPin={(id) => togglePin(id)}
            />
          </div>

          <div className="flex shrink-0 flex-col border-t border-border p-2">
            <SettingsMenu
              icon={<Icon icon={Settings} size={16} />}
              label="Settings"
              className="w-full gap-2.5 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onSelect={setSettingsPanel}
            />
            <button
              type="button"
              onClick={() => setSettingsPanel('profile')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
            >
              <Avatar name="Local User" size="md" status="online" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">Local User</span>
                <span className="block text-xs text-muted-foreground">This device</span>
              </span>
              <Icon icon={ChevronRight} size={14} className="text-muted-foreground" />
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {resizable && !collapsed && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          onPointerDown={handleResizeStart}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
          onPointerCancel={handleResizeEnd}
          className="absolute inset-y-0 -right-1 z-10 w-2 cursor-col-resize touch-none select-none"
        >
          <span className="absolute inset-y-1 right-0.5 w-0.5 rounded-full bg-primary/30 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
        </div>
      )}
      </motion.aside>

      <SettingsDialog panel={settingsPanel} onClose={() => setSettingsPanel(null)} />
    </>
  );
};