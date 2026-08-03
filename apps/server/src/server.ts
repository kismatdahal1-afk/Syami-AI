import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './database/prisma.js';

const startServer = async (): Promise<void> => {
  if (env.DB_CONNECT_ON_START) {
    await prisma.$connect();
    console.log('[database] MongoDB connection established');
  }

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(
      `[server] Syami AI backend listening on http://localhost:${env.PORT}/api (${env.NODE_ENV})`,
    );
  });
};

void startServer().catch((error: unknown) => {
  console.error('[server] Failed to start:', error);
  process.exit(1);
});
