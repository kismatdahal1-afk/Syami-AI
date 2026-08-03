import { SearchInput } from '@syami/ui';

interface SearchChatsProps {
  query: string;
  onChange: (query: string) => void;
  onClear: () => void;
}

export const SearchChats = ({ query, onChange, onClear }: SearchChatsProps): React.JSX.Element => (
  <SearchInput
    value={query}
    placeholder="Search chats..."
    aria-label="Search conversations"
    onChange={(event) => onChange(event.target.value)}
    onClear={onClear}
  />
);