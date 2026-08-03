import { cn } from '../../lib/cn'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'neon'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
  size?: 'sm' | 'md'
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary/12 text-primary border border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent/12 text-accent border border-accent/20',
  success: 'bg-success-subtle text-success border border-success/20',
  warning: 'bg-warning-subtle text-warning border border-warning/20',
  danger: 'bg-error-subtle text-error border border-error/20',
  info: 'bg-info-subtle text-info border border-info/20',
  outline: 'border border-border text-muted-foreground',
  neon: 'bg-accent-subtle text-accent border border-accent/30 shadow-glow-accent'
}

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-muted-foreground',
  primary: 'bg-primary',
  secondary: 'bg-secondary-foreground',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-error',
  info: 'bg-info',
  outline: 'bg-muted-foreground',
  neon: 'bg-accent'
}

const SIZE_CLASSES: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-0.5 text-xs'
}

export const Badge = ({
  variant = 'default',
  dot = false,
  size = 'md',
  className,
  children,
  ...rest
}: BadgeProps): React.JSX.Element => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className
      )}
      {...rest}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASSES[variant])} />}
      {children}
    </span>
  )
}
