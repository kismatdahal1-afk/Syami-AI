import { Avatar, cn } from '@syami/ui';
import { formatMessageTime } from '@/lib/format';
import type { MessageRole } from '@/types/chat';

interface MessageContainerProps {
  role: MessageRole;
  avatarName: string;
  name?: string;
  time?: number;
  children: React.ReactNode;
  className?: string;
}

export const MessageContainer = ({
  role,
  avatarName,
  name,
  time,
  children,
  className,
}: MessageContainerProps): React.JSX.Element => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex w-full gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <Avatar name={avatarName} size="md" className="mt-1 shrink-0" />}
      <div className={cn('flex max-w-[82%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        {(name || time !== undefined) && (
          <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
            {name && <span className="font-medium text-foreground">{name}</span>}
            {time !== undefined && <span>{formatMessageTime(time)}</span>}
          </p>
        )}
        <div
          className={cn(
            'group/msg rounded-2xl text-sm',
            isUser
              ? 'rounded-br-md border border-primary/15 bg-primary/10 px-4 py-2.5 text-foreground'
              : 'rounded-bl-md border border-border bg-surface px-4 py-3',
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};