import { useRef, useState } from 'react';
import { Mic, Paperclip, Send } from 'lucide-react';
import { Button, Icon, Tooltip } from '@syami/ui';
import { useActiveConversation, useChatStore } from '@/stores/chat.store';
import { cn } from '@syami/ui';

const MAX_HEIGHT = 160;

export const ChatInput = (): React.JSX.Element => {
  const active = useActiveConversation();
  const isSending = useChatStore((state) => state.isSending);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const newChat = useChatStore((state) => state.newChat);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !isSending;

  const autoGrow = (): void => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  };

  const handleSend = async (): Promise<void> => {
    if (!canSend) return;
    if (!active) newChat();
    const sent = await sendMessage(trimmed);
    if (sent) {
      setText('');
      const el = textareaRef.current;
      if (el) {
        el.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-surface px-4 py-3">
      <div
        className={cn(
          'mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-input bg-background p-2 pl-4',
          'transition-all duration-200',
          'focus-within:border-primary/60 focus-within:shadow-glow-primary'
        )}
      >
        <textarea
          ref={textareaRef}
          value={text}
          rows={1}
          placeholder={isSending ? 'Syami AI is answering… you can keep typing' : 'Ask Syami AI anything…'}
          onChange={(event) => {
            setText(event.target.value);
            autoGrow();
          }}
          onKeyDown={handleKeyDown}
          aria-busy={isSending}
          className="max-h-40 min-w-0 flex-1 resize-none bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          style={{ height: 'auto' }}
        />

        <Tooltip content="Attach files" position="top">
          <Button variant="ghost" size="sm" iconOnly aria-label="Attach files (coming soon)">
            <Icon icon={Paperclip} size={17} className="text-muted-foreground" />
          </Button>
        </Tooltip>

        <Tooltip content="Voice input" position="top">
          <Button variant="ghost" size="sm" iconOnly aria-label="Voice input (coming soon)">
            <Icon icon={Mic} size={17} className="text-muted-foreground" />
          </Button>
        </Tooltip>

        <Button
          variant="primary"
          size="sm"
          iconOnly
          className="rounded-xl"
          loading={isSending}
          disabled={!canSend}
          aria-label="Send message"
          onClick={handleSend}
        >
          {!isSending && <Icon icon={Send} size={16} />}
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl px-1 text-center text-[11px] text-muted-foreground">
        Enter to send · Shift+Enter for a new line
      </p>
    </div>
  );
};
