import { useBackendHealth } from '@/hooks/useBackendHealth';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Divider,
  FadeIn,
  Input,
} from '@syami/ui';

const STATUS_LABELS: Record<string, string> = {
  checking: 'Checking backend...',
  online: 'Backend connected',
  offline: 'Backend unreachable',
};

const STATUS_TONE: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
  checking: 'info',
  online: 'success',
  offline: 'danger',
};

const HomePage = (): React.JSX.Element => {
  const { status, data } = useBackendHealth();

  return (
    <FadeIn className="flex h-full flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Syami AI design system is live. Chat Mode and Agent Mode ship in the next phases.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name="Syami AI" status="online" size="lg" />
          <Avatar name="AI Assistant" status="away" size="lg" />
        </div>
      </header>

      <Divider />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>System</CardTitle>
            <Badge variant={STATUS_TONE[status]} dot>
              {STATUS_LABELS[status]}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {data && (
              <p>
                {data.app} v{data.version} · uptime {Math.round(data.uptime)}s
              </p>
            )}
            {window.api && (
              <p>
                Electron {window.api.versions.electron} · Node {window.api.versions.node}
              </p>
            )}
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Design system</CardTitle>
            <CardDescription>@syami/ui ready to consume</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="neon">Neon</Badge>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col items-start gap-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground">Tokens in action</h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button size="sm">Default</Button>
          <Button size="sm" disabled>
            Disabled
          </Button>
          <Input placeholder="Type something..." className="w-64" />
        </div>
      </section>
    </FadeIn>
  );
};

export default HomePage;
