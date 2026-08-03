import type { Request, Response } from 'express';
import * as settingsService from '../services/settings.service.js';
import { success } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSettingsController = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(success(await settingsService.getSettings()));
});

export const updateSettingsController = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(success(await settingsService.updateSettings(req.body), 'Settings updated'));
});