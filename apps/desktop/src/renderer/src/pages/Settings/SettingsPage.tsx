import { useState } from 'react';
import { Monitor, Moon, Sun, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Divider,
  Dropdown,
  Icon,
  Input,
  Modal,
  useTheme,
} from '@syami/ui';
import type { DropdownItem } from '@syami/ui';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: <Icon icon={Sun} size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Icon icon={Moon} size={16} /> },
  { value: 'system', label: 'System', icon: <Icon icon={Monitor} size={16} /> },
] as const;

const SettingsPage = (): React.JSX.Element => {
  const { preference, resolved, setPreference } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  const dangerItems: DropdownItem[] = [
    {
      id: 'clear',
      label: 'Clear local data',
      description: 'Removes settings and cache',
      variant: 'danger',
      icon: <Icon icon={Trash2} size={16} />,
      separatorBefore: true,
      onClick: () => setModalOpen(true),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preferences are stored locally and persisted across sessions.
        </p>
      </header>

      <Divider />

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how Syami AI looks. Theme follows the system by default.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {THEME_OPTIONS.map((option) => {
              const active = preference === option.value;
              return (
                <Button
                  key={option.value}
                  variant={active ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setPreference(option.value)}
                >
                  {option.icon}
                  {option.label}
                </Button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Resolved theme: <Badge variant="accent">{resolved}</Badge> · stored under{' '}
            <code className="rounded bg-muted px-1 py-0.5">syami.theme</code>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Danger zone — these actions cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Your display name (saved locally)" disabled />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Reset everything on this device.</p>
            <Dropdown trigger={<Icon icon={Trash2} size={16} />} items={dangerItems} />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm">
            Save
          </Button>
        </CardFooter>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Clear local data?"
        description="This removes all locally stored preferences. Your conversation data lives on the server and is unaffected."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>
              Clear
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This <Badge variant="warning">cannot be undone</Badge>. Data will be cleared immediately.
        </p>
      </Modal>
    </div>
  );
};

export default SettingsPage;