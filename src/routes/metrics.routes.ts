// Routes pour les métriques

import { Router } from 'express';
import { metricsController } from '../controllers/index.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createMetricSchema, queryMetricsSchema } from '../schemas/index.js';

const router = Router();

// GET /metrics - récupérer les métriques
router.get('/', validate(queryMetricsSchema), metricsController.query);

// POST /metrics - écrire une métrique
router.post('/', validate(createMetricSchema), metricsController.create);

// GET /metrics/stats - statistiques API
router.get('/stats', metricsController.getStats);

export { router as metricsRoutes };
