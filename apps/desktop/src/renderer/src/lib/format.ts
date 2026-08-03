const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const formatRelativeTime = (timestamp: number): string => {
  const delta = Date.now() - timestamp;
  if (delta < MINUTE) return 'just now';
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)}m ago`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)}h ago`;
  if (delta < 7 * DAY) return `${Math.floor(delta / DAY)}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const formatMessageTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

export const truncate = (text: string, max: number): string =>
  text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;

export const titleFromText = (text: string): string => truncate(text, 44);