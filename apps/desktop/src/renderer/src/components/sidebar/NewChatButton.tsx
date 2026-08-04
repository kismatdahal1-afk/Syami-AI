import { SquarePen } from 'lucide-react';
import { Button, cn, Icon } from '@syami/ui';

interface NewChatButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const NewChatButton = ({ onClick, disabled }: NewChatButtonProps): React.JSX.Element => (
  <Button
    fullWidth
    className={cn(
      'rounded-xl border border-white/50 bg-white/55 shadow-sm backdrop-blur-xl',
      'text-foreground transition-all duration-200',
      'hover:bg-white/75 hover:shadow-md active:bg-white/60',
      'dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15 dark:active:bg-white/5'
    )}
    leftIcon={<Icon icon={SquarePen} size={16} />}
    onClick={onClick}
    disabled={disabled}
  >
    New chat
  </Button>
);