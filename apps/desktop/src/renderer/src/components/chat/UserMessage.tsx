import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Pencil } from 'lucide-react';
import { cn, Icon } from '@syami/ui';
import { useChatStore } from '@/stores/chat.store';
import { MessageContainer } from './MessageContainer';
import type { ChatMessage } from '@/types/chat';

interface UserMessageProps {
  message: ChatMessage;
}

export const UserMessage = ({ message }: UserMessageProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const isSending = useChatStore((state) => state.isSending);
  const editMessage = useChatStore((state) => state.editMessage);

  useEffect(() => {
    const el = editTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [draft, editing]);

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        /* clipboard unavailable - silently ignore */
      });
  };

  const handleEditStart = (): void => {
    setDraft(message.content);
    setEditing(true);
  };

  const handleEditCancel = (): void => {
    setEditing(false);
  };

  const handleEditSend = (): void => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setEditing(false);
    void editMessage(message.id, trimmed);
  };

  return (
    <MessageContainer
      role="user"
      avatarName="You"
      time={message.createdAt}
      fullWidth={editing}
      className={editing ? 'w-full' : undefined}
      footer={
        <div
          className={cn(
            'flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/msg:opacity-100',
            editing && 'opacity-100',
          )}
        >
          <button
            type="button"
            title={copied ? 'Copied' : 'Copy'}
            aria-label={copied ? 'Copied' : 'Copy message'}
            onClick={handleCopy}
            className="p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? (
              <Icon icon={Check} size={13} className="text-success" />
            ) : (
              <Icon icon={Copy} size={13} />
            )}
          </button>
          <button
            type="button"
            title="Edit"
            aria-label="Edit message"
            disabled={isSending}
            onClick={handleEditStart}
            className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <Icon icon={Pencil} size={13} />
          </button>
        </div>
      }
    >
      {editing ? (
        <div className="flex w-full flex-col gap-2">
          <textarea
            ref={editTextareaRef}
            autoFocus
            value={draft}
            rows={2}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={(event) => {
              const el = event.currentTarget;
              const length = el.value.length;
              el.setSelectionRange(length, length);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleEditSend();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                handleEditCancel();
              }
            }}
            aria-label="Edit message"
            style={{ maxHeight: '200px', overflowY: 'auto' }}
            className="w-full resize-none bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isSending}
              onClick={handleEditCancel}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSending || !draft.trim()}
              onClick={handleEditSend}
              className="rounded-lg bg-[#007FFF] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#006FE6] disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      )}
    </MessageContainer>
  );
};