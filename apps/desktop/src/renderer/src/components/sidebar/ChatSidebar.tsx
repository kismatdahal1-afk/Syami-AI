import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Home, Settings, Sparkles } from 'lucide-react';
import { APP_VERSION } from '@syami/shared';
import { Avatar, Divider, Icon } from '@syami/ui';
import { useChatStore } from '@/stores/chat.store';
import { ConversationList } from './ConversationList';
import { NewChatButton } from './NewChatButton';
import { SearchChats } from './SearchChats';

const NAV_LINK_CLASSES = ({ isActive }: { isActive: boolean }): string =>
  [
    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-primary/10 font-medium text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
  ].join(' ');

export const ChatSidebar = (): React.JSX.Element => {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const newChat = useChatStore((state) => state.newChat);
  const selectConversation = useChatStore((state) => state.selectConversation);

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
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-3 px-5 pb-4 pt-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
          <Icon icon={Sparkles} size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-foreground">Syami</p>
          <p className="text-xs text-muted-foreground">AI Assistant · v{APP_VERSION}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        <NewChatButton onClick={newChat} />
        <SearchChats query={query} onChange={setQuery} onClear={() => setQuery('')} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Conversations
        </p>
        <ConversationList
          conversations={filtered}
          activeConversationId={activeConversationId}
          onSelect={selectConversation}
        />
      </div>

      <div className="flex flex-col gap-1 border-t border-border p-3">
        <NavLink to="/home" className={NAV_LINK_CLASSES}>
          <Icon icon={Home} size={16} />
          Home
        </NavLink>
        <NavLink to="/settings" className={NAV_LINK_CLASSES}>
          <Icon icon={Settings} size={16} />
          Settings
        </NavLink>
        <Divider className="my-2" />
        <NavLink to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted">
          <Avatar name="Local User" size="md" status="online" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">Local User</span>
            <span className="block text-xs text-muted-foreground">This device</span>
          </span>
          <Icon icon={ChevronRight} size={14} className="text-muted-foreground" />
        </NavLink>
      </div>
    </aside>
  );
};