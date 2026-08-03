import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn, Icon } from '@syami/ui';

interface CopyCodeButtonProps {
  text: string;
  className?: string;
}

export const CopyCodeButton = ({ text, className }: CopyCodeButtonProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        /* clipboard unavailable - silently ignore */
      });
  };

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={handleCopy}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface/80 text-muted-foreground',
        'opacity-0 shadow-sm transition-opacity duration-150 hover:text-foreground',
        'group-hover/code:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {copied ? <Icon icon={Check} size={14} className="text-success" /> : <Icon icon={Copy} size={14} />}
    </button>
  );
};