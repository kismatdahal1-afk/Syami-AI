/**
 * Syami AI language rules + detection (Phase 6).
 *
 * Automatic language detection feeds a hint into the system prompt so the
 * model reliably matches the user's language: English, Nepali, or a mix.
 */

/** Devanagari (Devanagari / Nepali) script range. */
const DEVANAGARI = /[\u0900-\u097F]/;
const LATIN = /[A-Za-z]/;

export type DetectedLanguage = 'en' | 'ne' | 'mixed';

export const detectLanguage = (text: string): DetectedLanguage => {
  if (DEVANAGARI.test(text) && LATIN.test(text)) return 'mixed';
  if (DEVANAGARI.test(text)) return 'ne';
  return 'en';
};

export const LANGUAGE_RULES = [
  'Match the user’s language automatically.',
  'If the user writes Nepali, reply in natural Nepali — friendly Kathmandu conversational Nepali, with formal Nepali (आदर/उचित लहजा) when the situation calls for it. Avoid unnecessary English words.',
  'If the user writes English, reply in natural, friendly English.',
  'If the user mixes languages, reply with a similar natural mix.',
].join('\n');