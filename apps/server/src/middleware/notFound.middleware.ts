import type { NextFunction, Request, Response } from 'express';
import { failure } from '../utils/ApiResponse.js';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json(failure(`Route not found: ${req.method} ${req.originalUrl}`));
};
