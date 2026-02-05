// Configuration de l'application Express

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { apiRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares/index.js';

export const createApp = () => {
  const app = express();

  // Middlewares de base
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Logger des requêtes
  app.use(requestLogger);

  // Route de health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes API
  app.use('/api/v1', apiRoutes);

  // Gestion des erreurs
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
