import type { Request, Response } from 'express';
import { aiService } from '../services/ai/index.js';
import { success } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAiStatusController = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(success(await aiService.getStatus()));
});

export const getAiModelsController = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(success(await aiService.getModels()));
});