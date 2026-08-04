import { Info } from 'lucide-react';
import { Badge, Icon } from '@syami/ui';
import { APP_VERSION } from '@syami/shared';
import { SyamiLogo } from '@/components/common/SyamiLogo';

const TECH_STACK = ['React', 'Electron', 'Node.js', 'MongoDB', 'Ollama'];

export const AboutPanel = (): React.JSX.Element => (
  <div className="flex flex-col items-center gap-5 text-center">
    <div className="flex flex-col items-center gap-3">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/12 ring-1 ring-primary/25">
        <SyamiLogo className="h-12 w-12" alt="Syami AI" />
      </span>
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Syami AI</h3>
        <p className="mt-1 text-sm text-muted-foreground">Your Intelligent Desktop Assistant</p>
      </div>
      <Badge variant="primary">Version v{APP_VERSION}</Badge>
    </div>

    <p className="flex max-w-sm items-center justify-center gap-1.5 text-sm leading-relaxed text-muted-foreground">
      <Icon icon={Info} size={14} className="shrink-0 text-primary" />
      Designed and developed for modern desktop AI experiences.
    </p>

    <div className="w-full rounded-xl border border-border bg-muted-modal px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Designed &amp; Developed by
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">Kismat Dahal</p>
    </div>

    <div className="w-full">
      <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Technology
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {TECH_STACK.map((tech) => (
          <li key={tech}>
            <Badge variant="secondary">{tech}</Badge>
          </li>
        ))}
      </ul>
    </div>

    <p className="text-xs text-muted-foreground">© 2026 Syami AI</p>
  </div>
);
