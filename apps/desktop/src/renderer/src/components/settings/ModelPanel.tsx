import { Bot, Cpu, Laptop, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge, Button, Icon } from '@syami/ui';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { platformName } from '@/lib/format';

const currentDevice = (): string => platformName(window.api?.platform ?? 'unknown');

export const ModelPanel = (): React.JSX.Element => {
  const { status, data } = useBackendHealth();
  const connected = status === 'online' && data?.ai?.status === 'connected';
  const currentModel = data?.ai?.model ?? 'qwen2.5:3b';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted-modal px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon icon={Cpu} size={18} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Active model</p>
            <p className="font-mono text-sm font-medium text-foreground">{currentModel}</p>
          </div>
        </div>
        <Badge variant={connected ? 'success' : 'warning'} dot>
          {connected ? 'Online' : 'Offline'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted-modal p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon={Bot} size={13} />
            Provider
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">Ollama</p>
        </div>
        <div className="rounded-lg border border-border bg-muted-modal p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon={Sparkles} size={13} />
            Inference
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">Local AI</p>
        </div>
        <div className="rounded-lg border border-border bg-muted-modal p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon={Laptop} size={13} />
            Current device
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{currentDevice()}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted-modal p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon={Cpu} size={13} />
            Current model
          </p>
          <p className="mt-1 truncate font-mono text-sm font-medium text-foreground">
            {currentModel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-lg bg-success-subtle px-4 py-3 text-xs font-medium text-success">
        <Icon icon={ShieldCheck} size={15} className="shrink-0" />
        <span>
          Powered locally. <span className="font-normal">No cloud processing.</span>
        </span>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted-modal px-4 py-3">
        <span className="text-sm text-muted-foreground">Switch model</span>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Coming Soon</Badge>
          <Button variant="secondary" size="sm" disabled>
            Change model
          </Button>
        </div>
      </div>
    </div>
  );
};
