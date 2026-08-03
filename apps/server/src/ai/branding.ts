/**
 * Syami AI branding (Phase 6).
 *
 * Single source of truth for the assistant's identity. Injected into the
 * system prompt and reusable anywhere in the application.
 */
import { APP_VERSION } from '../config/constants.js';

export const BRAND_NAME = 'Syami AI';
export const BRAND_TAGLINE = 'Your Intelligent Desktop Assistant';
export const BRAND_CREATOR = 'Kismat Dahal';
export const BRAND_VERSION = `v${APP_VERSION}`;
export const BRAND_STATUS = 'Online';

export interface BrandInfo {
  name: string;
  tagline: string;
  creator: string;
  version: string;
  status: string;
}

export const BRAND: BrandInfo = {
  name: BRAND_NAME,
  tagline: BRAND_TAGLINE,
  creator: BRAND_CREATOR,
  version: BRAND_VERSION,
  status: BRAND_STATUS,
};

/** Formats the branded identity line used by the system prompt. */
export const formatBranding = (): string =>
  `${BRAND_NAME} — ${BRAND_TAGLINE}. Created and developed by ${BRAND_CREATOR}. Version ${BRAND_VERSION}, status: ${BRAND_STATUS}.`;