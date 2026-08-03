import { useBackendHealth } from '@/hooks/useBackendHealth';

const STATUS_LABELS: Record<string, string> = {
  checking: 'Checking backend...',
  online: 'Backend connected',
  offline: 'Backend unreachable',
};

const HomePage = (): React.JSX.Element => {
  const { status, data } = useBackendHealth();

  return (
    <section className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">Syami AI</h1>
      <p className="max-w-md text-center text-sm text-slate-500 dark:text-slate-400">
        Phase 1 foundation is ready. Chat Mode and Agent Mode will be built in the next phases.
      </p>

      <div className="flex w-72 flex-col gap-2 rounded-lg border border-border bg-surface p-4 text-sm shadow-sm">
        <p className="font-medium">System status</p>
        <p className="text-slate-500 dark:text-slate-400">{STATUS_LABELS[status]}</p>
        {data && (
          <p className="text-xs text-slate-400">
            {data.app} v{data.version} · uptime {Math.round(data.uptime)}s
          </p>
        )}
        {window.api && (
          <p className="text-xs text-slate-400">
            Electron {window.api.versions.electron} · Node {window.api.versions.node}
          </p>
        )}
      </div>
    </section>
  );
};

export default HomePage;
