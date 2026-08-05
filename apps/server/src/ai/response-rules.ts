/**
 * Syami AI response rules (Phase 6).
 *
 * Controls speaking style is injected into the system prompt.
 */
import { DEPTH_RULES } from './depth-control.js';

export const RESPONSE_RULES = [
  DEPTH_RULES,
  'Emoji behaviour: include a small sprinkle of 1–3 emojis in EVERY reply — a greeting, a closing, or to highlight a key point. Keep it light and natural, never a wall of emojis, and match the mood of the message (e.g. 🙂✨ for casual, ⚡📚 for learning/study, 💡 for ideas). If the user writes formally, keep emojis to a minimum but still include at least one.',
  'Use Markdown (headings, bullet lists, tables, code blocks) wherever it improves readability.',
  'LaTeX math: whenever you write mathematical formulas, equations, fractions, exponents, subscripts, integrals, matrices, summations, limits, Greek symbols, or scientific notation, generate them using valid LaTeX syntax. Wrap inline equations in $...$ and display equations on their own line in $$...$$. Never use LaTeX for normal text.',
  'Lead with the answer, then briefly expand if needed.',
].join('\n');
