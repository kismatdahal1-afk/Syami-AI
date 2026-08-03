import type { MessageRole } from '@prisma/client';
import { translateDbError } from '../database/connection.js';
import { prisma } from '../database/prisma.js';
import { notFound } from '../utils/errors.js';
import type {
  ConversationOut,
  ConversationSummaryOut,
  MessageOut,
  SendMessageResult,
} from '../types/chat.js';
import { generateMockReply } from './ai/reply.service.js';

const TITLE_MAX = 44;

const titleFromText = (text: string): string => {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > TITLE_MAX ? `${cleaned.slice(0, TITLE_MAX).trimEnd()}…` : cleaned;
};

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

export const sendMessage = async (input: {
  conversationId?: string;
  message: string;
}): Promise<SendMessageResult> => {
  try {
    const reply = generateMockReply();
    const now = new Date();

    let conversationId = input.conversationId;

    if (!conversationId) {
      const created = await prisma.conversation.create({
        data: { title: titleFromText(input.message) },
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

    await prisma.message.create({
      data: { conversationId, role: 'user', content: input.message },
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