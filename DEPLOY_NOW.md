# 🚀 Deploy AgroInvest - One-Click Setup

## ✅ সব file তৈরি হয়ে গেছে! এখন deploy করুন:

---

## Step 1: Backend + Database (Render.com)

### Option A: One-Click Deploy with render.yaml

1. **Render.com এ যান:** https://render.com
2. **Sign up করুন** GitHub দিয়ে
3. **New** → **Blueprint** ক্লিক করুন
4. **GitHub Repo সংযুক্ত করুন:** `ridwan2005ahmed/AgroInvest`
5. Render automatically `render.yaml` detect করবে
6. **Apply** বাটনে ক্লিক করুন
7. ⏳ 10 মিনিট অপেক্ষা করুন

✅ Backend + Database দুইটাই deploy হয়ে যাবে!

### Option B: Manual Deploy (যদি render.yaml কাজ না করে)

#### Database:
1. **New** → **PostgreSQL**
2. Name: `agroinvest-db`
3. Database: `agro_investment`
4. Region: `Singapore`
5. **Create Database**
6. Copy **Internal Database URL**postgresql://agro_investment_user:MtM80vz0MUhqirfeYeAN4Evh5fAWuvIP@dpg-d5pau4fpm1nc73bsipu0-a/agro_investment

#### Backend:
1. **New** → **Web Service**
2. Repo: `ridwan2005ahmed/AgroInvest`
3. Name: `agroinvest-api`
4. Root Directory: `backend`
5. Build: `npm install`
6. Start: `npm start`
7. Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<postgresql://agro_investment_user:MtM80vz0MUhqirfeYeAN4Evh5fAWuvIP@dpg-d5pau4fpm1nc73bsipu0-a/agro_investment>
   JWT_SECRET=your-secret-key-change-this
   JWT_EXPIRES_IN=7d
   PORT=5000
   ```
8. **Create Web Service**

---

## Step 2: Initialize Database

### After backend deploys:

1. Go to your **PostgreSQL database** in Render
2. Click **Connect** → Get connection details
3. Run this command in your terminal:

```bash
cd /mnt/01DBC1CF3524D940/project-26/agro-investment-platform

# Replace with your actual values
PGPASSWORD=<password> psql -h <host> -U postgres -d agro_investment -f backend/src/database/schema.sql
```

Or use Render's **Web Shell**:
1. Database → **Connect** → **PSQL Command**
2. Copy and run in terminal
3. Then paste contents of `backend/src/database/schema.sql`

---

## Step 3: Deploy Frontend (Vercel)

### One-Click Deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ridwan2005ahmed/AgroInvest&root-directory=frontend&env=NEXT_PUBLIC_API_URL&envDescription=Backend%20API%20URL&envLink=https://render.com)

**OR Manual:**

1. **Vercel.com এ যান:** https://vercel.com
2. **Sign up করুন** GitHub দিয়ে
3. **New Project** → Import `ridwan2005ahmed/AgroInvest`
4. Settings:
   - Framework: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://agroinvest-api.onrender.com
   ```
   (Replace with your actual Render backend URL)
6. **Deploy** বাটনে ক্লিক করুন

---

## Step 4: Test Your Deployment

1. **Frontend URL থেকে check করুন** (Vercel দেবে)
2. **Login করুন:**
   - Email: `admin@ad.com`
   - Password: `123456`
3. **Backend Health Check:**
   - Visit: `https://agroinvest-api.onrender.com/health`
   - Should show: `{"status":"OK"}`

---

## 🎯 Quick Deploy Links

### Backend (Render):
1. **Database:** https://dashboard.render.com/new/database
   - Name: `agroinvest-db`
   - Region: Singapore
   - Click "Create Database"

2. **Web Service:** https://dashboard.render.com/select-repo
   - Select: `ridwan2005ahmed/AgroInvest`
   - Root: `backend`
   - Add environment variables
   - Click "Create Web Service"

### Frontend (Vercel):
- **Deploy:** https://vercel.com/new
- Import: `ridwan2005ahmed/AgroInvest`
- Root: `frontend`
- Add API URL
- Click "Deploy"

---

## ⚡ After Deployment

### Your Live URLs:
- **Frontend:** `https://agroinvest-xyz.vercel.app`
- **Backend:** `https://agroinvest-api.onrender.com`
- **Database:** Internal URL (Render dashboard)

### Next Steps:
1. ✅ Test all features
2. ✅ Change admin password
3. ✅ Add custom domain (optional)
4. ✅ Setup UptimeRobot to keep backend awake

---

## 🆘 Troubleshooting

### Database connection failed?
- Check `DATABASE_URL` in environment variables
- Make sure using **Internal Database URL** from Render

### Backend not starting?
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure `package.json` has correct start script

### Frontend can't connect to backend?
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Make sure backend URL is correct
- Check CORS settings in backend

---

## 💰 Cost

- **Render Database:** Free (90 days)
- **Render Backend:** Free (with sleep)
- **Vercel Frontend:** Free (forever)
- **Total:** ৳0/month

---

## 🔗 Important Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/ridwan2005ahmed/AgroInvest

---

**এখন শুরু করুন! সব file ready আছে! 🚀**

প্রয়োজন হলে আমাকে জানাবেন! 😊
