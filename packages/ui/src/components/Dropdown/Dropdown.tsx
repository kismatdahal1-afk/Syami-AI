import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  openUpward?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  triggerClassName?: string
}

interface AnchorRect {
  top: number
  bottom: number
  left: number
  right: number
}

export const Dropdown = ({
  trigger,
  items,
  align = 'right',
  hideCaret = false,
  openUpward = false,
  onOpenChange,
  className,
  triggerClassName,
}: DropdownProps): React.JSX.Element => {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<AnchorRect | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const setOpenState = (next: boolean): void => {
    setOpen(next)
    onOpenChange?.(next)
  }

  const captureAnchor = (): void => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      setAnchor({ top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right })
    }
  }

  const toggle = (): void => {
    if (!open) captureAnchor()
    setOpenState(!open)
  }

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent): void => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpenState(false)
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpenState(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('scroll', captureAnchor, true)
    window.addEventListener('resize', captureAnchor)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('scroll', captureAnchor, true)
      window.removeEventListener('resize', captureAnchor)
    }
  }, [open])

  const handleItemClick = (item: DropdownItem): void => {
    if (item.disabled) return
    setOpenState(false)
    item.onClick?.()
  }

  const menuStyle = anchor
    ? {
        top: openUpward
          ? `${Math.max(8, window.innerHeight - anchor.top + 8)}px`
          : `${anchor.bottom + 8}px`,
        ...(align === 'right'
          ? { right: `${Math.max(8, window.innerWidth - anchor.right)}px` }
          : { left: `${Math.max(8, anchor.left)}px` }),
      }
    : undefined

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className={cn('flex items-center gap-1.5', triggerClassName)}
      >
        {trigger}
        {!hideCaret && <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {createPortal(
        <AnimatePresence>
          {open && anchor && menuStyle && (
            <motion.div
              ref={menuRef}
              role="menu"
              style={menuStyle}
              initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed z-50 min-w-44 rounded-xl border border-border bg-surface-modal p-1.5 shadow-elevated"
            >
              {items.map((item) => (
                <div key={item.id} className={cn(item.separatorBefore && 'mt-1 border-t border-border pt-1')}>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors',
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
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
