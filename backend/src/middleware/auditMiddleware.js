import { query } from '../database/db.js';

/**
 * Log user action to audit log
 * @param {number} userId - User ID
 * @param {string} action - Action description
 * @param {string} entityType - Type of entity (animal, investment, etc.)
 * @param {number} entityId - Entity ID
 * @param {object} details - Additional details
 * @param {string} ipAddress - User's IP address
 */
export const logAudit = async (userId, action, entityType = null, entityId = null, details = {}, ipAddress = null) => {
  try {
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, entityType, entityId, JSON.stringify(details), ipAddress]
    );
  } catch (error) {
    console.error('Audit log error:', error);
    // Don't throw - audit logging should not break the main flow
  }
};

/**
 * Middleware to automatically log API requests
 */
export const auditMiddleware = (action) => {
  return async (req, res, next) => {
    if (req.user) {
      const ipAddress = req.ip || req.connection.remoteAddress;
      await logAudit(
        req.user.id,
        action,
        null,
        null,
        { 
          method: req.method, 
          path: req.path,
          params: req.params,
          body: req.body
        },
        ipAddress
      );
    }
    next();
  };
};
