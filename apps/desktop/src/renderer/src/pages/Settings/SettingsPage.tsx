import { Bot, Info, Languages, Monitor, Moon, Palette, Sparkles, Sun } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Divider,
  Icon,
  useTheme,
} from '@syami/ui';
import { APP_VERSION } from '@syami/shared';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { useSettingsStore } from '@/stores/settings.store';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: <Icon icon={Sun} size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Icon icon={Moon} size={16} /> },
  { value: 'system', label: 'System', icon: <Icon icon={Monitor} size={16} /> },
] as const;

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', hint: 'Default' },
  { value: 'ne', label: 'नेपाली', hint: 'Nepali' },
] as const;

const FUTURE_FEATURES = [
  'Floating desktop assistant',
  'Voice input & text-to-speech',
  'Vision & image understanding',
  'Agent mode with tool use',
  'Desktop automation',
];

const SettingsPage = (): React.JSX.Element => {
  const { preference, resolved, setPreference } = useTheme();
  const { settings, updateSettings } = useSettingsStore();
  const { data } = useBackendHealth();

  const currentModel = data?.ai?.model ?? 'qwen2.5:3b';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preferences are stored locally.
        </p>
      </header>

      <Divider />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Palette} size={18} />
            Appearance
          </CardTitle>
          <CardDescription>Theme follows the system by default.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {THEME_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={preference === option.value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPreference(option.value)}
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Resolved: <Badge variant="accent">{resolved}</Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Languages} size={18} />
            Language
          </CardTitle>
          <CardDescription>Syami AI responds in English and Nepali.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {LANGUAGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={settings.language === option.value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => updateSettings({ language: option.value })}
              >
                {option.label}
                {option.hint && <span className="text-xs opacity-80">({option.hint})</span>}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Bot} size={18} />
            AI Model
          </CardTitle>
          <CardDescription>Read-only — the active model is reported by the backend.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="font-mono">
              {currentModel}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {data?.ai?.status === 'disconnected' || data?.ai?.status === undefined
                ? 'Ollama is currently disconnected.'
                : 'Running locally via Ollama.'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon={Info} size={18} />
            About
          </CardTitle>
          <CardDescription>Your Intelligent Desktop Assistant.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">App</dt>
                <dd className="flex items-center gap-2 font-medium text-foreground">
                  <Icon icon={Sparkles} size={14} className="text-primary" />
                  Syami AI
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-medium text-foreground">v{APP_VERSION}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Creator</dt>
                <dd className="font-medium text-foreground">Kismat Dahal</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium text-foreground">Online</dd>
              </div>
            </dl>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Coming next
              </p>
              <ul className="flex flex-wrap gap-2">
                {FUTURE_FEATURES.map((feature) => (
                  <li key={feature}>
                    <Badge variant="secondary">{feature}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;