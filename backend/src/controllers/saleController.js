import { 
  calculateSaleRecommendation, 
  saveSaleRecommendation, 
  checkMaturingInvestments 
} from '../services/saleRecommendation.js';
import { logAudit } from '../middleware/auditMiddleware.js';

/**
 * Generate Sale Recommendation
 * Available to Admin and Manager
 */
export const generateRecommendation = async (req, res) => {
  try {
    const { requiredCash } = req.body;
    
    if (!requiredCash || requiredCash <= 0) {
      return res.status(400).json({ error: 'Valid required cash amount is needed' });
    }
    
    const recommendation = await saveSaleRecommendation(requiredCash, req.user.id);
    
    // Log action
    await logAudit(
      req.user.id,
      'SALE_RECOMMENDATION_GENERATED',
      'sale_recommendation',
      recommendation.recommendationId,
      { requiredCash, totalExpectedSale: recommendation.totalExpectedSale },
      req.ip
    );
    
    res.status(201).json({
      message: 'Sale recommendation generated successfully',
      recommendation
    });
  } catch (error) {
    console.error('Generate recommendation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate recommendation' 
    });
  }
};

/**
 * Preview Recommendation (without saving)
 */
export const previewRecommendation = async (req, res) => {
  try {
    const { requiredCash } = req.body;
    
    if (!requiredCash || requiredCash <= 0) {
      return res.status(400).json({ error: 'Valid required cash amount is needed' });
    }
    
    const recommendation = await calculateSaleRecommendation(requiredCash);
    
    res.json({
      message: 'Preview generated (not saved)',
      recommendation
    });
  } catch (error) {
    console.error('Preview recommendation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to preview recommendation' 
    });
  }
};

/**
 * Check Maturing Investments and Generate Recommendations
 * Scheduled job or manual trigger
 */
export const checkMaturing = async (req, res) => {
  try {
    const result = await checkMaturingInvestments();
    
    if (!result) {
      return res.json({ message: 'No maturing investments found in next 30 days' });
    }
    
    res.json({
      message: 'Maturing investments analysis complete',
      ...result
    });
  } catch (error) {
    console.error('Check maturing error:', error);
    res.status(500).json({ error: 'Failed to check maturing investments' });
  }
};
