import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Cpu, Info, Languages, LogOut, Palette } from 'lucide-react';
import { cn, Icon } from '@syami/ui';
import type { SettingsPanel } from './SettingsDialog';

interface SettingsMenuProps {
  icon: React.ReactNode;
  label?: string;
  className?: string;
  onSelect: (panel: SettingsPanel) => void;
}

const MENU_ITEMS: { id: SettingsPanel; label: string; icon: React.ReactNode; danger?: boolean }[] = [
  { id: 'appearance', label: 'Appearance', icon: <Icon icon={Palette} size={15} /> },
  { id: 'language', label: 'Language', icon: <Icon icon={Languages} size={15} /> },
  { id: 'model', label: 'Model', icon: <Icon icon={Cpu} size={15} /> },
  { id: 'about', label: 'About', icon: <Icon icon={Info} size={15} /> },
  { id: 'logout', label: 'Logout', icon: <Icon icon={LogOut} size={15} />, danger: true },
];

export const SettingsMenu = ({
  icon,
  label,
  className,
  onSelect,
}: SettingsMenuProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const rect = triggerRef.current?.getBoundingClientRect();
  const menuStyle = rect
    ? { bottom: `${window.innerHeight - rect.top + 8}px`, left: `${Math.max(8, rect.left)}px` }
    : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={label}
        className={cn('flex items-center rounded-lg transition-colors', className)}
      >
        {icon}
        {label && <span>{label}</span>}
      </button>

      {open &&
        rect &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={menuStyle}
            className="fixed z-[60] w-48 rounded-lg border border-border bg-surface p-1 shadow-elevated"
          >
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onSelect(item.id);
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  item.danger ? 'text-error hover:bg-error-subtle' : 'text-foreground hover:bg-muted',
                )}
              >
                <span className={item.danger ? '' : 'text-muted-foreground'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};