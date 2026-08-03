export const APP_NAME = 'Syami AI';
export const APP_VERSION = '1.0.0';

/**
 * Standard API response envelope defined in API_SPECIFICATION.md (Section 3).
 * Every backend endpoint must return either an ApiSuccess or ApiFailure shape.
 */
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  error?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiSuccess<T> =>
  response.success === true;

/** Payload returned by GET /api/v1/health */
export interface HealthData {
  status: 'ok';
  app: string;
  version: string;
  timestamp: string;
  uptime: number;
  /** Present from Phase 4: reflects live MongoDB connectivity. */
  database?: {
    status: 'connected' | 'disconnected';
  };
  /** Present from Phase 5: reflects live Ollama connectivity. */
  ai?: {
    status: 'connected' | 'disconnected';
    model: string;
  };
}
