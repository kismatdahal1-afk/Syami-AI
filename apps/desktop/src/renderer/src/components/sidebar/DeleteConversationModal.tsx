import { Trash2 } from 'lucide-react';
import { Button, Icon, Modal } from '@syami/ui';

interface DeleteConversationModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConversationModal = ({
  open,
  title,
  onCancel,
  onConfirm,
}: DeleteConversationModalProps): React.JSX.Element => (
  <Modal
    open={open}
    onClose={onCancel}
    title="Delete conversation"
    description="This permanently removes the conversation and its messages."
    size="sm"
    footer={
      <>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Delete
        </Button>
      </>
    }
  >
    <p className="text-sm text-foreground">
      Are you sure you want to delete{' '}
      <span className="font-medium text-foreground">&ldquo;{title}&rdquo;</span>?
    </p>
    <MessageIconNote />
  </Modal>
);

const MessageIconNote = (): React.JSX.Element => (
  <p className="mt-4 flex items-center gap-2 rounded-lg bg-error-subtle px-3 py-2 text-xs text-error">
    <Icon icon={Trash2} size={14} />
    This action cannot be undone.
  </p>
);