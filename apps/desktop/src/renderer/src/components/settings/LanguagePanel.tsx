import { AnimatePresence, motion } from 'framer-motion';
import { Check, Globe, Languages, Zap } from 'lucide-react';
import { Badge, cn, Icon } from '@syami/ui';
import { useSettingsStore } from '@/stores/settings.store';
import type { AppLanguage } from '@/stores/settings.types';

const LANGUAGE_OPTIONS: { value: AppLanguage; icon: React.ReactNode; name: string; hint: string }[] = [
  { value: 'en', icon: <Icon icon={Globe} size={20} />, name: 'English', hint: 'Global default' },
  { value: 'ne', icon: <Icon icon={Globe} size={20} />, name: 'Nepali', hint: 'Local language' },
  { value: 'auto', icon: <Icon icon={Zap} size={20} />, name: 'Auto Detect', hint: 'Let Syami decide' },
];

const languageLabel = (language: AppLanguage): string =>
  LANGUAGE_OPTIONS.find((option) => option.value === language)?.name ?? 'Auto Detect';

export const LanguagePanel = (): React.JSX.Element => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-5">
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
                'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200',
                selected
                  ? 'border-primary/60 bg-primary/10 shadow-glow-primary'
                  : 'border-border bg-muted-modal hover:border-primary/40 hover:bg-primary/10',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                  selected ? 'bg-primary text-primary-foreground' : 'bg-surface-modal text-muted-foreground',
                )}
              >
                {option.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">{option.name}</span>
                <span className="block text-xs text-muted-foreground">{option.hint}</span>
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                )}
              >
                {selected && <Check size={12} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted-modal px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon icon={Globe} size={14} />
          Current language
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={settings.language}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <Badge variant="accent">{languageLabel(settings.language)}</Badge>
          </motion.span>
        </AnimatePresence>
      </div>

      <p className="flex items-center gap-2 rounded-lg border border-info/25 bg-info-subtle px-4 py-3 text-xs leading-relaxed text-info">
        <Icon icon={Languages} size={14} className="shrink-0" />
        More languages coming soon.
      </p>
    </div>
  );
};
