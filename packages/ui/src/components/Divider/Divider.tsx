import { cn } from '../../lib/cn'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export const Divider = ({
  orientation = 'horizontal',
  label,
  className,
  ...rest
}: DividerProps): React.JSX.Element => {
  if (orientation === 'vertical') {
    return <div className={cn('h-full w-px shrink-0 bg-border', className)} role="separator" {...rest} />
  }

  if (label) {
    return (
      <div className={cn('flex w-full items-center gap-3', className)} role="separator" {...rest}>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    )
  }

  return <div className={cn('h-px w-full bg-border', className)} role="separator" {...rest} />
}
