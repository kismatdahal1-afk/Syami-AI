import { Router } from 'express';
import {
  getAiModelsController,
  getAiStatusController,
} from '../../controllers/ai.controller.js';

const router = Router();

router.get('/status', getAiStatusController);
router.get('/models', getAiModelsController);

export default router;