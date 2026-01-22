import { query, getClient } from '../database/db.js';
import { logAudit } from '../middleware/auditMiddleware.js';

/**
 * Get Investor Portfolio
 */
export const getPortfolio = async (req, res) => {
  try {
    const investorId = req.user.id;
    
    // Get all investments
    const investmentsResult = await query(
      `SELECT * FROM investments 
       WHERE investor_id = $1 
       ORDER BY created_at DESC`,
      [investorId]
    );
    
    const investments = investmentsResult.rows;
    
    // Calculate total portfolio value
    let totalInvested = 0;
    let totalCurrentValue = 0;
    
    for (const investment of investments) {
      totalInvested += parseFloat(investment.amount);
      
      // Estimate current value based on maturity progress
      const maturityDate = new Date(investment.maturity_date);
      const createdDate = new Date(investment.created_at);
      const today = new Date();
      
      const totalDays = (maturityDate - createdDate) / (1000 * 60 * 60 * 24);
      const daysPassed = (today - createdDate) / (1000 * 60 * 60 * 24);
      const progress = Math.min(daysPassed / totalDays, 1);
      
      // Estimate 15% annual return (proportional to progress)
      const estimatedReturn = parseFloat(investment.amount) * 0.15 * progress;
      totalCurrentValue += parseFloat(investment.amount) + estimatedReturn;
    }
    
    res.json({
      portfolio: {
        totalInvested,
        totalCurrentValue,
        estimatedProfit: totalCurrentValue - totalInvested,
        profitPercentage: totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(2) : 0,
        investmentCount: investments.length
      },
      investments
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

/**
 * Create New Investment
 */
export const createInvestment = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { amount, maturityPeriod } = req.body;
    
    // Validation
    if (!amount || !maturityPeriod) {
      return res.status(400).json({ error: 'Amount and maturity period are required' });
    }
    
    if (amount < 1000) {
      return res.status(400).json({ error: 'Minimum investment amount is ৳1,000' });
    }
    
    if (![6, 12].includes(maturityPeriod)) {
      return res.status(400).json({ error: 'Maturity period must be 6 or 12 months' });
    }
    
    // Calculate maturity date
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + maturityPeriod);
    
    // Calculate estimated returns (example: 10% for 6 months, 15% for 12 months)
    const returnRate = maturityPeriod === 6 ? 0.10 : 0.15;
    const estimatedReturn = amount * returnRate;
    
    // Create investment
    const result = await query(
      `INSERT INTO investments (investor_id, amount, maturity_date, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING *`,
      [investorId, amount, maturityDate]
    );
    
    const investment = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'INVESTMENT_CREATED',
      'investment',
      investment.id,
      { amount, maturityPeriod, estimatedReturn },
      req.ip
    );
    
    res.status(201).json({
      message: 'Investment created successfully',
      investment: {
        ...investment,
        estimatedReturn,
        maturityPeriod
      }
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Failed to create investment' });
  }
};

/**
 * Get Investment Details
 */
export const getInvestmentDetails = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const investorId = req.user.id;
    
    const result = await query(
      `SELECT * FROM investments 
       WHERE id = $1 AND investor_id = $2`,
      [investmentId, investorId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    const investment = result.rows[0];
    
    // Get allocated animals
    const animalsResult = await query(
      `SELECT a.*, ai.allocation_percent
       FROM animals a
       JOIN animal_investments ai ON a.id = ai.animal_id
       WHERE ai.investment_id = $1`,
      [investmentId]
    );
    
    res.json({
      investment,
      allocatedAnimals: animalsResult.rows
    });
  } catch (error) {
    console.error('Get investment details error:', error);
    res.status(500).json({ error: 'Failed to fetch investment details' });
  }
};

/**
 * List Investment for Resale
 */
export const listInvestmentForResale = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { investmentId, askPrice } = req.body;
    
    if (!investmentId || !askPrice) {
      return res.status(400).json({ error: 'Investment ID and ask price are required' });
    }
    
    // Verify ownership
    const investmentResult = await query(
      `SELECT * FROM investments 
       WHERE id = $1 AND investor_id = $2 AND status = 'active'`,
      [investmentId, investorId]
    );
    
    if (investmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Investment not found or not available for resale' });
    }
    
    // Check if already listed
    const existingListing = await query(
      `SELECT id FROM investment_resales 
       WHERE investment_id = $1 AND status = 'open'`,
      [investmentId]
    );
    
    if (existingListing.rows.length > 0) {
      return res.status(409).json({ error: 'Investment already listed for resale' });
    }
    
    // Create resale listing
    const result = await query(
      `INSERT INTO investment_resales (seller_id, investment_id, ask_price, status)
       VALUES ($1, $2, $3, 'open')
       RETURNING *`,
      [investorId, investmentId, askPrice]
    );
    
    const listing = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'INVESTMENT_LISTED_FOR_RESALE',
      'investment_resale',
      listing.id,
      { investmentId, askPrice },
      req.ip
    );
    
    res.status(201).json({
      message: 'Investment listed for resale successfully',
      listing
    });
  } catch (error) {
    console.error('List for resale error:', error);
    res.status(500).json({ error: 'Failed to list investment for resale' });
  }
};

