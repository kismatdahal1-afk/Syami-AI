import type { Request, Response } from 'express';
import * as chatService from '../services/chat.service.js';
import { success } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getHistoryController = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(success(await chatService.getHistory()));
});

export const getConversationController = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(success(await chatService.getMessages(String(req.params.conversationId))));
});

export const sendMessageController = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(success(await chatService.sendMessage(req.body), 'Message received'));
});

export const deleteConversationController = asyncHandler(async (req: Request, res: Response) => {
  await chatService.deleteConversation(String(req.params.conversationId));
  res.status(200).json(success(null, 'Conversation deleted'));
});

export const renameConversationController = asyncHandler(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(success(await chatService.renameConversation(String(req.params.conversationId), req.body.title), 'Conversation renamed'));
});