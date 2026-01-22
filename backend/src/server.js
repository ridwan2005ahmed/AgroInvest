import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import investorRoutes from './routes/investorRoutes.js';
import saleRoutes from './routes/saleRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Agro Investment Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api/sales', saleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   � AgroInvest Platform - Backend API                ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
  console.log('📋 Available routes:');
  console.log('   - POST   /api/auth/register');
  console.log('   - POST   /api/auth/login');
  console.log('   - GET    /api/admin/dashboard');
  console.log('   - GET    /api/manager/animals');
  console.log('   - GET    /api/investor/portfolio');
  console.log('   - POST   /api/sales/generate\n');
  console.log('⏰ Started at:', new Date().toLocaleString());
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, closing server gracefully...');
  process.exit(0);
});

export default app;
