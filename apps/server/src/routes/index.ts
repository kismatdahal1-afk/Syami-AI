import { Router } from 'express';
import { API_VERSION } from '../config/constants.js';
import aiRoutes from './v1/ai.routes.js';
import chatRoutes from './v1/chat.routes.js';
import healthRoutes from './v1/health.routes.js';
import settingsRoutes from './v1/settings.routes.js';

const router = Router();

router.use(`/${API_VERSION}/health`, healthRoutes);
router.use(`/${API_VERSION}/ai`, aiRoutes);
router.use(`/${API_VERSION}/chat`, chatRoutes);
router.use(`/${API_VERSION}/settings`, settingsRoutes);

export default router;