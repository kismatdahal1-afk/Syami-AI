import { AnimatePresence, motion } from 'framer-motion'
import { pageTransition, slideUpVariants } from './presets'

export interface PageTransitionProps {
  animationKey: string
  children: React.ReactNode
  className?: string
}

export const PageTransition = ({
  animationKey,
  children,
  className
}: PageTransitionProps): React.JSX.Element => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={animationKey}
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
