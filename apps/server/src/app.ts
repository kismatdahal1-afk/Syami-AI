import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { API_PREFIX } from './config/constants.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import routes from './routes/index.js';

const allowedOrigins = env.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const createApp = (): express.Express => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow same-origin/no-origin requests (e.g. Electron file://) and configured dev origins.
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.use(API_PREFIX, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
