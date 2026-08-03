import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export type DropdownItemVariant = 'default' | 'danger'

export interface DropdownItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  variant?: DropdownItemVariant
  disabled?: boolean
  separatorBefore?: boolean
  onClick?: () => void
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  hideCaret?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  triggerClassName?: string
}

export const Dropdown = ({
  trigger,
  items,
  align = 'right',
  hideCaret = false,
  onOpenChange,
  className,
  triggerClassName,
}: DropdownProps): React.JSX.Element => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const setOpenState = (next: boolean): void => {
    setOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent): void => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenState(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpenState(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleItemClick = (item: DropdownItem): void => {
    if (item.disabled) return
    setOpenState(false)
    item.onClick?.()
  }

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpenState(!open)}
        className={cn('flex items-center gap-1.5', triggerClassName)}
      >
        {trigger}
        {!hideCaret && <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute top-full z-40 mt-2 min-w-44 rounded-lg border border-border bg-surface p-1 shadow-elevated',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item) => (
              <li key={item.id} className={cn(item.separatorBefore && 'mt-1 border-t border-border pt-1')}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                    item.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : item.variant === 'danger'
                        ? 'text-error hover:bg-error-subtle'
                        : 'text-foreground hover:bg-muted'
                  )}
                >
                  {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                  <span className="flex flex-col">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
