import { Plus } from 'lucide-react';
import { Button, Icon } from '@syami/ui';

interface NewChatButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const NewChatButton = ({ onClick, disabled }: NewChatButtonProps): React.JSX.Element => (
  <Button
    fullWidth
    variant="accent"
    className="rounded-xl"
    leftIcon={<Icon icon={Plus} size={16} />}
    onClick={onClick}
    disabled={disabled}
  >
    New chat
  </Button>
);
