import { cn } from '../../lib/cn'

export type CardVariant = 'default' | 'glass' | 'elevated'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hoverable?: boolean
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'border border-border bg-surface text-surface-foreground',
  glass: 'border border-border/60 bg-surface/60 backdrop-blur-xl text-surface-foreground',
  elevated: 'border border-border bg-surface text-surface-foreground shadow-elevated'
}

export const Card = ({
  variant = 'default',
  hoverable = false,
  className,
  children,
  ...rest
}: CardProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'rounded-xl',
        VARIANT_CLASSES[variant],
        hoverable && 'transition-shadow duration-200 hover:shadow-lg',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>

const CardHeader = ({ className, children, ...rest }: CardSectionProps): React.JSX.Element => {
  return (
    <div className={cn('flex flex-col gap-1 px-5 pt-5', className)} {...rest}>
      {children}
    </div>
  )
}

const CardTitle = ({ className, children, ...rest }: CardSectionProps): React.JSX.Element => {
  return (
    <h3 className={cn('text-base font-semibold tracking-tight', className)} {...rest}>
      {children}
    </h3>
  )
}

const CardDescription = ({ className, children, ...rest }: CardSectionProps): React.JSX.Element => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...rest}>
      {children}
    </p>
  )
}

const CardContent = ({ className, children, ...rest }: CardSectionProps): React.JSX.Element => {
  return (
    <div className={cn('px-5 py-4', className)} {...rest}>
      {children}
    </div>
  )
}

const CardFooter = ({ className, children, ...rest }: CardSectionProps): React.JSX.Element => {
  return (
    <div
      className={cn('flex items-center gap-2 px-5 pb-5 pt-0', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
