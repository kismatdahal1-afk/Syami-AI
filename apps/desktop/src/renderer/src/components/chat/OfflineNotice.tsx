import { AlertTriangle } from 'lucide-react';
import { Icon } from '@syami/ui';

interface OfflineNoticeProps {
  message?: string;
}

export const OfflineNotice = ({ message }: OfflineNoticeProps): React.JSX.Element => (
  <div className="flex items-center gap-2 border-b border-warning/25 bg-warning-subtle px-4 py-2 text-sm text-warning">
    <Icon icon={AlertTriangle} size={15} />
    <span className="min-w-0 truncate">
      {message ?? 'Database unavailable — chat is currently offline.'}
    </span>
  </div>
);