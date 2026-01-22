# 🆓 Free Hosting Guide - AgroInvest Platform

## ✅ Recommended Free Hosting (Best Option)

### Option 1: Render.com (Easiest & All-in-One)
**FREE Tier includes:**
- ✅ Web Service (Backend API)
- ✅ PostgreSQL Database (90 days free, then restarts)
- ✅ Static Site (Frontend)

**Steps:**

#### 1. Deploy Backend + Database on Render
1. Go to: https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"PostgreSQL"**
   - Name: `agroinvest-db`
   - Database: `agro_investment`
   - User: `postgres`
   - Region: `Singapore` (closest to Bangladesh)
   - Click **"Create Database"**
   - ⚠️ Copy the **Internal Database URL** (keep it safe!)

4. Click **"New +"** → **"Web Service"**
   - Connect your GitHub repo: `ridwan2005ahmed/AgroInvest`
   - Name: `agroinvest-api`
   - Region: `Singapore`
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   
5. **Environment Variables** (Add these):
   ```
   NODE_ENV=production
   DATABASE_URL=<paste your Internal Database URL>
   JWT_SECRET=your-super-secret-key-change-this-12345
   JWT_EXPIRES_IN=7d
   PORT=5000
   ```

6. Click **"Create Web Service"**
   - ⏳ Wait 5-10 minutes for deployment
   - ✅ Your API will be live at: `https://agroinvest-api.onrender.com`

#### 2. Initialize Database
After backend deploys:
```bash
# Get your database connection string from Render
# Run this on your local machine:
PGPASSWORD=<your-db-password> psql -h <host> -U postgres -d agro_investment -f backend/src/database/schema.sql
```

Or use Render's web shell:
1. Go to your PostgreSQL database in Render
2. Click **"Connect"** → **"External Connection"**
3. Use provided command to connect
4. Copy-paste contents of `backend/src/database/schema.sql`

#### 3. Deploy Frontend on Vercel (Free & Fast)
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Import: `ridwan2005ahmed/AgroInvest`
5. Settings:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   
6. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://agroinvest-api.onrender.com
   ```

7. Click **"Deploy"**
   - ✅ Live in 2-3 minutes at: `https://agroinvest-xyz.vercel.app`

---

## Option 2: Railway.app (Alternative)

**FREE Tier:**
- $5 free credit monthly
- PostgreSQL included
- Auto-deploy from GitHub

**Steps:**
1. Go to: https://railway.app
2. Sign up with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Select `ridwan2005ahmed/AgroInvest`
5. Railway auto-detects Node.js
6. Add PostgreSQL plugin
7. Set environment variables
8. Deploy!

**Frontend:** Deploy on Vercel (same as above)

---

## Option 3: Netlify + Supabase (Alternative)

### Backend → Netlify Functions (Serverless)
- Requires converting Express to serverless functions
- More complex setup

### Database → Supabase (Best free PostgreSQL)
1. Go to: https://supabase.com
2. Create project
3. Get connection string
4. Free 500MB database forever!

---

## ⚠️ Important Notes for Free Hosting

### Render.com Free Tier Limitations:
- ❌ Apps **sleep after 15 minutes** of inactivity
- ❌ Takes **30-60 seconds** to wake up on first request
- ✅ Database: 90 days free, then need to create new one
- ✅ 750 hours/month free (enough for 1 app)

### How to Keep App Awake (Optional):
Use a free uptime monitor:
- https://uptimerobot.com (free)
- Ping your API every 14 minutes
- Keeps backend alive 24/7

---

## 🚀 Quick Start - Recommended Setup

### Total Cost: **$0/month**

1. **Database:** Render PostgreSQL (free 90 days, renewable)
2. **Backend API:** Render Web Service (free with sleep)
3. **Frontend:** Vercel (free forever)

### Expected Performance:
- ✅ Frontend: Super fast (CDN)
- ⚠️ Backend: Slow first request (30s), then fast
- ✅ Database: Good performance

---

## 💰 If You Want Faster Performance Later

### Paid Options (Very Cheap):
- **Render:** $7/month (no sleep, always on)
- **Railway:** ~$5/month (pay as you go)
- **DigitalOcean:** $12/month (full VPS control)

---

## 📝 Step-by-Step Guide for Beginners

### 1. Create Render Account
```
→ Go to render.com
→ Click "Get Started for Free"
→ Sign up with GitHub
→ Authorize Render
```

### 2. Create Database
```
→ Dashboard → "New +"
→ Click "PostgreSQL"
→ Name: agroinvest-db
→ Click "Create Database"
→ Copy "Internal Database URL"
```

### 3. Deploy Backend
```
→ Dashboard → "New +"
→ Click "Web Service"
→ Connect GitHub repo
→ Select: ridwan2005ahmed/AgroInvest
→ Root Directory: backend
→ Build: npm install
→ Start: npm start
→ Add Environment Variables (see above)
→ Click "Create Web Service"
```

### 4. Initialize Database Schema
```
→ Go to your database in Render
→ Click "Connect"
→ Use PSQL command shown
→ Paste contents of backend/src/database/schema.sql
→ Press Enter
```

### 5. Deploy Frontend on Vercel
```
→ Go to vercel.com
→ Sign up with GitHub
→ "Add New Project"
→ Import: ridwan2005ahmed/AgroInvest
→ Root: frontend
→ Add env: NEXT_PUBLIC_API_URL
→ Click "Deploy"
```

### 6. Test Your Live Site
```
→ Frontend: https://agroinvest-xyz.vercel.app
→ Backend: https://agroinvest-api.onrender.com/health
→ Login with: admin@ad.com / 123456
```

---

## 🎯 Best Choice for You

**I recommend: Render + Vercel**

**Why?**
- ✅ Completely free
- ✅ Easy setup (30 minutes)
- ✅ GitHub auto-deploy
- ✅ Custom domain support
- ✅ SSL certificate included
- ✅ Good for portfolio/demo

**Limitations:**
- Backend sleeps (acceptable for demo/portfolio)
- Database resets after 90 days (backup your data)

---

## 🔄 Want Me to Prepare Deployment Files?

I can create:
1. `render.yaml` - Auto-deploy config for Render
2. `vercel.json` - Vercel configuration
3. Updated `.env.example` with production settings
4. Database backup script

Just let me know! 🚀
