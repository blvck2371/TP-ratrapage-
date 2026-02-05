// Controller Metrics - gère les requêtes HTTP pour les métriques

import { Request, Response, NextFunction } from 'express';
import * as metricsService from '../services/metrics.service.js';

// POST /metrics - écrire une métrique
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await metricsService.createMetric(req.body);
    res.status(201).json({ success: true, message: 'Métrique enregistrée' });
  } catch (error) {
    next(error);
  }
};

// GET /metrics - récupérer les métriques
export const query = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { measurement, range } = req.query as any;
    const results = await metricsService.getMetrics(measurement, range);
    
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// GET /metrics/stats - statistiques API
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const range = (req.query.range as string) || '-1h';
    const stats = await metricsService.getApiStats(range);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
