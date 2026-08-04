import { useEffect, useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { SyamiLogo } from '@/components/common/SyamiLogo';
import { CyberBackground } from '@/components/welcome/CyberBackground';
import { QuickPrompts } from '@/components/welcome/QuickPrompts';
import { WelcomeInput, type WelcomeInputHandle } from '@/components/welcome/WelcomeInput';

export const EmptyState = (): React.JSX.Element => {
  const phase = useMotionValue(-1);
  const logoRotate = useTransform(phase, (value) => value * 75);
  const logoScale = useTransform(phase, (value) => 1.065 + 0.115 * value);
  const glowOpacity = useTransform(phase, (value) => 0.6 + 0.4 * ((value + 1) / 2));
  const welcomeInputRef = useRef<WelcomeInputHandle>(null);

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
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-6"
    >
      <CyberBackground />

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center pt-[6vh]">
        <div className="flex w-full max-w-2xl flex-col items-center gap-6 sm:gap-8">
        <motion.div
          className="cursor-pointer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            style={{ rotate: logoRotate, scale: logoScale }}
            animate={{ y: [0, -6, 0] }}
            transition={{ y: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
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
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            How can I help you today?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Your intelligent desktop companion.
            <br />
            Ask in English or Nepali.
          </p>
        </div>

        <QuickPrompts onSelect={(prompt) => welcomeInputRef.current?.insertText(prompt)} />
        </div>
      </div>

      <div className="relative flex shrink-0 justify-center pb-[6vh] pt-5">
        <div className="w-full max-w-3xl">
          <WelcomeInput ref={welcomeInputRef} />
        </div>
      </div>
    </motion.div>
  );
};
