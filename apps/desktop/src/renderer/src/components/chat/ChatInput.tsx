import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Mic, Send, Square } from 'lucide-react';
import { Button, Icon } from '@syami/ui';
import { useChatStore } from '@/stores/chat.store';
import { cn } from '@syami/ui';

const MAX_HEIGHT = 160;

export interface ChatInputHandle {
  insertText: (text: string) => void;
}

interface ChatInputProps {
  /** When true, the input shows the animated gradient border (welcome screen only). */
  animated?: boolean;
  /** Rendering mode: floating bar at the bottom (chat) or inline in flow (welcome). */
  variant?: 'floating' | 'inline';
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(function ChatInput(
  { animated = false, variant = 'floating' },
  ref,
): React.JSX.Element {
  const isSending = useChatStore((state) => state.isSending);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const stopGenerating = useChatStore((state) => state.stopGenerating);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      setText((current) => (current.trim() ? `${current} ${text}` : text));
      window.requestAnimationFrame(() => {
        textareaRef.current?.focus();
        autoGrow();
      });
    },
  }));

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
    const message = trimmed;
    setText('');
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
    }
    await sendMessage(message);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-none w-full px-4',
        variant === 'floating'
          ? 'absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background/70 to-transparent pb-4 pt-20'
          : 'relative pb-2 pt-6'
      )}
    >
      <div className="pointer-events-auto relative mx-auto max-w-3xl rounded-2xl p-px shadow-lg shadow-black/5">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {animated ? (
            <div
              className="absolute inset-0 animate-[gradient-border-spin_8s_linear_infinite] will-change-transform"
              style={{
                background:
                  'conic-gradient(from 0deg, #1e3a8a 0%, #2563eb 5%, #00cfff 9%, #7dd3fc 10.5%, #ffffff 12.5%, #7dd3fc 14.5%, #00cfff 16%, #2563eb 20%, #16266b 28%, #1e3a8a 37.5%, #16266b 47%, #2563eb 55%, #00cfff 60%, #7dd3fc 61.5%, #ffffff 62.5%, #7dd3fc 63.5%, #00cfff 65%, #2563eb 70%, #16266b 78%, #0f1d42 87.5%, #16266b 94%, #1e3a8a 100%)',
              }}
            />
          ) : (
            <div className="absolute inset-0 rounded-2xl bg-border/50" />
          )}
        </div>
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-[15px] bg-background p-2 pl-4',
            'transition-all duration-200',
            'focus-within:shadow-glow-primary'
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

          <Button
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={<Icon icon={Mic} size={17} className="text-muted-foreground" />}
            aria-label="Voice input"
          />

          {isSending ? (
            <Button
              variant="primary"
              size="sm"
              iconOnly
              leftIcon={<Icon icon={Square} size={14} className="fill-current" />}
              className="rounded-xl bg-[#007FFF] text-white hover:bg-[#006FE6] active:bg-[#0060CC]"
              aria-label="Stop generating"
              onClick={stopGenerating}
            />
          ) : (
            <Button
              variant="primary"
              size="sm"
              iconOnly
              leftIcon={<Icon icon={Send} size={16} />}
              className="rounded-xl bg-[#007FFF] text-white hover:bg-[#006FE6] active:bg-[#0060CC]"
              disabled={!canSend}
              aria-label="Send message"
              onClick={handleSend}
            />
          )}
        </div>
      </div>
      {variant === 'floating' && (
        <p className="mx-auto mt-2 max-w-3xl px-1 text-center text-[11px] text-muted-foreground">
          Enter to send · Shift+Enter for a new line
        </p>
      )}
    </div>
  );
});
