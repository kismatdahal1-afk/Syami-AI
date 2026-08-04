import axios from 'axios';
import { ApiClientError } from './errors';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const payload = error.response?.data;
      const message = extractErrorMessage(payload, status);
      return Promise.reject(new ApiClientError(message, status, payload));
    }
    return Promise.reject(error);
  },
);

const extractErrorMessage = (payload: unknown, status: number): string => {
  if (
    payload !== null &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof (payload as { message: unknown }).message === 'string'
  ) {
    return (payload as { message: string }).message;
  }
  return status > 0 ? `Request failed with status ${status}` : 'Network error';
};
