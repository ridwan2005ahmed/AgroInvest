import express from 'express';
import { register, login, changePassword, getProfile, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/change-password', changePassword);
router.get('/profile', getProfile);
router.post('/logout', logout);

export default router;