/**
 * Get Resale Marketplace Listings
 */
export const getResaleListings = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         ir.*,
         i.amount as investment_amount,
         i.maturity_date,
         u.email as seller_email
       FROM investment_resales ir
       JOIN investments i ON ir.investment_id = i.id
       JOIN users u ON ir.seller_id = u.id
       WHERE ir.status = 'open'
       ORDER BY ir.created_at DESC`
    );
    
    const listings = result.rows.map(row => ({
      id: row.id,
      investmentId: row.investment_id,
      sellerId: row.seller_id,
      sellerName: row.seller_email,
      askingPrice: parseFloat(row.asking_price || 0),
      ownershipPercentage: 100,
      originalInvestment: parseFloat(row.investment_amount || 0),
      estimatedValue: parseFloat(row.investment_amount || 0) * 1.2,
      maturityDate: row.maturity_date,
      status: row.status,
      createdAt: row.created_at,
      bidCount: 0
    }));
    
    res.json(listings);
  } catch (error) {
    console.error('Get resale listings error:', error);
    res.status(500).json({ error: 'Failed to fetch resale listings' });
  }
};

/**
 * Place Bid on Investment
 */
export const placeBid = async (req, res) => {
  try {
    const bidderId = req.user.id;
    const { resaleId, bidAmount } = req.body;
    
    if (!resaleId || !bidAmount) {
      return res.status(400).json({ error: 'Resale ID and bid amount are required' });
    }
    
    // Verify resale listing exists
    const resaleResult = await query(
      `SELECT * FROM investment_resales WHERE id = $1 AND status = 'open'`,
      [resaleId]
    );
    
    if (resaleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Resale listing not found or closed' });
    }
    
    const resale = resaleResult.rows[0];
    
    // Prevent bidding on own listing
    if (resale.seller_id === bidderId) {
      return res.status(400).json({ error: 'Cannot bid on your own listing' });
    }
    
    // Create bid
    const result = await query(
      `INSERT INTO bids (resale_id, bidder_id, bid_price, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [resaleId, bidderId, bidAmount]
    );
    
    const bid = result.rows[0];
    
    // Log action
    await logAudit(
      req.user.id,
      'BID_PLACED',
      'bid',
      bid.id,
      { resaleId, bidAmount },
      req.ip
    );
    
    res.status(201).json({
      message: 'Bid placed successfully',
      bid
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
};

/**
 * Accept Bid (Transfer Ownership)
 */
export const acceptBid = async (req, res) => {
  const client = await getClient();
  
  try {
    const sellerId = req.user.id;
    const { bidId } = req.params;
    
    if (!bidId) {
      return res.status(400).json({ error: 'Bid ID is required' });
    }
    
    await client.query('BEGIN');
    
    // Get bid details
    const bidResult = await client.query(
      `SELECT b.*, ir.seller_id, ir.investment_id
       FROM bids b
       JOIN investment_resales ir ON b.resale_id = ir.id
       WHERE b.id = $1 AND b.status = 'pending'`,
      [bidId]
    );
    
    if (bidResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Bid not found or already processed' });
    }
    
    const bid = bidResult.rows[0];
    
    // Verify ownership
    if (bid.seller_id !== sellerId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Transfer investment ownership
    await client.query(
      `UPDATE investments SET investor_id = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [bid.bidder_id, bid.investment_id]
    );
    
    // Update bid status
    await client.query(
      `UPDATE bids SET status = 'accepted', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [bidId]
    );
    
    // Close resale listing
    await client.query(
      `UPDATE investment_resales SET status = 'closed', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [bid.resale_id]
    );
    
    // Reject other pending bids
    await client.query(
      `UPDATE bids SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
       WHERE resale_id = $1 AND id != $2 AND status = 'pending'`,
      [bid.resale_id, bidId]
    );
    
    await client.query('COMMIT');
    
    // Log action
    await logAudit(
      req.user.id,
      'BID_ACCEPTED_OWNERSHIP_TRANSFERRED',
      'bid',
      bidId,
      { investmentId: bid.investment_id, newOwnerId: bid.bidder_id },
      req.ip
    );
    
    res.json({ message: 'Bid accepted and ownership transferred successfully' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Accept bid error:', error);
    res.status(500).json({ error: 'Failed to accept bid' });
  } finally {
    client.release();
  }
};

/**
 * Get My Resale Listings
 */
export const getMyListings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    const result = await query(
      `SELECT ir.*, i.amount, i.maturity_date, i.created_at as investment_created,
        (SELECT COUNT(*) FROM bids WHERE resale_id = ir.id AND status = 'pending') as bid_count
       FROM investment_resales ir
       JOIN investments i ON ir.investment_id = i.id
       WHERE ir.seller_id = $1
       ORDER BY ir.created_at DESC`,
      [sellerId]
    );
    
    const listings = result.rows.map(l => ({
      id: l.id,
      investmentId: l.investment_id,
      sellerId: l.seller_id,
      sellerName: 'You',
      askingPrice: parseFloat(l.asking_price || 0),
      ownershipPercentage: 100,
      originalInvestment: parseFloat(l.amount || 0),
      estimatedValue: parseFloat(l.amount || 0) * 1.2,
      maturityDate: l.maturity_date,
      status: l.status,
      createdAt: l.created_at,
      bidCount: parseInt(l.bid_count || 0)
    }));
    
    res.json(listings);
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

/**
 * Get My Bids
 */
export const getMyBids = async (req, res) => {
  try {
    const bidderId = req.user.id;
    
    const result = await query(
      `SELECT b.*, ir.asking_price, ir.status as listing_status,
        i.amount as investment_amount, u.email as seller_email
       FROM bids b
       JOIN investment_resales ir ON b.resale_id = ir.id
       JOIN investments i ON ir.investment_id = i.id
       LEFT JOIN users u ON ir.seller_id = u.id
       WHERE b.bidder_id = $1
       ORDER BY b.created_at DESC`,
      [bidderId]
    );
    
    const bids = result.rows.map(b => ({
      id: b.id,
      resaleId: b.resale_id,
      bidderId: b.bidder_id,
      bidderName: b.seller_email || 'Seller',
      bidAmount: parseFloat(b.bid_price || 0),
      status: b.status,
      createdAt: b.created_at
    }));
    
    res.json(bids);
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
};

/**
 * Get Investor Dashboard Statistics
 */
export const getInvestorDashboard = async (req, res) => {
  try {
    const investorId = req.user.id;
    
    // Portfolio summary
    const portfolioResult = await query(
      `SELECT 
        COUNT(*) as total_investments,
        SUM(amount) as total_invested,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_investments
       FROM investments 
       WHERE investor_id = $1`,
      [investorId]
    );
    
    const portfolio = portfolioResult.rows[0];
    
    // Active resale listings
    const resaleResult = await query(
      `SELECT COUNT(*) as count
       FROM investment_resales 
       WHERE seller_id = $1 AND status = 'open'`,
      [investorId]
    );
    
    const activeListings = parseInt(resaleResult.rows[0].count);
    
    // Pending bids
    const bidsResult = await query(
      `SELECT COUNT(*) as count
       FROM bids 
       WHERE bidder_id = $1 AND status = 'pending'`,
      [investorId]
    );
    
    const pendingBids = parseInt(bidsResult.rows[0].count);
    
    res.json({
      dashboard: {
        portfolio,
        activeListings,
        pendingBids
      }
    });
  } catch (error) {
    console.error('Get investor dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
