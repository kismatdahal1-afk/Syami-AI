import { forwardRef, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  fullWidth?: boolean
  clearable?: boolean
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { fullWidth = true, clearable = true, onClear, className, ...rest },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasValue, setHasValue] = useState(false)

  const setRefs = (node: HTMLInputElement | null): void => {
    inputRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  const handleClear = (): void => {
    onClear?.()
    setHasValue(false)
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative', fullWidth && 'w-full')}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search size={16} />
      </span>
      <input
        ref={setRefs}
        type="search"
        className={cn(
          'h-10 w-full rounded-lg border border-input bg-surface pl-9 pr-9 text-sm text-foreground',
          'placeholder:text-muted-foreground transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        onChange={(event) => {
          setHasValue(event.target.value.length > 0)
          rest.onChange?.(event)
        }}
        {...rest}
      />
      {clearable && hasValue && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={handleClear}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
})
