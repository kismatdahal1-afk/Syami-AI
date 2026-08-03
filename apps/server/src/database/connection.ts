import { Prisma } from '@prisma/client';
import { prisma } from './prisma.js';
import { dbUnavailable, notFound } from '../utils/errors.js';

const PING_TIMEOUT_MS = 3000;

/**
 * Lightweight MongoDB connectivity check (used by the health endpoint).
 * Never throws - reports connected/disconnected.
 */
export const checkDatabase = async (): Promise<'connected' | 'disconnected'> => {
  try {
    const result = await Promise.race([
      prisma.$runCommandRaw({ ping: 1 }).then(() => 'connected' as const),
      new Promise<'disconnected'>((resolve) => {
        setTimeout(() => resolve('disconnected'), PING_TIMEOUT_MS);
      }),
    ]);
    return result;
  } catch {
    return 'disconnected';
  }
};

const CONNECTION_ERROR_CODES = ['P1001', 'P1002', 'P1003', 'P1017'];

export const isConnectionError = (error: unknown): boolean => {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return CONNECTION_ERROR_CODES.includes(error.code);
  }
  return false;
};

/**
 * Maps Prisma errors to HttpError equivalents:
 * - connection failures -> 503 Database unavailable
 * - missing records (P2025) -> 404
 * - anything else passes through unchanged
 */
export const translateDbError = (error: unknown): unknown => {
  if (isConnectionError(error)) return dbUnavailable();
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    return notFound('Conversation not found');
  }
  return error;
};
