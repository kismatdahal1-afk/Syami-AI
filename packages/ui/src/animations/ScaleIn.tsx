import { motion } from 'framer-motion'
import type { MotionProps as FramerMotionProps } from 'framer-motion'
import { scaleVariants, springTransition } from './presets'

export interface ScaleInProps extends FramerMotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const ScaleIn = ({
  children,
  className,
  delay = 0,
  ...rest
}: ScaleInProps): React.JSX.Element => {
  return (
    <motion.div
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...springTransition, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
