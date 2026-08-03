import { Router } from 'express';
import { API_VERSION } from '../config/constants.js';
import healthRoutes from './v1/health.routes.js';

const router = Router();

router.use(`/${API_VERSION}/health`, healthRoutes);

export default router;
