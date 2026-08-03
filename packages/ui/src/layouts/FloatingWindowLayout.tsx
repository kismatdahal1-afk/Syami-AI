import { cn } from '../lib/cn'

export interface FloatingWindowLayoutProps {
  title?: string
  subtitle?: string
  headerEnd?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Floating overlay shell reserved for Agent Mode.
 * The header carries the draggable region so the OS can move the window.
 */
export const FloatingWindowLayout = ({
  title,
  subtitle,
  headerEnd,
  children,
  className
}: FloatingWindowLayoutProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 py-3 [-webkit-app-region:drag]">
        <div className="min-w-0">
          {title && <p className="truncate text-sm font-semibold text-foreground">{title}</p>}
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {headerEnd && <div className="[-webkit-app-region:no-drag]">{headerEnd}</div>}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}