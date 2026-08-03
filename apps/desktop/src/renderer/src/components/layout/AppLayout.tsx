import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Monitor, Moon, Settings, Sun, Sparkles } from 'lucide-react';
import { APP_VERSION } from '@syami/shared';
import {
  AppHeader,
  AppLayout as Shell,
  AppSidebar,
  Badge,
  Divider,
  Dropdown,
  Icon,
  MainContent,
  PageTransition,
  useThemeStore,
} from '@syami/ui';
import type { DropdownItem, SidebarItem } from '@syami/ui';

const NAV_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: <Icon icon={Home} size={18} /> },
  { id: 'chat', label: 'Chat', icon: <Icon icon={MessageSquare} size={18} />, badge: 'Soon' },
  { id: 'settings', label: 'Settings', icon: <Icon icon={Settings} size={18} /> },
];

const AppLayout = (): React.JSX.Element => {
  const location = useLocation();
  const setPreference = useThemeStore((state) => state.setPreference);

  const themeItems: DropdownItem[] = [
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
    <Shell
      sidebar={
        <AppSidebar
          brand={{
            title: 'Syami AI',
            subtitle: `v${APP_VERSION}`,
            icon: <Icon icon={Sparkles} size={18} />,
          }}
          items={NAV_ITEMS}
          renderItem={(item) => (
            <NavLink
              key={item.id}
              to={item.id === 'home' ? '/' : `/${item.id}`}
              end={item.id === 'home'}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors'
                  : 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              }
            >
              {item.icon}
              <span className="flex-1 truncate text-left">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )}
          footer={
            <div className="flex flex-col gap-3">
              <Divider />
              <Badge variant="neon" className="w-fit">
                Design System
              </Badge>
            </div>
          }
        />
      }
      header={
        <AppHeader
          left={<span className="text-sm text-muted-foreground">Syami AI Desktop</span>}
          right={
            <Dropdown
              trigger={<Icon icon={Moon} size={18} />}
              items={themeItems}
              align="right"
            />
          }
        />
      }
    >
      <MainContent padded={false}>
        <PageTransition animationKey={location.pathname} className="h-full">
          <Outlet />
        </PageTransition>
      </MainContent>
    </Shell>
  );
};

export default AppLayout;
