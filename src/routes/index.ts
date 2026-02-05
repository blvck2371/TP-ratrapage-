// Routeur principal

import { Router } from 'express';
import { userRoutes } from './user.routes.js';
import { metricsRoutes } from './metrics.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/metrics', metricsRoutes);

export { router as apiRoutes };
