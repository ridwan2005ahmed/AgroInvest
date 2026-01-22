import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

/**
 * Generate JWT token
 */
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * User Registration (Investors only)
 */
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
    // Validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create investor account (default status: pending, not verified)
    const result = await query(
      `INSERT INTO users (email, password_hash, role, is_verified, status)
       VALUES ($1, $2, 'investor', false, 'pending')
       RETURNING id, email, role, is_verified, status, created_at`,
      [email.toLowerCase(), passwordHash]
    );
    
    const user = result.rows[0];
    
    // Log registration
    await logAudit(user.id, 'USER_REGISTERED', 'user', user.id, { email }, req.ip);
    
    // Generate token (but user cannot invest until verified)
    const token = generateToken(user.id, user.email, user.role);
    
    res.status(201).json({
      message: 'Registration successful. Awaiting admin approval.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * User Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check account status
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account has been suspended' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      await logAudit(user.id, 'LOGIN_FAILED', 'user', user.id, { reason: 'Invalid password' }, req.ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Log successful login
    await logAudit(user.id, 'LOGIN_SUCCESS', 'user', user.id, {}, req.ip);
    
    // Generate token
    const token = generateToken(user.id, user.email, user.role);
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
        forcePasswordReset: user.force_password_reset,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Change Password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Get current user
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );
    
    const user = result.rows[0];
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update password and remove force reset flag
    await query(
      `UPDATE users 
       SET password_hash = $1, force_password_reset = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [newPasswordHash, userId]
    );
    
    // Log password change
    await logAudit(userId, 'PASSWORD_CHANGED', 'user', userId, {}, req.ip);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

/**
 * Get Current User Profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await query(
      `SELECT id, email, role, is_verified, status, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * Logout (Client-side: delete token)
 */
export const logout = async (req, res) => {
  try {
    await logAudit(req.user.id, 'LOGOUT', 'user', req.user.id, {}, req.ip);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};
