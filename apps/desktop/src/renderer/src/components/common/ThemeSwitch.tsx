import { Monitor, Moon, Sun } from 'lucide-react';
import { Dropdown, Icon, useTheme } from '@syami/ui';
import type { DropdownItem } from '@syami/ui';

interface ThemeSwitchProps {
  align?: 'left' | 'right';
}

export const ThemeSwitch = ({ align = 'right' }: ThemeSwitchProps): React.JSX.Element => {
  const { resolved, setPreference } = useTheme();

  const items: DropdownItem[] = [
    {
      id: 'light',
      label: 'Light',
      icon: <Icon icon={Sun} size={16} />,
      onClick: () => setPreference('light'),
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: <Icon icon={Moon} size={16} />,
      onClick: () => setPreference('dark'),
    },
    {
      id: 'system',
      label: 'System',
      icon: <Icon icon={Monitor} size={16} />,
      separatorBefore: true,
      onClick: () => setPreference('system'),
    },
  ];

  return (
    <Dropdown
      trigger={<Icon icon={resolved === 'dark' ? Moon : Sun} size={18} />}
      items={items}
      align={align}
    />
  );
};
