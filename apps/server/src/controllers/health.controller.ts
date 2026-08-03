import type { Request, Response } from 'express';
import { getHealth } from '../services/health.service.js';
import { success } from '../utils/ApiResponse.js';

export const getHealthController = (_req: Request, res: Response): void => {
  res.status(200).json(success(getHealth(), 'Service is healthy'));
};
