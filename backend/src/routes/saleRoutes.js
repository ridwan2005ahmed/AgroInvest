import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  generateRecommendation,
  previewRecommendation,
  checkMaturing
} from '../controllers/saleController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin and Manager can generate recommendations
router.post('/generate', authorize('admin', 'manager'), generateRecommendation);
router.post('/preview', authorize('admin', 'manager'), previewRecommendation);
router.get('/check-maturing', authorize('admin', 'manager'), checkMaturing);

export default router;
