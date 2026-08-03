import type { Request, Response } from 'express';
import { getHealth } from '../services/health.service.js';
import { success } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getHealthController = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(success(await getHealth(), 'Service is healthy'));
});