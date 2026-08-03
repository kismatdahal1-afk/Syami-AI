import { Router } from 'express';
import {
  getSettingsController,
  updateSettingsController,
} from '../../controllers/settings.controller.js';
import { updateSettingsSchema, validateBody } from '../../middleware/validate.middleware.js';

const router = Router();

router.get('/', getSettingsController);
router.patch('/', validateBody(updateSettingsSchema), updateSettingsController);

export default router;