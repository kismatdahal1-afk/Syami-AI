import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { springTransition } from '../../animations'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: TooltipPosition
  delay?: number
  className?: string
}

const POSITION_CLASSES: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
}

export const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 0.15,
  className
}: TooltipProps): React.JSX.Element => {
  const [visible, setVisible] = useState(false)
  const id = useId()

  const show = (): void => setVisible(true)
  const hide = (): void => setVisible(false)

  return (
    <span className="relative inline-flex">
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={id}
      >
        {children}
      </span>
      <AnimatePresence>
        {visible && (
          <motion.div
            id={id}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ...springTransition, delay }}
            className={cn(
              'pointer-events-none absolute z-50 w-max max-w-60 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg',
              POSITION_CLASSES[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
