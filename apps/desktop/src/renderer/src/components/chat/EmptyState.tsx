import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { SyamiLogo } from '@/components/common/SyamiLogo';

interface EmptyStateProps {
  onInsert: (prompt: string) => void;
}

interface WelcomePrompt {
  id: string;
  label: string;
  prompt: string;
}

const WELCOME_PROMPTS: WelcomePrompt[] = [
  { id: 'explain', label: 'Explain a concept', prompt: 'Explain a concept in simple terms.' },
  { id: 'summarize', label: 'Summarize text', prompt: 'Summarize this text: [paste text here]' },
  { id: 'code', label: 'Write code', prompt: 'Write code to solve the following problem: [describe problem]' },
  { id: 'brainstorm', label: 'Brainstorm ideas', prompt: 'Brainstorm creative ideas for [topic].' },
  { id: 'translate', label: 'Translate English ↔ Nepali', prompt: 'Translate this into Nepali: [text here]' },
  { id: 'fix-code', label: 'Fix my code', prompt: 'Fix the bug in this code: [paste code here]' },
  { id: 'generate', label: 'Generate ideas', prompt: 'Generate ideas for [topic].' },
];

export const EmptyState = ({ onInsert }: EmptyStateProps): React.JSX.Element => {
  const phase = useMotionValue(-1);
  const logoRotate = useTransform(phase, (value) => value * 75);
  const logoScale = useTransform(phase, (value) => 1.065 + 0.115 * value);
  const glowOpacity = useTransform(phase, (value) => 0.6 + 0.4 * ((value + 1) / 2));

  useEffect(() => {
    const controls = animate(phase, [-1, 1, -1], {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut',
    });
    return () => controls.stop();
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/15 via-primary/8 to-background/40 dark:from-accent/20 dark:via-primary/12"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative flex w-full max-w-2xl flex-col items-center gap-7">
        <motion.div
          className="cursor-pointer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            style={{ rotate: logoRotate, scale: logoScale }}
            whileHover={{ scale: 1.3 }}
            className="relative"
          >
            <motion.span
              aria-hidden="true"
              style={{ opacity: glowOpacity }}
              className="absolute inset-0 rounded-full bg-accent/70 blur-2xl"
            />
            <motion.span
              aria-hidden="true"
              style={{ opacity: glowOpacity }}
              className="absolute inset-0 rounded-full bg-accent/35 blur-md"
            />
            <SyamiLogo className="relative h-24 w-24 rounded-none" alt="Syami AI" />
          </motion.div>
        </motion.div>

        <h2 className="font-display text-2xl font-bold uppercase tracking-[0.3em] text-foreground sm:text-3xl">
          SYAMI-<span className="text-accent">AI</span>
        </h2>

        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            How can I help you today?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Your intelligent desktop companion.
            <br />
            Ask in English or Nepali.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {WELCOME_PROMPTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.04, ease: 'easeOut' }}
            >
              <button
                type="button"
                onClick={() => onInsert(item.prompt)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors duration-200 hover:border-accent/60 hover:bg-accent-subtle/40 hover:text-accent hover:shadow-glow-accent"
              >
                {item.label}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
