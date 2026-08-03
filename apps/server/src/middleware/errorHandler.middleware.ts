import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { failure } from '../utils/ApiResponse.js';

interface HttpError extends Error {
  status?: number;
}

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error(`[error] ${err.message}`, err.stack);
  }

  res.status(status).json(
    failure(status >= 500 ? 'Internal server error' : err.message, {
      ...(env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    }),
  );
};
