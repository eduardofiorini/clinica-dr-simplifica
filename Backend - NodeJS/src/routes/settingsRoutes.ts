import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/settings - Get clinic settings
router.get('/', authenticate, getSettings);

// PUT /api/settings - Update clinic settings  
router.put('/', authenticate, updateSettings);

export default router; 