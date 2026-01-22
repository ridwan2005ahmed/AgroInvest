import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  addAnimal,
  updateAnimal,
  getAllAnimals,
  updateMarketPrice,
  getMarketPrices,
  recordSale,
  getSales,
  getManagerDashboard
} from '../controllers/managerController.js';

const router = express.Router();

// All manager routes require authentication and manager role
router.use(authenticate);
router.use(authorize('manager', 'admin')); // Admin can also access manager routes

// Animal management
router.post('/animals', addAnimal);
router.put('/animals/:animalId', updateAnimal);
router.delete('/animals/:animalId', updateAnimal); // Reuse update to mark as deleted
router.get('/animals', getAllAnimals);

// Market prices
router.post('/market-prices', updateMarketPrice);
router.get('/market-prices', getMarketPrices);

// Sales
router.post('/sales', recordSale);
router.get('/sales', getSales); // Will add getSales controller method

// Dashboard
router.get('/dashboard', getManagerDashboard);

export default router;
