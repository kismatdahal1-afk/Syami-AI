import { Bot, Languages, Monitor, Moon, Palette, Sun } from 'lucide-react';
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

const MODEL_OPTIONS = ['qwen2.5:7b', 'qwen2.5:3b', 'qwen2.5:14b'] as const;

const SettingsPage = (): React.JSX.Element => {
  const { preference, resolved, setPreference } = useTheme();
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preferences are stored locally. Backend persistence arrives with the API phase.
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
          <CardDescription>Placeholder — the model list is served by the backend in the AI phase.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {MODEL_OPTIONS.map((model) => (
              <Button
                key={model}
                variant={settings.preferredModel === model ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => updateSettings({ preferredModel: model })}
              >
                {model}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Selected: <Badge variant="primary">{settings.preferredModel ?? 'none'}</Badge>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;