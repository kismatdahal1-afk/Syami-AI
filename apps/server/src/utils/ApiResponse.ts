import type { ApiFailure, ApiResponse } from '@syami/shared';

export const success = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  ...(message ? { message } : {}),
});

export const failure = (message: string, error?: unknown): ApiFailure => ({
  success: false,
  message,
  ...(error !== undefined ? { error } : {}),
});
