import jwt from 'jsonwebtoken';
import { query } from '../database/db.js';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await query(
      'SELECT id, email, role, is_verified, force_password_reset, status FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    // Check if user account is active
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }
    
    // Check if password reset is required
    if (user.force_password_reset) {
      return res.status(403).json({ 
        error: 'Password reset required',
        forcePasswordReset: true 
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of allowed roles
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        requiredRole: allowedRoles,
        userRole: req.user.role
      });
    }
    
    next();
  };
};

/**
 * Investor verification check middleware
 * Only verified investors can proceed
 */
export const requireVerified = (req, res, next) => {
  if (req.user.role === 'investor' && !req.user.is_verified) {
    return res.status(403).json({ 
      error: 'Account verification required',
      message: 'Your account is pending admin approval'
    });
  }
  next();
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work both with and without auth
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await query(
      'SELECT id, email, role, is_verified, status FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length > 0) {
      req.user = result.rows[0];
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};
