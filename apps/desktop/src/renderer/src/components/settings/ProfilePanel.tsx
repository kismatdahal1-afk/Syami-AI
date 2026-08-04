import { CloudOff, Globe, Laptop, MessagesSquare, MessageSquare, Monitor, Palette } from 'lucide-react';
import { Avatar, Badge, Icon, useTheme } from '@syami/ui';
import { useChatStore } from '@/stores/chat.store';
import { useSettingsStore } from '@/stores/settings.store';
import type { AppLanguage } from '@/stores/settings.types';
import { computerName, platformName } from '@/lib/format';

const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  ne: 'Nepali',
  auto: 'Auto Detect',
};

export const ProfilePanel = (): React.JSX.Element => {
  const conversations = useChatStore((state) => state.conversations);
  const { settings } = useSettingsStore();
  const { preference, resolved } = useTheme();

  const chatCount = conversations.length;
  const messageCount = conversations.reduce((total, conversation) => total + conversation.messages.length, 0);

  const stats = [
    { label: 'Chats', value: chatCount, icon: MessageSquare },
    { label: 'Messages', value: messageCount, icon: MessagesSquare },
  ];

  const details = [
    { label: 'Computer name', value: computerName(), icon: Laptop },
    { label: 'Operating system', value: platformName(window.api?.platform ?? 'unknown'), icon: Monitor },
    { label: 'Preferred language', value: LANGUAGE_LABELS[settings.language], icon: Globe },
    { label: 'Current theme', value: preference === 'system' ? `System (${resolved})` : preference, icon: Palette },
  ];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2.5">
        <span className="rounded-full bg-gradient-to-br from-primary via-accent to-primary p-[2px] shadow-glow-primary">
          <Avatar name="Local User" size="xl" className="h-16 w-16 text-2xl font-semibold" status="online" />
        </span>
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-base font-semibold text-foreground">Local User</p>
          <p className="text-sm text-muted-foreground">user@syami.local</p>
          <Badge variant="success" dot size="sm" className="mt-1">
            Local profile
          </Badge>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-muted-modal px-4 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon icon={stat.icon} size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-semibold leading-none tabular-nums text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-border" role="separator" />

      <div className="w-full space-y-2">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted-modal px-4 py-2.5"
          >
            <Icon icon={detail.icon} size={15} className="shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 text-sm text-muted-foreground">{detail.label}</span>
            <span className="truncate text-right text-sm font-medium text-foreground">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex w-full items-center gap-2.5 rounded-lg border border-dashed border-border bg-muted-modal px-4 py-3">
        <Icon icon={CloudOff} size={15} className="shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 text-xs text-muted-foreground">
          Future Cloud Sync
          <Badge variant="outline" size="sm" className="ml-1.5 align-middle">
            Coming Soon
          </Badge>
        </span>
      </div>
    </div>
  );
};