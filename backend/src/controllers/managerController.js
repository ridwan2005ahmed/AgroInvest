import { query } from '../database/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

/**
 * Add New Animal
 */
export const addAnimal = async (req, res) => {
  try {
    const {
      animalType,
      currentWeight,
      healthScore,
      location,
      status,
      purchaseDate,
      purchasePrice
    } = req.body;
    
    // Validation
    if (!animalType || !currentWeight || !healthScore || !location || !purchasePrice || !purchaseDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert animal
    const result = await query(
      `INSERT INTO animals (
        type, current_weight, growth_rate, district, purchase_price, 
        expected_price_6m, expected_price_12m, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        animalType,
        currentWeight,
        healthScore || 8,
        location,
        purchasePrice,
        purchasePrice * 1.1, // 6m estimate
        purchasePrice * 1.2, // 12m estimate
        status || 'active'
      ]
    );
    
    const animal = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'ANIMAL_ADDED',
      'animal',
      animal.id,
      { animalType, location },
      req.ip
    );
    
    res.status(201).json({
      message: 'Animal added successfully',
      animal: {
        id: animal.id,
        animalType: animal.type,
        currentWeight: parseFloat(animal.current_weight),
        healthScore: animal.growth_rate,
        location: animal.district,
        status: animal.status,
        purchaseDate: purchaseDate,
        purchasePrice: parseFloat(animal.purchase_price)
      }
    });
  } catch (error) {
    console.error('Add animal error:', error);
    res.status(500).json({ error: 'Failed to add animal' });
  }
};

/**
 * Update Animal Data
 */
export const updateAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const {
      animalType,
      currentWeight,
      healthScore,
      location,
      status
    } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (animalType) {
      updates.push(`type = $${paramCount++}`);
      values.push(animalType);
    }
    
    if (currentWeight !== undefined) {
      updates.push(`current_weight = $${paramCount++}`);
      values.push(currentWeight);
    }
    
    if (healthScore !== undefined) {
      updates.push(`growth_rate = $${paramCount++}`);
      values.push(healthScore);
    }
    
    if (location) {
      updates.push(`district = $${paramCount++}`);
      values.push(location);
    }
    
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(animalId);
    
    const result = await query(
      `UPDATE animals SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    const animal = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'ANIMAL_UPDATED',
      'animal',
      animal.id,
      { updates: req.body },
      req.ip
    );
    
    res.json({
      message: 'Animal updated successfully',
      animal: {
        id: animal.id,
        animalType: animal.type,
        currentWeight: parseFloat(animal.current_weight),
        healthScore: animal.growth_rate,
        location: animal.district,
        status: animal.status,
        purchaseDate: animal.created_at,
        purchasePrice: parseFloat(animal.purchase_price)
      }
    });
  } catch (error) {
    console.error('Update animal error:', error);
    res.status(500).json({ error: 'Failed to update animal' });
  }
};

/**
 * Get All Animals
 */
export const getAllAnimals = async (req, res) => {
  try {
    const { status, type, district } = req.query;
    
    let queryText = 'SELECT * FROM animals WHERE 1=1';
    const params = [];
    
    if (status) {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    }
    
    if (type) {
      params.push(type);
      queryText += ` AND type = $${params.length}`;
    }
    
    if (district) {
      params.push(district);
      queryText += ` AND district = $${params.length}`;
    }
    
    queryText += ' ORDER BY created_at DESC';
    
    const result = await query(queryText, params);
    
    const animals = result.rows.map(a => ({
      id: a.id,
      animalType: a.type,
      currentWeight: parseFloat(a.current_weight || 0),
      healthScore: a.growth_rate || 8,
      location: a.district,
      status: a.status,
      purchaseDate: a.created_at,
      purchasePrice: parseFloat(a.purchase_price || 0)
    }));
    
    res.json(animals);
  } catch (error) {
    console.error('Get animals error:', error);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
};

/**
 * Get Single Animal Details
 */
export const getAnimalById = async (req, res) => {
  try {
    const { animalId } = req.params;
    
    const result = await query(
      'SELECT * FROM animals WHERE id = $1',
      [animalId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    res.json({ animal: result.rows[0] });
  } catch (error) {
    console.error('Get animal error:', error);
    res.status(500).json({ error: 'Failed to fetch animal' });
  }
};

/**
 * Update Market Price
 */
export const updateMarketPrice = async (req, res) => {
  try {
    const { district, animalType, pricePerKg } = req.body;
    
    if (!district || !animalType || !pricePerKg) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const result = await query(
      `INSERT INTO market_prices (district, animal_type, price_per_kg)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [district, animalType, pricePerKg]
    );
    
    const marketPrice = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'MARKET_PRICE_UPDATED',
      'market_price',
      marketPrice.id,
      { district, animalType, pricePerKg },
      req.ip
    );
    
    res.status(201).json({
      message: 'Market price updated successfully',
      marketPrice
    });
  } catch (error) {
    console.error('Update market price error:', error);
    res.status(500).json({ error: 'Failed to update market price' });
  }
};

/**
 * Get Market Prices
 */
export const getMarketPrices = async (req, res) => {
  try {
    const { district, animalType } = req.query;
    
    let queryText = 'SELECT * FROM market_prices WHERE 1=1';
    const params = [];
    
    if (district) {
      params.push(district);
      queryText += ` AND district = $${params.length}`;
    }
    
    if (animalType) {
      params.push(animalType);
      queryText += ` AND animal_type = $${params.length}`;
    }
    
    queryText += ' ORDER BY recorded_at DESC LIMIT 100';
    
    const result = await query(queryText, params);
    
    const prices = result.rows.map(p => ({
      id: p.id,
      animalType: p.animal_type,
      district: p.district,
      pricePerKg: parseFloat(p.price_per_kg || 0),
      recordedAt: p.recorded_at
    }));
    
    res.json(prices);
  } catch (error) {
    console.error('Get market prices error:', error);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
};

/**
 * Record Sale Execution
 */
export const recordSale = async (req, res) => {
  try {
    const {
      saleRecommendationId,
      animalId,
      actualWeight,
      actualPricePerKg,
      totalSaleValue
    } = req.body;
    
    if (!animalId || !actualWeight || !actualPricePerKg) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check animal exists and is active
    const animalResult = await query(
      'SELECT * FROM animals WHERE id = $1',
      [animalId]
    );
    
    if (animalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    
    const calculatedTotal = actualWeight * actualPricePerKg;
    
    // Record sale
    const saleResult = await query(
      `INSERT INTO sales (animal_id, sale_price, sale_weight, approved_by, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [animalId, calculatedTotal, actualWeight, req.user.id, `Recommendation: ${saleRecommendationId || 'Manual'}`]
    );
    
    // Update animal status
    await query(
      `UPDATE animals SET status = 'sold', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [animalId]
    );
    
    const sale = saleResult.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'SALE_RECORDED',
      'sale',
      sale.id,
      { animalId, totalSaleValue: calculatedTotal },
      req.ip
    );
    
    res.status(201).json({
      message: 'Sale recorded successfully',
      sale: {
        id: sale.id,
        saleRecommendationId: saleRecommendationId || null,
        animalId: sale.animal_id,
        actualWeight,
        actualPricePerKg,
        totalSaleValue: calculatedTotal,
        executedAt: sale.sold_at
      }
    });
  } catch (error) {
    console.error('Record sale error:', error);
    res.status(500).json({ error: 'Failed to record sale' });
  }
};

/**
 * Get All Sales
 */
export const getSales = async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, a.type as animal_type
       FROM sales s
       LEFT JOIN animals a ON s.animal_id = a.id
       ORDER BY s.sold_at DESC`
    );
    
    const sales = result.rows.map(s => ({
      id: s.id,
      saleRecommendationId: null,
      animalId: s.animal_id,
      actualWeight: parseFloat(s.sale_weight || 0),
      actualPricePerKg: s.sale_weight > 0 ? parseFloat(s.sale_price) / parseFloat(s.sale_weight) : 0,
      totalSaleValue: parseFloat(s.sale_price || 0),
      executedAt: s.sold_at,
      animalType: s.animal_type,
      estimatedValue: null
    }));
    
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

/**
 * Get Dashboard Statistics for Manager
 */
export const getManagerDashboard = async (req, res) => {
  try {
    const stats = {};
    
    // Animals statistics
    const animalsResult = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold,
        SUM(CASE WHEN status = 'active' THEN current_weight ELSE 0 END) as total_weight
       FROM animals`
    );
    stats.animals = animalsResult.rows[0];
    
    // Recent sales
    const salesResult = await query(
      `SELECT s.*, a.animal_code, a.type 
       FROM sales s
       JOIN animals a ON s.animal_id = a.id
       ORDER BY s.sold_at DESC
       LIMIT 10`
    );
    stats.recentSales = salesResult.rows;
    
    // Latest market prices
    const pricesResult = await query(
      `SELECT DISTINCT ON (district, animal_type) *
       FROM market_prices
       ORDER BY district, animal_type, recorded_at DESC`
    );
    stats.latestPrices = pricesResult.rows;
    
    res.json({ stats });
  } catch (error) {
    console.error('Get manager dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
