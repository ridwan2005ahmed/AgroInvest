import express from 'express';
import { authenticate, authorize, requireVerified } from '../middleware/authMiddleware.js';
import {
  getPortfolio,
  createInvestment,
  getInvestmentDetails,
  listInvestmentForResale,
  getResaleListings,
  placeBid,
  acceptBid,
  getMyListings,
  getMyBids,
  getInvestorDashboard
} from '../controllers/investorController.js';

const router = express.Router();

// All investor routes require authentication
router.use(authenticate);
router.use(authorize('investor'));

// Portfolio (verified investors only)
router.get('/portfolio', requireVerified, getPortfolio);
router.post('/investments', requireVerified, createInvestment);
router.get('/investments/:investmentId', requireVerified, getInvestmentDetails);

// Resale marketplace
router.post('/resale/create', requireVerified, listInvestmentForResale);
router.get('/resale/listings', getResaleListings);
router.get('/resale/my-listings', requireVerified, getMyListings);
router.get('/resale/my-bids', requireVerified, getMyBids);
router.post('/resale/bid', requireVerified, placeBid);
router.post('/resale/accept-bid/:bidId', requireVerified, acceptBid);

// Dashboard
router.get('/dashboard', getInvestorDashboard);

export default router;
