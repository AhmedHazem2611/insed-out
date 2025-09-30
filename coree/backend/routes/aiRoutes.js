import { Router } from 'express';
import { requireAuth } from '../services/middleware/authMiddleware.js';
import { guideHandler, reportHandler, routineHandler } from '../controllers/aiController.js';

const router = Router();

router.post('/guide', requireAuth, guideHandler);
router.post('/report', requireAuth, reportHandler);
router.post('/routine', requireAuth, routineHandler);

export default router; 