import { Router } from 'express';
import { upsertProfile, getProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/profile — Create or update business profile (protected)
router.post('/profile', authenticate, upsertProfile);

// GET /api/profile/:userId — Get business profile (protected)
router.get('/profile/:userId', authenticate, getProfile);

// GET /api/profile — Get current user's profile (protected)
router.get('/profile', authenticate, getProfile);

export default router;
