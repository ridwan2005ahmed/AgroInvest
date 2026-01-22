import { query } from '../database/db.js';

/**
 * SALE RECOMMENDATION ALGORITHM
 * 
 * This algorithm recommends which animals to sell to meet liquidity requirements
 * while minimizing future profit loss.
 * 
 * Strategy:
 * 1. Calculate estimated sale value for each animal
 * 2. Calculate future value score (potential profit loss)
 * 3. Sort animals by lowest future value score (sell low-growth animals first)
 * 4. Use greedy selection to meet cash requirement
 * 5. Provide transparent explanation
 */

/**
 * Get current market price for an animal
 * @param {string} district - Animal's district
 * @param {string} type - Animal type
 */
const getMarketPrice = async (district, type) => {
  const result = await query(
    `SELECT price_per_kg FROM market_prices 
     WHERE district = $1 AND animal_type = $2 
     ORDER BY recorded_at DESC LIMIT 1`,
    [district, type]
  );
  
  if (result.rows.length === 0) {
    // Fallback to average price if specific district price not available
    const avgResult = await query(
      `SELECT AVG(price_per_kg) as avg_price FROM market_prices 
       WHERE animal_type = $1`,
      [type]
    );
    return avgResult.rows[0]?.avg_price || 450; // Default fallback
  }
  
  return parseFloat(result.rows[0].price_per_kg);
};

/**
 * Calculate sale recommendation
 * @param {number} requiredCash - Amount of cash needed
 * @param {object} options - Additional options
 * @returns {object} Recommendation details
 */
export const calculateSaleRecommendation = async (requiredCash, options = {}) => {
  try {
    // Get all active animals
    const animalsResult = await query(
      `SELECT * FROM animals WHERE status = 'active' ORDER BY id`
    );
    
    const animals = animalsResult.rows;
    
    if (animals.length === 0) {
      throw new Error('No active animals available for sale');
    }
    
    // Evaluate each animal
    const evaluatedAnimals = await Promise.all(
      animals.map(async (animal) => {
        const marketPrice = await getMarketPrice(animal.district, animal.type);
        
        // Calculate estimated sale value
        const saleValue = parseFloat(animal.current_weight) * marketPrice;
        
        // Calculate future value (12-month expected price)
        const futureValue = parseFloat(animal.expected_price_12m || saleValue);
        
        // Calculate potential profit loss if sold now
        const futureLoss = futureValue - saleValue;
        
        // Calculate growth potential (lower is better for sale)
        const growthPotential = futureLoss / saleValue;
        
        return {
          id: animal.id,
          animal_code: animal.animal_code,
          type: animal.type,
          current_weight: parseFloat(animal.current_weight),
          district: animal.district,
          marketPrice,
          saleValue,
          futureValue,
          futureLoss,
          growthPotential,
          // Priority score: lower is better (prioritize for sale)
          priorityScore: growthPotential
        };
      })
    );
    
    // Sort by priority score (ascending - lowest growth potential first)
    evaluatedAnimals.sort((a, b) => a.priorityScore - b.priorityScore);
    
    // Greedy selection algorithm
    const selectedAnimals = [];
    let totalSaleValue = 0;
    let totalFutureLoss = 0;
    
    for (const animal of evaluatedAnimals) {
      if (totalSaleValue >= requiredCash) {
        break; // Requirement met
      }
      
      selectedAnimals.push(animal);
      totalSaleValue += animal.saleValue;
      totalFutureLoss += animal.futureLoss;
    }
    
    // Check if requirement can be met
    if (totalSaleValue < requiredCash) {
      const totalAvailable = evaluatedAnimals.reduce((sum, a) => sum + a.saleValue, 0);
      throw new Error(
        `Cannot meet cash requirement. Required: ৳${requiredCash.toFixed(2)}, ` +
        `Maximum available: ৳${totalAvailable.toFixed(2)}`
      );
    }
    
    // Calculate profit impact
    const avgFutureLossPercent = (totalFutureLoss / totalSaleValue) * 100;
    
    // Generate explanation
    const explanation = {
      strategy: 'Low-Growth Priority Selection',
      logic: 'Selected animals with lowest growth potential to minimize future profit loss',
      selectedCount: selectedAnimals.length,
      totalAnimalsConsidered: animals.length,
      averageProfitLoss: `${avgFutureLossPercent.toFixed(2)}%`,
      breakdown: selectedAnimals.map(a => ({
        animalCode: a.animal_code,
        type: a.type,
        weight: `${a.current_weight} kg`,
        estimatedSale: `৳${a.saleValue.toFixed(2)}`,
        futureLoss: `৳${a.futureLoss.toFixed(2)}`,
        growthPotential: `${(a.growthPotential * 100).toFixed(2)}%`
      }))
    };
    
    return {
      success: true,
      requiredCash,
      totalExpectedSale: totalSaleValue,
      surplus: totalSaleValue - requiredCash,
      animalIds: selectedAnimals.map(a => a.id),
      animalCodes: selectedAnimals.map(a => a.animal_code),
      totalFutureLoss,
      profitImpact: explanation,
      animals: selectedAnimals
    };
    
  } catch (error) {
    console.error('Sale recommendation error:', error);
    throw error;
  }
};

/**
 * Save sale recommendation to database
 * @param {number} requiredCash - Required amount
 * @param {number} createdBy - User ID who created the recommendation
 */
export const saveSaleRecommendation = async (requiredCash, createdBy) => {
  try {
    const recommendation = await calculateSaleRecommendation(requiredCash);
    
    const result = await query(
      `INSERT INTO sale_recommendations 
       (required_cash, total_expected_sale, animal_ids, profit_impact, status, created_by)
       VALUES ($1, $2, $3, $4, 'pending', $5)
       RETURNING id`,
      [
        requiredCash,
        recommendation.totalExpectedSale,
        recommendation.animalIds,
        JSON.stringify(recommendation.profitImpact),
        createdBy
      ]
    );
    
    return {
      ...recommendation,
      recommendationId: result.rows[0].id
    };
  } catch (error) {
    console.error('Save recommendation error:', error);
    throw error;
  }
};

/**
 * Check for maturing investments and generate recommendations
 * Called by scheduled job or manual trigger
 */
export const checkMaturingInvestments = async () => {
  try {
    // Find investments maturing in next 30 days
    const result = await query(
      `SELECT 
         SUM(amount) as total_amount,
         COUNT(*) as investment_count
       FROM investments 
       WHERE status = 'active' 
       AND maturity_date <= CURRENT_DATE + INTERVAL '30 days'
       AND maturity_date >= CURRENT_DATE`
    );
    
    const maturingData = result.rows[0];
    
    if (maturingData.investment_count > 0) {
      const requiredCash = parseFloat(maturingData.total_amount);
      
      console.log(`📊 Found ${maturingData.investment_count} maturing investments`);
      console.log(`💰 Required liquidity: ৳${requiredCash.toFixed(2)}`);
      
      // Generate recommendation
      const recommendation = await calculateSaleRecommendation(requiredCash);
      
      return {
        maturingInvestments: maturingData.investment_count,
        requiredCash,
        recommendation
      };
    }
    
    return null;
  } catch (error) {
    console.error('Check maturing investments error:', error);
    throw error;
  }
};
