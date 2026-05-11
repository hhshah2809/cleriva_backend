import { Router } from 'express';
import { chat, getSessions, getMessages, deleteSession } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/chat — Send message and receive AI response (protected)
router.post('/chat', authenticate, chat);

// GET /api/sessions/:userId — Get all sessions for a user (protected)
router.get('/sessions/:userId', authenticate, getSessions);

// GET /api/sessions — Get current user's sessions (protected)
router.get('/sessions', authenticate, (req, res) => {
  req.params.userId = req.user.id;
  return getSessions(req, res);
});

// GET /api/messages/:sessionId — Get all messages in a session (protected)
router.get('/messages/:sessionId', authenticate, getMessages);

// DELETE /api/sessions/:sessionId — Delete a session (protected)
router.delete('/sessions/:sessionId', authenticate, deleteSession);

export default router;
