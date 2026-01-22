# 🍃 AgroInvest Platform - Complete Agro-Investment & Livestock Management System

**Status:** ✅ All features implemented and running successfully

A production-grade web platform enabling urban and rural investors to participate in organized livestock production cycles. Built with modern technologies for security, scalability, and transparency.

## 🚀 Quick Start

**Both servers are currently running:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

**Login Credentials:**
- Admin: admin@ad.com / 123456
- Create Manager/Investor accounts after logging in

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [User Roles & Access](#user-roles--access)
- [API Documentation](#api-documentation)
- [Core Algorithms](#core-algorithms)
- [Security Features](#security-features)
- [Project Structure](#project-structure)

## ✨ Features

### Core Functionality
- **Role-Based Access Control**: Admin, Manager, and Investor roles with specific permissions
- **Investment Management**: Create and track livestock investments with estimated returns
- **Livestock Tracking**: Complete animal lifecycle management with growth metrics
- **Sale Recommendation Algorithm**: Intelligent system recommends animals to sell based on liquidity needs
- **Internal Resale Marketplace**: Investors can trade investment units before maturity
- **Market Price Management**: Real-time market price updates by district and animal type
- **Audit Logging**: Complete trail of all system actions

### User Roles

#### 🔐 Admin
- **Credentials**: admin@ad.com / 123456 (⚠️ Change in production!)
- Create Manager accounts
- Verify/reject Investor accounts
- Approve/reject sale recommendations
- Override system decisions
- View complete system analytics

#### 🧑‍🔧 Manager
- Cannot self-register (Admin creates account)
- Must change password on first login
- Add and update livestock data
- Record market prices
- Execute approved sales
- Manage farmer applications

#### 👤 Investor
- Self-register via website
- Pending status until Admin approval
- Make investments (6/12-month cycles)
- View estimated portfolio returns
- List investments for resale
- Bid on other investments

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **ORM**: Raw SQL queries for transparency

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons

## 🏗️ System Architecture

```
┌─────────────────┐
│   Next.js UI    │
│  (Port 3000)    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express API    │
│  (Port 5000)    │
└────────┬────────┘
         │
         │ pg driver
         │
┌────────▼────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 14 or higher
- npm or yarn package manager

### Step 1: Clone Repository
```bash
cd /mnt/01DBC1CF3524D940/project-26/agro-investment-platform
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database
```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE agro_investment;

# Create user (optional)
CREATE USER agro_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE agro_investment TO agro_user;

# Exit
\q
```

### Step 2: Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/agro_investment
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Initialize Database Schema
```bash
cd backend
npm run db:init
```

This will:
- Create all required tables
- Set up indexes
- Insert default admin user
- Add sample market prices

### Expected Output:
```
🔄 Initializing database...
✅ Database schema created successfully
✅ Admin user password set successfully
✅ Sample market prices inserted

✅ Database initialization complete!

📝 Default Admin Credentials:
   Email: admin@ad.com
   Password: 123456

⚠️  Please change the admin password after first login in production!
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════════════════╗
║   � AgroInvest Platform - Backend API                ║
╚════════════════════════════════════════════════════════╝

✅ Server running on port 5000
🔗 API URL: http://localhost:5000
🏥 Health check: http://localhost:5000/health
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Expected output:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 👥 User Roles & Access

### Default Login Credentials

```
Admin Login:
Email: admin@ad.com
Password: 123456
```

### First-Time Setup Flow

1. **Admin** logs in with default credentials
2. **Admin** creates Manager account(s)
3. **Investors** self-register on website
4. **Admin** verifies pending Investor accounts
5. **Manager** receives email with temporary password
6. **Manager** must change password on first login
7. **Verified Investors** can start investing

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication
```
POST   /api/auth/register          - Register new investor
POST   /api/auth/login             - Login
POST   /api/auth/change-password   - Change password
GET    /api/auth/profile           - Get user profile
```

#### Admin
```
POST   /api/admin/managers                              - Create manager
GET    /api/admin/investors/pending                     - Get pending investors
PUT    /api/admin/investors/:id/verify                  - Verify investor
GET    /api/admin/sale-recommendations                  - Get sale recommendations
PUT    /api/admin/sale-recommendations/:id/approve      - Approve sale
```

#### Manager
```
POST   /api/manager/animals           - Add new animal
PUT    /api/manager/animals/:id       - Update animal
GET    /api/manager/animals           - Get all animals
POST   /api/manager/market-prices     - Update market price
POST   /api/manager/sales             - Record sale
```

#### Investor
```
GET    /api/investor/portfolio                 - Get portfolio
POST   /api/investor/investments               - Create investment
POST   /api/investor/resale/list               - List investment for resale
GET    /api/investor/resale/listings           - Browse marketplace
POST   /api/investor/resale/bid                - Place bid
POST   /api/investor/resale/accept-bid         - Accept bid
```

#### Sale Recommendations
```
POST   /api/sales/generate         - Generate sale recommendation
POST   /api/sales/preview          - Preview recommendation (no save)
GET    /api/sales/check-maturing   - Check maturing investments
```

## 🧮 Core Algorithms

### Sale Recommendation Algorithm

**Purpose**: Recommend which animals to sell to meet cash requirements while minimizing future profit loss.

**Strategy**:
1. Calculate estimated sale value for each active animal
2. Calculate future value score (12-month expected price)
3. Compute potential profit loss if sold now
4. Sort animals by growth potential (ascending)
5. Greedy selection - select lowest-growth animals first
6. Continue until cash requirement is met

**Code Location**: `backend/src/services/saleRecommendation.js`

**Example**:
```javascript
// Required cash: ৳50,000
// System analyzes all active animals
// Selects animals with lowest future growth potential
// Ensures minimal impact on overall profitability
```

### Investment Return Calculation

**6-Month Investment**: 10% estimated return  
**12-Month Investment**: 15% estimated return

Returns are estimates based on:
- Historical market data
- Animal growth rates
- District-specific prices
- Seasonal variations

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based auth with expiration
2. **Password Hashing**: bcrypt with salt rounds
3. **Role-Based Access**: Middleware enforces role permissions
4. **Force Password Reset**: Managers must change initial password
5. **Account Verification**: Investors require admin approval
6. **Audit Logging**: All critical actions logged with user ID and timestamp
7. **SQL Injection Prevention**: Parameterized queries
8. **CORS Configuration**: Restricted to frontend domain

## 📁 Project Structure

```
agro-investment-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   ├── managerController.js
│   │   │   ├── investorController.js
│   │   │   └── saleController.js
│   │   ├── middleware/         # Auth & audit middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── auditMiddleware.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── managerRoutes.js
│   │   │   ├── investorRoutes.js
│   │   │   └── saleRoutes.js
│   │   ├── services/          # Business logic
│   │   │   └── saleRecommendation.js
│   │   ├── database/          # Database config
│   │   │   ├── db.js
│   │   │   ├── schema.sql
│   │   │   └── init.js
│   │   └── server.js          # Express app
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── app/                   # Next.js App Router
    │   ├── admin/            # Admin pages
    │   ├── manager/          # Manager pages
    │   ├── investor/         # Investor pages
    │   ├── login/
    │   ├── register/
    │   ├── page.tsx          # Landing page
    │   └── layout.tsx
    ├── components/           # Reusable components
    │   ├── Navbar.tsx
    │   ├── DashboardLayout.tsx
    │   └── StatCard.tsx
    ├── lib/                  # Utilities
    │   ├── api.ts           # Axios instance
    │   └── services.ts      # API service functions
    ├── package.json
    └── .env.local.example
```

## 🧪 Testing

### Manual Testing Flow

1. **Test Admin Functions**:
   - Login as admin
   - Create a manager account
   - Verify pending investors

2. **Test Manager Functions**:
   - Login as manager
   - Add new animals
   - Update market prices
   - Record sales

3. **Test Investor Functions**:
   - Register new investor
   - Admin verifies account
   - Create investments
   - Browse resale marketplace

4. **Test Sale Recommendations**:
   - Manager/Admin generates recommendation
   - System calculates optimal animals to sell
   - Admin approves recommendation
   - Animals marked as sold

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secret (32+ characters)
3. Enable SSL for PostgreSQL
4. Configure CORS for production domain
5. Change default admin password immediately
6. Set up automated backups for PostgreSQL
7. Configure rate limiting
8. Enable logging and monitoring

### Recommended Hosting
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify
- **Database**: Heroku Postgres, AWS RDS, DigitalOcean Managed DB

## 📝 License

MIT License - This is a complete production-ready system for educational and commercial use.

## 🤝 Support

For issues or questions, refer to the inline code documentation. All critical functions include detailed comments explaining business logic and security considerations.

---

**Built with ❤️ for sustainable agriculture and transparent investment**
