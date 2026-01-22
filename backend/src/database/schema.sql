-- AGRO INVESTMENT PLATFORM DATABASE SCHEMA
-- PostgreSQL Database Schema for Production-Ready System

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS investment_resales CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS market_prices CASCADE;
DROP TABLE IF EXISTS animal_investments CASCADE;
DROP TABLE IF EXISTS animals CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'investor')) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    force_password_reset BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INVESTMENTS TABLE
CREATE TABLE investments (
    id SERIAL PRIMARY KEY,
    investor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    ownership_percent NUMERIC(5,2) CHECK (ownership_percent >= 0 AND ownership_percent <= 100),
    maturity_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'matured', 'sold')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANIMALS TABLE
CREATE TABLE animals (
    id SERIAL PRIMARY KEY,
    animal_code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    purchase_weight NUMERIC(6,2) NOT NULL CHECK (purchase_weight > 0),
    current_weight NUMERIC(6,2) NOT NULL CHECK (current_weight > 0),
    growth_rate NUMERIC(4,2) DEFAULT 0.00,
    district VARCHAR(100) NOT NULL,
    purchase_price NUMERIC(12,2) NOT NULL CHECK (purchase_price > 0),
    expected_price_6m NUMERIC(12,2),
    expected_price_12m NUMERIC(12,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deceased')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANIMAL INVESTMENTS (Junction Table - Many to Many)
CREATE TABLE animal_investments (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
    investment_id INTEGER REFERENCES investments(id) ON DELETE CASCADE,
    allocation_percent NUMERIC(5,2) CHECK (allocation_percent >= 0 AND allocation_percent <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(animal_id, investment_id)
);

-- MARKET PRICES TABLE
CREATE TABLE market_prices (
    id SERIAL PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    animal_type VARCHAR(50) NOT NULL,
    price_per_kg NUMERIC(8,2) NOT NULL CHECK (price_per_kg > 0),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SALES TABLE
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
    sale_price NUMERIC(12,2) NOT NULL CHECK (sale_price > 0),
    sale_weight NUMERIC(6,2),
    sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    recommendation_id INTEGER,
    notes TEXT
);

-- INVESTMENT RESALE MARKETPLACE TABLE
CREATE TABLE investment_resales (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    investment_id INTEGER REFERENCES investments(id) ON DELETE CASCADE,
    ask_price NUMERIC(12,2) NOT NULL CHECK (ask_price > 0),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BIDS TABLE
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    resale_id INTEGER REFERENCES investment_resales(id) ON DELETE CASCADE,
    bidder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bid_price NUMERIC(12,2) NOT NULL CHECK (bid_price > 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SALE RECOMMENDATIONS TABLE (New)
CREATE TABLE sale_recommendations (
    id SERIAL PRIMARY KEY,
    required_cash NUMERIC(12,2) NOT NULL,
    total_expected_sale NUMERIC(12,2),
    animal_ids INTEGER[],
    profit_impact TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_by INTEGER REFERENCES users(id),
    reviewed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_investments_investor ON investments(investor_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_animals_status ON animals(status);
CREATE INDEX idx_animals_district ON animals(district);
CREATE INDEX idx_market_prices_lookup ON market_prices(district, animal_type, recorded_at);
CREATE INDEX idx_sales_animal ON sales(animal_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Insert default admin user
-- Password: 123456 (bcrypt hash)
INSERT INTO users (email, password_hash, role, is_verified, force_password_reset, status)
VALUES ('admin@ad.com', '$2a$10$7ZqXvN5Y.KZIqGWqx3xLOeE8W8rP0yX1hO8VfHY8Z3xT7YqXvN5Y.', 'admin', true, false, 'active');
