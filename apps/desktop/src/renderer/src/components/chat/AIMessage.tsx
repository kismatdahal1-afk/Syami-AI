import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button, Icon } from '@syami/ui';
import { useTypewriter } from '@/hooks/useTypewriter';
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
    <MessageContainer role="assistant" avatarName="Syami AI" name="Syami AI" time={message.createdAt}>
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
      <div className="mt-2 flex justify-end opacity-0 transition-opacity duration-150 group-hover/msg:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          disabled={isRevealing}
          aria-label={copied ? 'Copied' : 'Copy response'}
          onClick={handleCopy}
        >
          {copied ? <Icon icon={Check} size={14} className="text-success" /> : <Icon icon={Copy} size={14} />}
        </Button>
      </div>
    </MessageContainer>
  );
};