import type { LucideIcon } from 'lucide-react'

export interface IconProps {
  icon: LucideIcon
  size?: number
  strokeWidth?: number
  className?: string
}

/**
 * Central icon wrapper enforcing consistent size and stroke style.
 * Swap the underlying icon library here without touching components.
 */
export const Icon = ({
  icon: IconComponent,
  size = 20,
  strokeWidth = 2,
  className
}: IconProps): React.JSX.Element => {
  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
}
