import { cn } from '../lib/cn'

export interface MainContentProps extends React.HTMLAttributes<HTMLElement> {
  padded?: boolean
}

export const MainContent = ({
  padded = true,
  className,
  children,
  ...rest
}: MainContentProps): React.JSX.Element => {
  return (
    <main className={cn('min-w-0 flex-1 overflow-y-auto bg-background', padded && 'p-6', className)} {...rest}>
      {children}
    </main>
  )
}