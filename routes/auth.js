import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

// POST /api/register — Create a new user account
router.post('/auth/register', register);

// POST /api/login — Authenticate and receive JWT
router.post('/auth/login', login);

export default router;
