# 🚀 Quick Start Guide - AgroInvest Platform

## ⚡ 5-Minute Setup

### 1️⃣ Install PostgreSQL (if not installed)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Check if running:**
```bash
sudo systemctl status postgresql
```

### 2️⃣ Create Database

```bash
# Login as postgres user
sudo -u postgres psql

# Run these commands in psql:
CREATE DATABASE agro_investment;
\q
```

### 3️⃣ Configure Backend

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env file (update DATABASE_URL if needed)
nano .env
```

Update this line in `.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/agro_investment
```

### 4️⃣ Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5️⃣ Initialize Database

```bash
cd backend
npm run db:init
```

You should see:
```
✅ Database schema created successfully
✅ Admin user password set successfully

📝 Default Admin Credentials:
   Email: admin@ad.com
   Password: 123456
```

### 6️⃣ Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7️⃣ Access the Application

Open your browser:
- **Frontend**: http://localhost:3000
- **Admin Login**: admin@ad.com / 123456

---

## 📱 First Steps After Setup

### As Admin:
1. Login with admin@ad.com / 123456
2. Go to Dashboard
3. Create a Manager account
4. Verify pending Investor accounts

### As Manager:
1. Login with credentials provided by Admin
2. Change password (forced on first login)
3. Add animals to the system
4. Update market prices

### As Investor:
1. Register on the website
2. Wait for Admin approval
3. Once verified, start investing!

---

## 🛠️ Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Restart if needed
sudo systemctl restart postgresql
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
sudo lsof -t -i:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
sudo lsof -t -i:3000 | xargs kill -9
```

### Dependencies Installation Failed
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Demo Data

Want to add demo data for testing? Run these SQL commands:

```sql
-- Add demo animals
INSERT INTO animals (animal_code, type, purchase_weight, current_weight, growth_rate, district, purchase_price, expected_price_6m, expected_price_12m)
VALUES 
  ('COW-001', 'cow', 150.00, 180.00, 0.5, 'Dhaka', 45000.00, 54000.00, 63000.00),
  ('COW-002', 'cow', 140.00, 165.00, 0.4, 'Chittagong', 42000.00, 49500.00, 57750.00),
  ('GOAT-001', 'goat', 25.00, 30.00, 0.3, 'Dhaka', 8000.00, 9600.00, 11200.00);
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created: `agro_investment`
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database initialized successfully
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login as admin

---

## 🎯 Next Steps

1. **Change Admin Password**: Login and change from default
2. **Create Managers**: Add manager accounts for livestock management
3. **Invite Investors**: Share registration link
4. **Add Animals**: Start adding livestock data
5. **Set Market Prices**: Update current market prices

---

**Need Help?** Check the main README.md for detailed documentation.
