import { cn } from '../../lib/cn'

export type LoadingSize = 'sm' | 'md' | 'lg'

export interface LoadingProps {
  size?: LoadingSize
  label?: string
  className?: string
}

const SIZE_CLASSES: Record<LoadingSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]'
}

export const Loading = ({ size = 'md', label, className }: LoadingProps): React.JSX.Element => {
  return (
    <div className={cn('inline-flex items-center gap-3', className)} role="status" aria-label={label ?? 'Loading'}>
      <span
        className={cn('animate-spin rounded-full border-muted border-t-primary', SIZE_CLASSES[size])}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  )
}
