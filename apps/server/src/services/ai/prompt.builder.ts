/**
 * Bridge re-export — the canonical prompt system now lives in src/ai.
 * This module exists so existing importers keep working unchanged.
 */
export { buildChat, SYAMI_SYSTEM_PROMPT } from '../../ai/index.js';
export type { BuildChatParams, PromptHistoryMessage } from '../../ai/index.js';