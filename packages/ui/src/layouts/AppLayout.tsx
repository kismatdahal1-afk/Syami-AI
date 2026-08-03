import { cn } from '../lib/cn'

export interface AppLayoutProps {
  sidebar: React.ReactNode
  header?: React.ReactNode
  children: React.ReactNode
  sidebarWidth?: 'default' | 'narrow' | 'wide'
  className?: string
}

const SIDEBAR_WIDTH_CLASSES = {
  default: '',
  narrow: '[&>aside]:w-56',
  wide: '[&>aside]:w-72'
} as const

/**
 * Primary application shell (Chat Mode: full desktop window).
 * Composes a sidebar column with an optional header + scrollable main area.
 */
export const AppLayout = ({
  sidebar,
  header,
  children,
  sidebarWidth = 'default',
  className
}: AppLayoutProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'flex h-full overflow-hidden bg-background text-foreground',
        SIDEBAR_WIDTH_CLASSES[sidebarWidth],
        className
      )}
    >
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        {children}
      </div>
    </div>
  )
}