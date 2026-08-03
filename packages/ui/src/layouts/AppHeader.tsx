import { Menu } from 'lucide-react'
import { cn } from '../lib/cn'
import { Button } from '../components/Button'
import { Icon } from '../icons'

export interface AppHeaderProps {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
  onMenuClick?: () => void
  className?: string
}

export const AppHeader = ({
  left,
  center,
  right,
  onMenuClick,
  className
}: AppHeaderProps): React.JSX.Element => {
  return (
    <header
      className={cn('flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5', className)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {onMenuClick && (
          <Button variant="ghost" size="sm" iconOnly aria-label="Open sidebar" onClick={onMenuClick} className="md:hidden shrink-0">
            <Icon icon={Menu} size={18} />
          </Button>
        )}
        {left}
      </div>
      {center && (
        <div className="flex items-center justify-center">{center}</div>
      )}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">{right}</div>
    </header>
  )
}