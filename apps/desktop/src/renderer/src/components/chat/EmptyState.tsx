import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from '@syami/ui';
import { EXAMPLE_PROMPTS } from '@/data/mockChat';

interface EmptyStateProps {
  onPrompt: (prompt: string) => void;
}

export const EmptyState = ({ onPrompt }: EmptyStateProps): React.JSX.Element => {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-6"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
          <Icon icon={Sparkles} size={26} />
        </span>

        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How can I help you today?</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Ask anything — Syami AI answers in English and Nepali. Start with an example below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
            >
              <Button variant="secondary" size="sm" rightIcon={<Icon icon={ArrowRight} size={14} />} onClick={() => onPrompt(prompt.prompt)}>
                {prompt.label}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + index * 0.1, ease: 'easeOut' }}
            >
              <Card hoverable className="h-full cursor-pointer" onClick={() => onPrompt(prompt.prompt)}>
                <CardHeader>
                  <CardTitle className="text-sm">{prompt.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{prompt.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};