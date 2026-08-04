import type { MessageRole } from '@prisma/client';
import { smartTitle } from '@syami/shared';
import { translateDbError } from '../database/connection.js';
import { prisma } from '../database/prisma.js';
import { notFound } from '../utils/errors.js';
import type {
  ConversationOut,
  ConversationSummaryOut,
  MessageOut,
  SendMessageResult,
} from '../types/chat.js';
import { aiService } from './ai/index.js';

const serializeMessage = (message: {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}): MessageOut => ({
  id: message.id,
  role: message.role,
  content: message.content,
  createdAt: message.createdAt.toISOString(),
});

export const getHistory = async (): Promise<ConversationSummaryOut[]> => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
    return conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    }));
  } catch (error) {
    throw translateDbError(error);
  }
};

export const getMessages = async (conversationId: string): Promise<ConversationOut> => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) throw notFound('Conversation not found');

    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messages: conversation.messages.map(serializeMessage),
    };
  } catch (error) {
    throw translateDbError(error);
  }
};

/**
 * Phase 5 flow:
 * 1. ensure conversation exists (create with a title derived from the message)
 * 2. load prior messages from the conversation (conversational context)
 * 3. persist the user message
 * 4. generate the AI reply (prompt builder -> Ollama)
 * 5. persist the assistant reply and touch updatedAt
 */
export const sendMessage = async (input: {
  conversationId?: string;
  message: string;
}): Promise<SendMessageResult> => {
  try {
    const now = new Date();

    let conversationId = input.conversationId;

    if (!conversationId) {
      const created = await prisma.conversation.create({
        data: { title: smartTitle(input.message) },
        select: { id: true },
      });
      conversationId = created.id;
    } else {
      const exists = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { id: true },
      });
      if (!exists) throw notFound('Conversation not found');
    }

    const previousMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
    });

    await prisma.message.create({
      data: { conversationId, role: 'user', content: input.message },
    });

    const reply = await aiService.chat({
      history: previousMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      message: input.message,
    });

    await prisma.message.create({
      data: { conversationId, role: 'assistant', content: reply },
    });
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: now },
    });

    return { conversationId, reply };
  } catch (error) {
    throw translateDbError(error);
  }
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    await prisma.conversation.delete({ where: { id: conversationId } });
  } catch (error) {
    throw translateDbError(error);
  }
};

export const renameConversation = async (
  conversationId: string,
  title: string,
): Promise<ConversationSummaryOut> => {
  try {
    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
    return {
      id: updated.id,
      title: updated.title,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    throw translateDbError(error);
  }
};