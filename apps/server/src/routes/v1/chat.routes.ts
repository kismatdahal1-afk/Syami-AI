import { Router } from 'express';
import {
  deleteConversationController,
  getConversationController,
  getHistoryController,
  renameConversationController,
  sendMessageController,
} from '../../controllers/chat.controller.js';
import {
  conversationParamsSchema,
  renameConversationSchema,
  sendMessageSchema,
  validateBody,
  validateParams,
} from '../../middleware/validate.middleware.js';

const router = Router();

router.get('/history', getHistoryController);

router.get('/:conversationId', validateParams(conversationParamsSchema), getConversationController);

router.post('/message', validateBody(sendMessageSchema), sendMessageController);

router.delete('/:conversationId', validateParams(conversationParamsSchema), deleteConversationController);

router.patch(
  '/:conversationId',
  validateParams(conversationParamsSchema),
  validateBody(renameConversationSchema),
  renameConversationController,
);

export default router;