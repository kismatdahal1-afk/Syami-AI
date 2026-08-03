import { APP_NAME, APP_VERSION } from '../config/constants.js';
import { checkDatabase } from '../database/connection.js';

export interface HealthData {
  status: 'ok';
  app: string;
  version: string;
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
  };
}

export const getHealth = async (): Promise<HealthData> => {
  const databaseStatus = await checkDatabase();

  return {
    status: 'ok',
    app: APP_NAME,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: { status: databaseStatus },
  };
};