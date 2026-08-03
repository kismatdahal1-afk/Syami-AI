import type { Transition, Variants } from 'framer-motion'

export const transition = {
  duration: 0.2,
  ease: 'easeOut'
} satisfies Transition

export const pageTransition = {
  duration: 0.25,
  ease: 'easeOut'
} satisfies Transition

export const springTransition = {
  type: 'spring',
  stiffness: 380,
  damping: 30
} satisfies Transition

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
} satisfies Variants

export const slideUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
} satisfies Variants

export const slideRightVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 }
} satisfies Variants

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 }
} satisfies Variants
