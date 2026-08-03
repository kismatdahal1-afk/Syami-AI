import { cn } from '../lib/cn'

export interface BrandInfo {
  title: string
  subtitle?: string
  icon?: React.ReactNode
}

export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export interface AppSidebarProps {
  brand: BrandInfo
  items: SidebarItem[]
  footer?: React.ReactNode
  renderItem?: (item: SidebarItem) => React.ReactNode
  className?: string
}

export const AppSidebar = ({
  brand,
  items,
  footer,
  renderItem,
  className
}: AppSidebarProps): React.JSX.Element => {
  return (
    <aside className={cn('flex w-64 shrink-0 flex-col border-r border-border bg-surface', className)}>
      <div className="flex items-center gap-3 px-5 py-5">
        {brand.icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-primary">
            {brand.icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{brand.title}</p>
          {brand.subtitle && <p className="truncate text-xs text-muted-foreground">{brand.subtitle}</p>}
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
        {items.map((item) =>
          renderItem ? (
            renderItem(item)
          ) : (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={item.onClick}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                item.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : item.active
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span className="flex-1 truncate text-left">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {item.badge}
                </span>
              )}
            </button>
          )
        )}
      </nav>

      {footer && <div className="border-t border-border p-4">{footer}</div>}
    </aside>
  )
}