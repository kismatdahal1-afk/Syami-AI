/**
 * Bridge re-export — the canonical AI configuration now lives in
 * src/ai/ai-config.ts. This module exists only so existing importers
 * (e.g. health.service.ts) keep working unchanged.
 */
import { aiConfig } from '../ai/ai-config.js';

export { aiConfig } from '../ai/ai-config.js';
export type { AiConfig } from '../ai/ai-config.js';
export default aiConfig;