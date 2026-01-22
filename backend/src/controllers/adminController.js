import bcrypt from 'bcryptjs';
import { query, getClient } from '../database/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

/**
 * Create Manager Account (Admin only)
 */
export const createManager = async (req, res) => {
  try {
    const { email, temporaryPassword } = req.body;
    
    if (!email || !temporaryPassword) {
      return res.status(400).json({ error: 'Email and temporary password are required' });
    }
    
    // Check if email already exists
    const existing = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);
    
    // Create manager with force password reset
    const result = await query(
      `INSERT INTO users (email, password_hash, role, is_verified, force_password_reset, status)
       VALUES ($1, $2, 'manager', true, true, 'active')
       RETURNING id, email, role, is_verified, force_password_reset, status, created_at`,
      [email.toLowerCase(), passwordHash]
    );
    
    const manager = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'MANAGER_CREATED',
      'user',
      manager.id,
      { email, createdBy: req.user.email },
      req.ip
    );
    
    res.status(201).json({
      message: 'Manager account created successfully',
      manager: {
        id: manager.id,
        email: manager.email,
        role: manager.role,
        forcePasswordReset: manager.force_password_reset
      }
    });
  } catch (error) {
    console.error('Create manager error:', error);
    res.status(500).json({ error: 'Failed to create manager' });
  }
};

/**
 * Get Pending Investor Accounts
 */
export const getPendingInvestors = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, status, created_at 
       FROM users 
       WHERE role = 'investor' AND is_verified = false
       ORDER BY created_at DESC`
    );
    
    res.json({ investors: result.rows });
  } catch (error) {
    console.error('Get pending investors error:', error);
    res.status(500).json({ error: 'Failed to fetch pending investors' });
  }
};

/**
 * Verify Investor Account
 */
export const verifyInvestor = async (req, res) => {
  try {
    const { investorId } = req.params;
    
    // Update investor status
    const result = await query(
      `UPDATE users 
       SET is_verified = true, status = 'active', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND role = 'investor'
       RETURNING id, email, is_verified, status`,
      [investorId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Investor not found' });
    }
    
    const investor = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'INVESTOR_VERIFIED',
      'user',
      investor.id,
      { email: investor.email, verifiedBy: req.user.email },
      req.ip
    );
    
    res.json({
      message: 'Investor verified successfully',
      investor
    });
  } catch (error) {
    console.error('Verify investor error:', error);
    res.status(500).json({ error: 'Failed to verify investor' });
  }
};

/**
 * Reject Investor Account
 */
export const rejectInvestor = async (req, res) => {
  try {
    const { investorId } = req.params;
    const { reason } = req.body;
    
    // Update investor status to suspended
    const result = await query(
      `UPDATE users 
       SET status = 'suspended', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND role = 'investor'
       RETURNING id, email, status`,
      [investorId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Investor not found' });
    }
    
    const investor = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'INVESTOR_REJECTED',
      'user',
      investor.id,
      { email: investor.email, rejectedBy: req.user.email, reason },
      req.ip
    );
    
    res.json({
      message: 'Investor account rejected',
      investor
    });
  } catch (error) {
    console.error('Reject investor error:', error);
    res.status(500).json({ error: 'Failed to reject investor' });
  }
};

/**
 * Get All Users (with filters)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    
    let queryText = 'SELECT id, email, role, is_verified, status, created_at FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      params.push(role);
      queryText += ` AND role = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    }
    
    queryText += ' ORDER BY created_at DESC';
    
    const result = await query(queryText, params);
    
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * Get Sale Recommendations
 */
export const getSaleRecommendations = async (req, res) => {
  try {
    const { status } = req.query;
    
    let queryText = 'SELECT * FROM sale_recommendations WHERE 1=1';
    const params = [];
    
    if (status) {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    }
    
    queryText += ' ORDER BY created_at DESC';
    
    const result = await query(queryText, params);
    
    res.json({ recommendations: result.rows });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

/**
 * Approve Sale Recommendation
 */
export const approveSaleRecommendation = async (req, res) => {
  const client = await getClient();
  
  try {
    const { recommendationId } = req.params;
    
    await client.query('BEGIN');
    
    // Get recommendation details
    const recResult = await client.query(
      'SELECT * FROM sale_recommendations WHERE id = $1 AND status = $2',
      [recommendationId, 'pending']
    );
    
    if (recResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Recommendation not found or already processed' });
    }
    
    const recommendation = recResult.rows[0];
    
    // Update recommendation status
    await client.query(
      `UPDATE sale_recommendations 
       SET status = 'approved', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [req.user.id, recommendationId]
    );
    
    // Create sale records for each animal
    for (const animalId of recommendation.animal_ids) {
      await client.query(
        `INSERT INTO sales (animal_id, sale_price, approved_by, recommendation_id)
         SELECT id, expected_price_12m, $1, $2 FROM animals WHERE id = $3`,
        [req.user.id, recommendationId, animalId]
      );
      
      // Update animal status
      await client.query(
        `UPDATE animals SET status = 'sold', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [animalId]
      );
    }
    
    await client.query('COMMIT');
    
    // Log action
    await logAudit(
      req.user.id,
      'SALE_RECOMMENDATION_APPROVED',
      'sale_recommendation',
      recommendationId,
      { animalCount: recommendation.animal_ids.length },
      req.ip
    );
    
    res.json({ message: 'Sale recommendation approved and executed' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Approve recommendation error:', error);
    res.status(500).json({ error: 'Failed to approve recommendation' });
  } finally {
    client.release();
  }
};

/**
 * Reject Sale Recommendation
 */
export const rejectSaleRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { reason } = req.body;
    
    const result = await query(
      `UPDATE sale_recommendations 
       SET status = 'rejected', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND status = 'pending'
       RETURNING id`,
      [req.user.id, recommendationId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recommendation not found or already processed' });
    }
    
    // Log action
    await logAudit(
      req.user.id,
      'SALE_RECOMMENDATION_REJECTED',
      'sale_recommendation',
      recommendationId,
      { reason },
      req.ip
    );
    
    res.json({ message: 'Sale recommendation rejected' });
  } catch (error) {
    console.error('Reject recommendation error:', error);
    res.status(500).json({ error: 'Failed to reject recommendation' });
  }
};

/**
 * Get Dashboard Statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const stats = {};
    
    // Total users by role
    const usersResult = await query(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role`
    );
    stats.users = usersResult.rows;
    
    // Pending investors
    const pendingResult = await query(
      `SELECT COUNT(*) as count FROM users WHERE role = 'investor' AND is_verified = false`
    );
    stats.pendingInvestors = parseInt(pendingResult.rows[0].count);
    
    // Total investments
    const investmentsResult = await query(
      `SELECT 
        COUNT(*) as total_count,
        SUM(amount) as total_amount,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
       FROM investments`
    );
    stats.investments = investmentsResult.rows[0];
    
    // Total animals
    const animalsResult = await query(
      `SELECT 
        COUNT(*) as total_count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_count
       FROM animals`
    );
    stats.animals = animalsResult.rows[0];
    
    // Pending recommendations
    const recsResult = await query(
      `SELECT COUNT(*) as count FROM sale_recommendations WHERE status = 'pending'`
    );
    stats.pendingRecommendations = parseInt(recsResult.rows[0].count);
    
    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
