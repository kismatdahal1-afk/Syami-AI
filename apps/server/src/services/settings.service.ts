import { translateDbError } from '../database/connection.js';
import { prisma } from '../database/prisma.js';
import type { SettingsOut } from '../types/chat.js';

const serializeSettings = (settings: { theme: string; language: string; createdAt: Date }): SettingsOut => ({
  theme: settings.theme,
  language: settings.language,
  createdAt: settings.createdAt.toISOString(),
});

export const getSettings = async (): Promise<SettingsOut> => {
  try {
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      return { theme: 'system', language: 'en', createdAt: new Date().toISOString() };
    }
    return serializeSettings(settings);
  } catch (error) {
    throw translateDbError(error);
  }
};

export const updateSettings = async (patch: {
  theme?: string;
  language?: string;
}): Promise<SettingsOut> => {
  try {
    const existing = await prisma.settings.findFirst();
    const data = {
      theme: patch.theme ?? existing?.theme ?? 'system',
      language: patch.language ?? existing?.language ?? 'en',
    };

    const settings = existing
      ? await prisma.settings.update({ where: { id: existing.id }, data })
      : await prisma.settings.create({ data });

    return serializeSettings(settings);
  } catch (error) {
    throw translateDbError(error);
  }
};