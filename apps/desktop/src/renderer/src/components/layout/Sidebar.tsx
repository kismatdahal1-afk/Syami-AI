import { NavLink } from 'react-router-dom';
import { APP_VERSION } from '@syami/shared';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/chat', label: 'Chat' },
  { to: '/settings', label: 'Settings' },
] as const;

const Sidebar = (): React.JSX.Element => {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800">
      <div className="px-4 py-5">
        <p className="text-sm font-semibold">Syami AI</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">v{APP_VERSION}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent/10 font-medium text-accent'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-4 text-xs text-slate-400 dark:border-slate-800">
        Phase 1 · Foundation
      </div>
    </aside>
  );
};

export default Sidebar;
