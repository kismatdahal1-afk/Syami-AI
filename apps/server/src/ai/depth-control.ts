/**
 * Syami AI response-depth control (Phase 6.1.14).
 *
 * Matches answer length to the user's intent. A per-request depth hint is
 * injected into the system prompt (mirroring the language hint) so the model
 * answers exactly what was asked — nothing more, nothing less.
 */

export type ResponseDepth = 'short' | 'medium' | 'detailed';

/** Explicit requests for a comprehensive/long response. */
const DETAILED_PATTERNS: RegExp[] = [
  /in[- ]depth/,
  /in (great|full|complete|more) detail/,
  /\bdetailed\b/,
  /in detail/,
  /\belaborate\b/,
  /complete notes/,
  /long answer/,
  /deep explanation/,
  /\bcomprehensive\b/,
  /\bthorough(ly)?\b/,
  /explain everything/,
  /full explanation/,
  /\bderive(s|d)?\b/,
  /\bderivation\b/,
  /\bprove that\b/,
  /step by step/,
  /विस्तृत|विस्तारमा|पूरा नोट|पूर्ण रूपमा|लामो जवाफ|गहिरो|सिद्ध गर|सिद्ध गर्नुहोस्|निकाल्नुहोस्|उदाहरण सहित|उदाहरणसहित/,
];

/** Explicit requests for a brief/minimal response. */
const SHORT_PATTERNS: RegExp[] = [
  /^\s*(hi|hii+|hello|hey+|yo|namaste)\b/,
  /^\s*(नमस्ते|हेलो|हाइ)\b/,
  /^(thanks|thank you|thx|ty|ok|okay|bye|good (morning|afternoon|evening|night))\b/,
  /\bbriefly\b/,
  /\bin short\b/,
  /short answer/,
  /one sentence/,
  /one line/,
  /\bshortly\b/,
  /\bquick(ly)?\b/,
  /just tell me/,
  /\bsimply\b/,
  /tl;?dr/,
  /छोटो|छोटकरी|एक वाक्यमा/,
];

/** Action requests ("can you…", "help me…") are never auto-classified short. */
const ACTION_REQUEST_PREFIX =
  /^(can you|can u|could you|would you|will you|please|help me|i want|i need|i would like|how (can|do|would) i|how to|how do we|tell me how)/;

/** Simple fact questions that want a short answer ("what is X", "define X"). */
const SHORT_QUESTION_START =
  /^(what|what's|who|when|where|which|whose|define|is|are|does|do|why|how (much|many|old|tall|far|long|big))\b/;

const SIMPLE_QUESTION_CAP = 60;
const QUESTION_LENGTH_CAP = 40;

/**
 * Classifies the user's message intent:
 * - explicit depth keywords ("explain in detail", "derive") -> detailed
 * - explicit brevity keywords ("briefly", greetings) -> short
 * - simple fact questions ("what is X…") -> short
 * - tiny questions (<= 40 chars ending in "?") -> short
 * - action/help requests -> medium
 * - everything else -> medium
 */
export const detectDepth = (text: string): ResponseDepth => {
  const normalized = text.toLowerCase().trim();
  if (DETAILED_PATTERNS.some((pattern) => pattern.test(normalized))) return 'detailed';
  if (SHORT_PATTERNS.some((pattern) => pattern.test(normalized))) return 'short';

  const isActionRequest = ACTION_REQUEST_PREFIX.test(normalized);
  if (isActionRequest) return 'medium';

  if (SHORT_QUESTION_START.test(normalized) && normalized.length <= SIMPLE_QUESTION_CAP) {
    return 'short';
  }
  if (normalized.length <= QUESTION_LENGTH_CAP && /[?？]$/.test(normalized)) return 'short';
  return 'medium';
};

/** Static prompt block encoding the length-matching behaviour. */
export const DEPTH_RULES = [
  'Match the length and depth of your answer to exactly what the user asked — think "answer what the user asked, nothing more."',
  'Short question (a simple "what is…", "who is…", a formula request, or a greeting) → give a SHORT answer of at most 2–3 sentences or a single formula, then STOP. Do not list variables, do not add explanations after the answer.',
  'Normal question (asks for an explanation) → give a concise explanation with only the necessary details, typically a short paragraph.',
  'Detailed request (words like "explain in detail", "elaborate", "complete notes", "long answer", "derive") → give a comprehensive, well-structured answer.',
  'NEVER add sections the user did not ask for: examples, real-life applications, derivations, history, advantages, disadvantages, tips, notes, related topics, or extra facts.',
  'Follow-up first: answer exactly what was asked. If the user later asks to expand ("explain with examples", "derive it"), provide that then.',
].join('\n');

const DEPTH_HINTS: Record<ResponseDepth, string> = {
  short: 'RESPONSE LENGTH HINT: the current question is a simple request — reply in at most 2–3 short sentences or a single formula, then stop. No variable lists, no follow-up explanations, no extra sections.',
  medium:
    'RESPONSE LENGTH HINT: the current question is a normal request — reply with a concise medium-length explanation (a short paragraph or two) and no extra sections.',
  detailed:
    'RESPONSE LENGTH HINT: the current question explicitly asks for depth — reply with a comprehensive, well-structured answer.',
};

/** Per-request hint appended to the system prompt. */
export const formatDepthHint = (depth: ResponseDepth): string => DEPTH_HINTS[depth];
