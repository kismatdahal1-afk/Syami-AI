import { LogOut } from 'lucide-react';
import { Badge, Button, Icon } from '@syami/ui';

export const LogoutPanel = (): React.JSX.Element => (
  <div className="flex flex-col items-center gap-4 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error-subtle ring-1 ring-error/20">
      <Icon icon={LogOut} size={24} className="text-error" />
    </span>
    <div>
      <p className="text-sm font-medium text-foreground">Sign out of Syami AI?</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Cloud sign-in and account logout are not available yet.
      </p>
    </div>
    <div className="flex flex-col items-center gap-2">
      <Badge variant="outline">Coming Soon</Badge>
      <Button variant="danger" size="sm" disabled className="w-40">
        Sign out
      </Button>
    </div>
  </div>
);
