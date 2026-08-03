import { motion } from 'framer-motion'
import type { MotionProps as FramerMotionProps } from 'framer-motion'
import { fadeVariants, transition } from './presets'

export interface FadeInProps extends FramerMotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const FadeIn = ({
  children,
  className,
  delay = 0,
  ...rest
}: FadeInProps): React.JSX.Element => {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...transition, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
