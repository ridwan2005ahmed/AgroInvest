import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔄 Initializing database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute schema
    await pool.query(schema);
    console.log('✅ Database schema created successfully');
    
    // Hash the admin password properly
    const adminPasswordHash = await bcrypt.hash('123456', 10);
    
    // Update admin user with proper password hash
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE email = 'admin@ad.com'`,
      [adminPasswordHash]
    );
    console.log('✅ Admin user password set successfully');
    
    // Insert sample market prices
    await pool.query(`
      INSERT INTO market_prices (district, animal_type, price_per_kg)
      VALUES 
        ('Dhaka', 'cow', 450.00),
        ('Dhaka', 'goat', 550.00),
        ('Chittagong', 'cow', 440.00),
        ('Chittagong', 'goat', 540.00),
        ('Rajshahi', 'cow', 430.00),
        ('Rajshahi', 'goat', 530.00),
        ('Sylhet', 'cow', 460.00),
        ('Sylhet', 'goat', 560.00)
    `);
    console.log('✅ Sample market prices inserted');
    
    console.log('\n✅ Database initialization complete!');
    console.log('\n📝 Default Admin Credentials:');
    console.log('   Email: admin@ad.com');
    console.log('   Password: 123456');
    console.log('\n⚠️  Please change the admin password after first login in production!\n');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run initialization
initializeDatabase()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
