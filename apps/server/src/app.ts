import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { API_PREFIX } from './config/constants.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import routes from './routes/index.js';

export const createApp = (): express.Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.use(API_PREFIX, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
