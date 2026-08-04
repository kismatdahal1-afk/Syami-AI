import { Bot, Check, Cpu, LogOut, Monitor, Moon, Sparkles, Sun } from 'lucide-react';
import { APP_VERSION } from '@syami/shared';
import { Avatar, Badge, Button, cn, Icon, Modal, useTheme } from '@syami/ui';
import { SyamiLogo } from '@/components/common/SyamiLogo';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { useSettingsStore } from '@/stores/settings.store';

export type SettingsPanel = 'appearance' | 'language' | 'model' | 'about' | 'profile' | 'logout';

interface SettingsDialogProps {
  panel: SettingsPanel | null;
  onClose: () => void;
}

const TITLES: Record<SettingsPanel, string> = {
  appearance: 'Appearance',
  language: 'Language',
  model: 'Model',
  about: 'About Syami AI',
  profile: 'Profile',
  logout: 'Logout',
};

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', hint: 'Bright & clean', icon: <Icon icon={Sun} size={18} /> },
  { value: 'dark', label: 'Dark', hint: 'Easy on the eyes', icon: <Icon icon={Moon} size={18} /> },
  { value: 'system', label: 'System', hint: 'Follows device', icon: <Icon icon={Monitor} size={18} /> },
] as const;

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', native: 'EN', hint: 'Global default', name: 'English' },
  { value: 'ne', label: 'Nepali', native: 'ने', hint: 'Local language', name: 'नेपाली' },
] as const;

const FUTURE_FEATURES = [
  'Floating desktop assistant',
  'Voice input & text-to-speech',
  'Vision & image understanding',
  'Agent mode with tool use',
  'Desktop automation',
];

const AppearancePanel = (): React.JSX.Element => {
  const { preference, resolved, setPreference } = useTheme();
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Choose how Syami AI looks on your device. Changes apply instantly.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map((option) => {
          const selected = preference === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setPreference(option.value)}
              aria-pressed={selected}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-150',
                selected
                  ? 'border-primary/60 bg-primary/10 shadow-glow-primary'
                  : 'border-border bg-muted/40 hover:border-primary/40 hover:bg-muted',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface text-muted-foreground',
                )}
              >
                {option.icon}
              </span>
              <span className="text-sm font-medium text-foreground">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.hint}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
        <span className="text-sm text-muted-foreground">Current theme</span>
        <Badge variant="accent">{resolved === 'dark' ? 'Dark' : 'Light'}</Badge>
      </div>
    </div>
  );
};

const LanguagePanel = (): React.JSX.Element => {
  const { settings, updateSettings } = useSettingsStore();
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Set the preferred language. Syami AI responds in English and Nepali.
      </p>
      <div className="space-y-2">
        {LANGUAGE_OPTIONS.map((option) => {
          const selected = settings.language === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateSettings({ language: option.value })}
              aria-pressed={selected}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150',
                selected
                  ? 'border-primary/60 bg-primary/10'
                  : 'border-border bg-muted/40 hover:bg-muted',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold',
                  selected ? 'bg-primary text-primary-foreground' : 'bg-surface text-primary',
                )}
              >
                {option.native}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">
                  {option.name}
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    · {option.label}
                  </span>
                </span>
                <span className="block text-xs text-muted-foreground">{option.hint}</span>
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                )}
              >
                {selected && <Icon icon={Check} size={12} />}
              </span>
            </button>
          );
        })}
      </div>
      <p className="rounded-lg border border-info/25 bg-info-subtle px-4 py-3 text-xs leading-relaxed text-info">
        Syami AI understands both languages automatically. Your preference is stored locally on
        this device.
      </p>
    </div>
  );
};

