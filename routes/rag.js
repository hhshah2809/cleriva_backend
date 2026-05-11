import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadDocument, listDocuments, deleteDocument } from '../controllers/ragController.js';

const router = Router();
// POST /api/rag/upload  -> mounted as /api/rag/upload
router.post('/upload', authenticate, upload.single('file'), uploadDocument);

// GET /api/rag/documents
router.get('/documents', authenticate, listDocuments);

// DELETE /api/rag/documents/:id
router.delete('/documents/:id', authenticate, deleteDocument);

export default router;
