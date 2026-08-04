import { AnimatePresence, motion } from 'framer-motion';
import { Check, Monitor, Moon, Palette, Sun } from 'lucide-react';
import { Badge, cn, Icon, useTheme, type ThemePreference } from '@syami/ui';

const THEME_OPTIONS: { value: ThemePreference; icon: React.ReactNode; label: string; hint: string }[] = [
  { value: 'light', icon: <Icon icon={Sun} size={20} />, label: 'Light', hint: 'Bright & clean' },
  { value: 'dark', icon: <Icon icon={Moon} size={20} />, label: 'Dark', hint: 'Easy on the eyes' },
  { value: 'system', icon: <Icon icon={Monitor} size={20} />, label: 'System', hint: 'Follows device' },
];

export const AppearancePanel = (): React.JSX.Element => {
  const { preference, resolved, setPreference } = useTheme();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map((option) => {
          const selected = preference === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setPreference(option.value)}
              aria-pressed={selected}
              aria-label={`${option.label} theme`}
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200',
                selected
                  ? 'border-primary/60 bg-primary/10 shadow-glow-primary'
                  : 'border-border bg-muted-modal hover:border-primary/40 hover:bg-primary/10',
              )}
            >
              <AnimatePresence>
                {selected && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  selected ? 'bg-primary text-primary-foreground' : 'bg-surface-modal text-muted-foreground',
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

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted-modal px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon icon={Palette} size={14} />
          Current theme
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={resolved}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <Badge variant="accent">{resolved === 'dark' ? 'Dark' : 'Light'}</Badge>
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
