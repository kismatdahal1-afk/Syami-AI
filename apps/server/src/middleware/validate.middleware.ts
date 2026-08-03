import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { badRequest } from '../utils/errors.js';

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z.string().regex(OBJECT_ID, 'Invalid conversation id');

export const conversationParamsSchema = z.object({
  conversationId: objectIdSchema,
});

export const sendMessageSchema = z.object({
  conversationId: objectIdSchema.optional(),
  message: z.string().trim().min(1, 'Message is required').max(4000, 'Message is too long'),
});

export const renameConversationSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
});

export const updateSettingsSchema = z
  .object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.enum(['en', 'ne']).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one setting is required');

type ZodSchema = z.ZodType<unknown>;

const firstIssueMessage = (result: { error: z.ZodError }): string =>
  result.error.issues[0]?.message ?? 'Invalid request';

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(badRequest(firstIssueMessage(result)));
      return;
    }
    req.body = result.data;
    next();
  };

export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      next(badRequest(firstIssueMessage(result)));
      return;
    }
    req.params = result.data as Request['params'];
    next();
  };
