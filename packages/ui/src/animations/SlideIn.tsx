import { motion } from 'framer-motion'
import type { MotionProps as FramerMotionProps } from 'framer-motion'
import { slideUpVariants, transition } from './presets'

export interface SlideInProps extends FramerMotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'right'
}

export const SlideIn = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  ...rest
}: SlideInProps): React.JSX.Element => {
  return (
    <motion.div
      variants={slideUpVariants}
      custom={direction}
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
