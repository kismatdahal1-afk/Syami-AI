import { motion } from 'framer-motion';

const DOTS = [0, 1, 2];

export const TypingIndicator = (): React.JSX.Element => (
  <div className="flex items-center gap-1.5">
    {DOTS.map((index) => (
      <motion.span
        key={index}
        className="h-1.5 w-1.5 rounded-full bg-primary/70"
        animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.15, ease: 'easeInOut' }}
      />
    ))}
  </div>
);