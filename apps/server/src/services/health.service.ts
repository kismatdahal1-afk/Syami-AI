import { APP_NAME, APP_VERSION } from '../config/constants.js';

export interface HealthData {
  status: 'ok';
  app: string;
  version: string;
  timestamp: string;
  uptime: number;
}

export const getHealth = (): HealthData => ({
  status: 'ok',
  app: APP_NAME,
  version: APP_VERSION,
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
});
