import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { failure } from '../utils/ApiResponse.js';

interface HttpError extends Error {
  status?: number;
  expose?: boolean;
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

  const message = status >= 500 && !err.expose ? 'Internal server error' : err.message;

  res.status(status).json(
    failure(message, {
      ...(env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    }),
  );
};
