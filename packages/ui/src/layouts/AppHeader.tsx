import { cn } from '../lib/cn'

export interface AppHeaderProps {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
  className?: string
}

export const AppHeader = ({
  left,
  center,
  right,
  className
}: AppHeaderProps): React.JSX.Element => {
  return (
    <header
      className={cn('flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5', className)}
    >
      <div className="flex min-w-0 flex-1 items-center">{left}</div>
      {center && (
        <div className="flex items-center justify-center">{center}</div>
      )}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">{right}</div>
    </header>
  )
}