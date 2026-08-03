import { APP_NAME, APP_VERSION } from '../config/constants.js';
import { aiConfig } from '../config/ai.js';
import { checkDatabase } from '../database/connection.js';
import { ollamaService } from './ollama/index.js';

export interface HealthData {
  status: 'ok';
  app: string;
  version: string;
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
  };
  ai: {
    status: 'connected' | 'disconnected';
    model: string;
  };
}

export const getHealth = async (): Promise<HealthData> => {
  const [databaseStatus, aiStatus] = await Promise.all([
    checkDatabase(),
    ollamaService.getStatus(),
  ]);

  return {
    status: 'ok',
    app: APP_NAME,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: { status: databaseStatus },
    ai: {
      status: aiStatus.running ? 'connected' : 'disconnected',
      model: aiConfig.model,
    },
  };
};