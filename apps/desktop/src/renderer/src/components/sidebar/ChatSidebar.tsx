import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_VERSION } from '@syami/shared';
import { Avatar, Divider, Icon } from '@syami/ui';
import { SyamiLogo } from '@/components/common/SyamiLogo';
import { useChatStore } from '@/stores/chat.store';
import { ConversationList } from './ConversationList';
import { NewChatButton } from './NewChatButton';
import { SearchChats } from './SearchChats';

const SIDEBAR_WIDTH = 288;

const NAV_LINK_CLASSES = ({ isActive }: { isActive: boolean }): string =>
  [
    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-primary/10 font-medium text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  ].join(' ');

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const ChatSidebar = ({ collapsed, onToggle }: ChatSidebarProps): React.JSX.Element => {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const isLoadingHistory = useChatStore((state) => state.isLoadingHistory);
  const loadHistory = useChatStore((state) => state.loadHistory);
  const newChat = useChatStore((state) => state.newChat);
  const selectConversation = useChatStore((state) => state.selectConversation);
  const renameConversation = useChatStore((state) => state.renameConversation);
  const deleteConversation = useChatStore((state) => state.deleteConversation);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const [query, setQuery] = useState('');

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? conversations.filter(
        (conversation) =>
          conversation.title.toLowerCase().includes(normalized) ||
          conversation.messages.some((message) => message.content.toLowerCase().includes(normalized)),
      )
    : conversations;

  return (
    <motion.aside
      aria-label="Chat sidebar"
      className="flex h-full shrink-0 overflow-hidden border-r border-border bg-surface"
      initial={false}
      animate={{ width: collapsed ? 0 : SIDEBAR_WIDTH }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
    >
      <div className="flex h-full w-72 shrink-0 flex-col">
        <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-4">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={!collapsed}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon icon={collapsed ? PanelLeftOpen : PanelLeftClose} size={18} />
          </button>
          <div className="flex min-w-0 items-center gap-2.5">
            <SyamiLogo className="h-8 w-8 shrink-0" alt="Syami AI" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">Syami AI Assistant</p>
              <p className="text-xs text-muted-foreground">Version {APP_VERSION}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 px-3 pb-3">
          <SearchChats query={query} onChange={setQuery} onClear={() => setQuery('')} />
          <NewChatButton onClick={newChat} disabled={isLoadingHistory} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          <p className="px-2 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Conversations
          </p>
          <ConversationList
            conversations={filtered}
            activeConversationId={activeConversationId}
            onSelect={(id) => void selectConversation(id)}
            onRename={(id, title) => renameConversation(id, title)}
            onDelete={(id) => deleteConversation(id)}
          />
        </div>

        <div className="flex shrink-0 flex-col gap-1 border-t border-border p-3">
          <NavLink to="/settings" className={NAV_LINK_CLASSES}>
            <Icon icon={Settings} size={16} />
            Settings
          </NavLink>
          <Divider className="my-1.5" />
          <NavLink to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted">
            <Avatar name="Local User" size="md" status="online" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">Local User</span>
              <span className="block text-xs text-muted-foreground">This device</span>
            </span>
            <Icon icon={ChevronRight} size={14} className="text-muted-foreground" />
          </NavLink>
        </div>
      </div>
    </motion.aside>
  );
};