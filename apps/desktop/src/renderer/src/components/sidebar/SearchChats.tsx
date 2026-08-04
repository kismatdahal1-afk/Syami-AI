import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@syami/ui';

interface SearchChatsProps {
  query: string;
  onChange: (query: string) => void;
  onClear: () => void;
}

export const SearchChats = forwardRef<HTMLInputElement, SearchChatsProps>(function SearchChats(
  { query, onChange, onClear },
  ref,
) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors">
        <Search size={16} />
      </span>
      <input
        ref={ref}
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search chats..."
        aria-label="Search conversations"
        className={cn(
          'h-10 w-full rounded-xl border border-white/50 bg-white/55 pl-9 pr-9 text-sm text-foreground shadow-sm backdrop-blur-xl',
          'placeholder:text-muted-foreground',
          'transition-all duration-200',
          'hover:bg-white/75 hover:shadow-md',
          'focus-visible:border-primary/50 focus-visible:font-normal focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
          'dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
      />
      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
});