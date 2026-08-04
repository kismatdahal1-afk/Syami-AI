const DEFAULT_MAX_LENGTH = 44;

const ENGLISH_LEADING_STRIPS: RegExp[] = [
  /^please\s+/i,
  /^can you\s+(please\s+)?/i,
  /^could you\s+(please\s+)?/i,
  /^would you\s+(please\s+)?/i,
  /^how can i\s+/i,
  /^how do i\s+/i,
  /^how would i\s+/i,
  /^how do you\s+/i,
  /^i want to know\s+/i,
  /^i would like to know\s+/i,
  /^explain\s+/i,
  /^describe\s+/i,
  /^tell me about\s+/i,
  /^tell me\s+/i,
  /^what is\s+/i,
  /^what are\s+/i,
  /^what's\s+/i,
  /^who is\s+/i,
  /^define\s+/i,
  /^summarize\s+/i,
];

const ENGLISH_TRAILING_STRIPS: RegExp[] = [
  /with examples$/i,
  /for me$/i,
  /for us$/i,
  /please$/i,
  /now$/i,
  /right now$/i,
  /today$/i,
  /tonight$/i,
  /this$/i,
  /soon$/i,
];

const NEPALI_LEADING_STRIPS: RegExp[] = [/^आज\s+/];

const NEPALI_TRAILING_STRIPS: RegExp[] = [
  /को हुन्$/,
  /कस्तो छ$/,
  /के हो$/,
  /कसरी$/,
  /कहाँ छ$/,
  /कति छ$/,
];

const stripLeading = (text: string): string => {
  let current = text;
  for (const pattern of NEPALI_LEADING_STRIPS) {
    current = current.replace(pattern, '');
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of ENGLISH_LEADING_STRIPS) {
      const next = current.replace(pattern, '');
      if (next !== current) {
        current = next;
        changed = true;
      }
    }
  }
  return current;
};

const stripTrailing = (text: string): string => {
  let current = text;
  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of [...ENGLISH_TRAILING_STRIPS, ...NEPALI_TRAILING_STRIPS]) {
      const next = current.replace(pattern, '');
      if (next !== current) {
        current = next.trim();
        changed = true;
      }
    }
  }
  return current;
};

const stripTrailingPunctuation = (text: string): string =>
  text.replace(/[?!.,;।]+$/, '').trim();

const cutToMax = (text: string, max: number): string => {
  if (text.length <= max) return text;
  let cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > max * 0.6) {
    cut = cut.slice(0, lastSpace);
  }
  return `${cut.trimEnd()}…`;
};

const keepsQuestionMark = (title: string): boolean =>
  /^(how|what|when|where|why|who|whose|whom)\b/i.test(title) ||
  (/^(hi|hello|hey)\b/i.test(title) && title.length <= 24);

/**
 * Generates a clean ChatGPT-style conversation title from the user's first
 * message only: strips instructive openers, filler clauses and question
 * suffixes (English + Nepali), normalizes punctuation and caps the length
 * at a word boundary so meaning is preserved.
 */
export const smartTitle = (text: string, max: number = DEFAULT_MAX_LENGTH): string => {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (!collapsed) return '';
  const hadQuestion = /[?？]\s*$/.test(collapsed);

  const cleaned = stripTrailingPunctuation(
    stripTrailing(stripTrailingPunctuation(stripLeading(collapsed))),
  );
  if (!cleaned) return '';

  const cut = cutToMax(cleaned, max);
  const title = cut.charAt(0).toUpperCase() + cut.slice(1);
  return hadQuestion && keepsQuestionMark(title) ? `${title}?` : title;
};
