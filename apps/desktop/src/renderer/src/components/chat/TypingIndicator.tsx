import { motion } from 'framer-motion';

const DOTS = [0, 1, 2];

export const TypingIndicator = (): React.JSX.Element => (
  <div className="flex items-center gap-1.5">
    {DOTS.map((index) => (
      <motion.span
        key={index}
        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.15, ease: 'easeInOut' }}
      />
    ))}
  </div>
);