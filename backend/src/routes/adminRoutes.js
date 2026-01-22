import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  createManager,
  getPendingInvestors,
  verifyInvestor,
  rejectInvestor,
  getAllUsers,
  getSaleRecommendations,
  approveSaleRecommendation,
  rejectSaleRecommendation,
  getDashboardStats
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// User management
router.post('/managers', createManager);
router.get('/investors/pending', getPendingInvestors);
router.put('/investors/:investorId/verify', verifyInvestor);
router.put('/investors/:investorId/reject', rejectInvestor);
router.get('/users', getAllUsers);

// Sale recommendations
router.get('/sale-recommendations', getSaleRecommendations);
router.put('/sale-recommendations/:recommendationId/approve', approveSaleRecommendation);
router.put('/sale-recommendations/:recommendationId/reject', rejectSaleRecommendation);

// Dashboard
router.get('/dashboard', getDashboardStats);

export default router;
