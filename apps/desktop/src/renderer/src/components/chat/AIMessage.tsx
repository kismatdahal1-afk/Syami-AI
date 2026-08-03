import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button, Icon } from '@syami/ui';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MessageContainer } from './MessageContainer';
import type { ChatMessage } from '@/types/chat';

interface AIMessageProps {
  message: ChatMessage;
}

export const AIMessage = ({ message }: AIMessageProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);

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
      <MarkdownRenderer content={message.content} />
      <div className="mt-2 flex justify-end opacity-0 transition-opacity duration-150 group-hover/msg:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={copied ? 'Copied' : 'Copy response'}
          onClick={handleCopy}
        >
          {copied ? <Icon icon={Check} size={14} className="text-success" /> : <Icon icon={Copy} size={14} />}
        </Button>
      </div>
    </MessageContainer>
  );
};