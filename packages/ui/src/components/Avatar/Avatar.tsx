import { cn } from '../../lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string
  src?: string
  alt?: string
  size?: AvatarSize
  status?: 'online' | 'away' | 'offline'
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg'
}

const STATUS_DOT_CLASSES: Record<NonNullable<AvatarProps['status']>, string> = {
  online: 'bg-success',
  away: 'bg-warning',
  offline: 'bg-muted-foreground'
}

const STATUS_DOT_SIZES: Record<AvatarSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
  xl: 'h-3 w-3'
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
}

export const Avatar = ({
  name,
  src,
  alt,
  size = 'md',
  status,
  className,
  ...rest
}: AvatarProps): React.JSX.Element => {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-primary-subtle font-medium text-primary',
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name ?? ''}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : name ? (
        getInitials(name)
      ) : (
        '?'
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-background',
            STATUS_DOT_CLASSES[status],
            STATUS_DOT_SIZES[size]
          )}
          aria-label={status}
        />
      )}
    </span>
  )
}
