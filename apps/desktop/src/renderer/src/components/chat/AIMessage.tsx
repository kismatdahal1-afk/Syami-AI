import { useEffect, useRef, useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { Icon } from '@syami/ui';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useChatStore } from '@/stores/chat.store';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MessageContainer } from './MessageContainer';
import type { ChatMessage } from '@/types/chat';

interface AIMessageProps {
  message: ChatMessage;
  /** When true the reply is revealed with a typewriter animation. */
  streaming?: boolean;
  /** Fired once the typewriter reveal completes. */
  onStreamEnd?: () => void;
}

export const AIMessage = ({
  message,
  streaming = false,
  onStreamEnd,
}: AIMessageProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);
  const typed = useTypewriter(message.content, { enabled: streaming });
  const isRevealing = streaming && typed.length < message.content.length;
  const streamEndedRef = useRef(!streaming);
  const isSending = useChatStore((state) => state.isSending);
  const regenerate = useChatStore((state) => state.regenerate);

  useEffect(() => {
    if (streaming && !isRevealing && !streamEndedRef.current) {
      streamEndedRef.current = true;
      onStreamEnd?.();
    }
  }, [streaming, isRevealing, onStreamEnd]);

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        /* clipboard unavailable in dev/linux - silently ignore */
      });
  };

  return (
    <MessageContainer
      role="assistant"
      avatarName="Syami AI"
      name="Syami AI"
      time={message.createdAt}
      footer={
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isRevealing}
            title={copied ? 'Copied' : 'Copy'}
            aria-label={copied ? 'Copied' : 'Copy response'}
            onClick={handleCopy}
            className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            {copied ? (
              <Icon icon={Check} size={13} className="text-success" />
            ) : (
              <Icon icon={Copy} size={13} />
            )}
          </button>
          <button
            type="button"
            disabled={isRevealing || isSending}
            title="Try again"
            aria-label="Try again"
            onClick={() => void regenerate()}
            className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <Icon icon={RotateCcw} size={13} />
          </button>
        </div>
      }
    >
      {isRevealing ? (
        <p className="whitespace-pre-wrap break-words">
          {typed}
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-full bg-primary/70"
          />
        </p>
      ) : (
        <MarkdownRenderer content={message.content} />
      )}
    </MessageContainer>
  );
};