const ModelPanel = (): React.JSX.Element => {
  const { data } = useBackendHealth();
  const connected = data?.ai?.status === 'connected';
  const currentModel = data?.ai?.model ?? 'qwen2.5:3b';
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon icon={Cpu} size={18} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Active model</p>
            <p className="font-mono text-sm font-medium text-foreground">{currentModel}</p>
          </div>
        </div>
        <Badge variant="primary">Qwen</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon={Bot} size={13} />
            Provider
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">Ollama · local</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon icon={Sparkles} size={13} />
            Engine
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">On-device inference</p>
        </div>
      </div>
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-lg px-4 py-3 text-xs font-medium',
          connected ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning',
        )}
      >
        <span className={cn('h-2 w-2 shrink-0 rounded-full', connected ? 'bg-success' : 'bg-warning')} />
        {connected
          ? 'Model is running locally and ready to respond.'
          : 'Ollama is currently disconnected. Start it to enable responses.'}
      </div>
    </div>
  );
};

const AboutPanel = (): React.JSX.Element => (
  <div className="flex flex-col items-center gap-5 text-center">
    <div className="flex flex-col items-center gap-2.5">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/25">
        <SyamiLogo className="h-8 w-8" alt="Syami AI" />
      </span>
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Syami AI</h3>
        <p className="text-sm text-muted-foreground">Your intelligent desktop assistant</p>
      </div>
    </div>
    <dl className="w-full max-w-sm space-y-2.5 text-sm">
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-2.5">
        <dt className="text-muted-foreground">Version</dt>
        <dd className="font-medium text-foreground">v{APP_VERSION}</dd>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-2.5">
        <dt className="text-muted-foreground">Creator</dt>
        <dd className="font-medium text-foreground">Kismat Dahal</dd>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-2.5">
        <dt className="text-muted-foreground">Status</dt>
        <dd className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-success" />
          Online
        </dd>
      </div>
    </dl>
    <div className="w-full">
      <p className="mb-2 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon icon={Sparkles} size={13} />
        Coming next
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {FUTURE_FEATURES.map((feature) => (
          <li key={feature}>
            <Badge variant="secondary">{feature}</Badge>
          </li>
        ))}
      </ul>
    </div>
    <p className="text-xs text-muted-foreground">© 2026 Syami AI · All rights reserved</p>
  </div>
);

const ProfilePanel = (): React.JSX.Element => (
  <div className="flex flex-col items-center gap-4">
    <Avatar name="Local User" size="xl" status="online" />
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-base font-semibold text-foreground">Local User</p>
      <p className="text-sm text-muted-foreground">user@syami.local</p>
      <Badge variant="success" dot>
        Active
      </Badge>
    </div>
    <div className="h-px w-full bg-border" role="separator" />
    <dl className="w-full space-y-2.5 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Device</dt>
        <dd className="font-medium text-foreground">This device</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Mode</dt>
        <dd className="font-medium text-foreground">Local · offline-first</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Account</dt>
        <dd className="font-medium text-foreground">Not signed in</dd>
      </div>
    </dl>
  </div>
);

const LogoutPanel = (): React.JSX.Element => (
  <div className="flex flex-col items-center gap-4 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error-subtle ring-1 ring-error/20">
      <Icon icon={LogOut} size={24} className="text-error" />
    </span>
    <div>
      <p className="text-sm font-medium text-foreground">Sign out of Syami AI?</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        You're currently using a local profile — nothing is synced to the cloud. Cloud sign-in and
        account logout will be available in a future update.
      </p>
    </div>
    <Button variant="danger" size="sm" disabled className="w-full">
      Sign out
    </Button>
  </div>
);

export const SettingsDialog = ({ panel, onClose }: SettingsDialogProps): React.JSX.Element => {
  const open = panel !== null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={panel ? TITLES[panel] : undefined}
      size="md"
      className="flex h-[33.6rem] w-[38rem] flex-col"
      contentClassName="flex flex-1 flex-col justify-center"
    >
      {panel === 'appearance' && <AppearancePanel />}
      {panel === 'language' && <LanguagePanel />}
      {panel === 'model' && <ModelPanel />}
      {panel === 'about' && <AboutPanel />}
      {panel === 'profile' && <ProfilePanel />}
      {panel === 'logout' && <LogoutPanel />}
    </Modal>
  );
};