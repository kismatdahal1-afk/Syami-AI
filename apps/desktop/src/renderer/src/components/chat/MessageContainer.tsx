import { Avatar, cn } from '@syami/ui';
import { formatMessageTime } from '@/lib/format';
import type { MessageRole } from '@/types/chat';

interface MessageContainerProps {
  role: MessageRole;
  avatarName: string;
  name?: string;
  time?: number;
  children: React.ReactNode;
  /** Optional action row rendered below the bubble (outside of it). */
  footer?: React.ReactNode;
  /** Stretches the message bubble to the full content width (e.g. inline edit). */
  fullWidth?: boolean;
  className?: string;
}

export const MessageContainer = ({
  role,
  avatarName,
  name,
  time,
  children,
  footer,
  fullWidth = false,
  className,
}: MessageContainerProps): React.JSX.Element => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex w-full gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <Avatar name={avatarName} size="md" className="mt-1 shrink-0" />}
      <div
        className={cn(
          'group/msg flex min-w-0 flex-col gap-0.5',
          fullWidth ? 'w-full max-w-full' : 'max-w-[80%]',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        {(name || time !== undefined) && (
          <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
            {name && <span className="font-display font-medium text-foreground">{name}</span>}
            {time !== undefined && <span>{formatMessageTime(time)}</span>}
          </p>
        )}
        <div
          className={cn(
            'min-w-0 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'rounded-br-md border border-primary/15 bg-primary/10 px-4 py-2.5 text-foreground shadow-sm dark:border-primary/30 dark:bg-primary/20'
              : 'rounded-bl-md border border-border bg-surface px-4 py-3 shadow-sm',
            className
          )}
        >
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
};