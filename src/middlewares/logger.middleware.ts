// Middleware de logging des requêtes

import { Request, Response, NextFunction } from 'express';
import { recordApiRequest } from '../models/influxdb/metrics.model.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // On attend la fin de la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route?.path || req.path;

    // Log dans la console
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);

    // Enregistre dans InfluxDB (async, non bloquant)
    recordApiRequest(req.method, path, res.statusCode, duration);
  });

  next();
};
