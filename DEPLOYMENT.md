# 🚀 Deployment Guide - synaptiCITY

Complete guide to deploying the synaptiCITY application (frontend + backend).

## 📋 Overview

- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Express.js + TypeScript (deploy on Railway/Render/Fly.io)
- **Database**: PostgreSQL via Supabase

---

## 🗄️ Step 1: Setup Supabase (Database)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Fill in:
   - **Name**: synaptiCITY
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to your users
4. Wait for project to initialize (~2 minutes)

### 1.2 Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `server/config/database.sql`
4. Paste and click **Run**
5. Verify tables are created: Go to **Table Editor**

### 1.3 Get API Credentials

1. Go to **Settings** > **API**
2. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (⚠️ Keep secret! Starts with `eyJ...`)

---

## 🖥️ Step 2: Deploy Backend API

### Option A: Railway (Recommended)

#### 2.1 Prepare for Deployment

1. Ensure code is pushed to GitHub
2. Your backend is in `/server` directory

#### 2.2 Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click **New Project** > **Deploy from GitHub repo**
3. Select your `synaptiCITY` repository
4. Railway will auto-detect Node.js

#### 2.3 Configure Build & Start Commands

In Railway dashboard:
1. Go to **Settings** > **Build & Deploy**
2. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server:prod`
   - **Root Directory**: leave empty (uses package.json in root)

#### 2.4 Add Environment Variables

In Railway dashboard, go to **Variables** and add:

```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_KEY=<your_service_key>
JWT_SECRET=<generate_random_string_32_chars>
FRONTEND_URL=https://synapti-city.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

#### 2.5 Deploy & Get URL

1. Railway will auto-deploy
2. Once deployed, copy your **Public URL** (e.g., `https://synapticity-production.up.railway.app`)
3. Save this URL - you'll need it for the frontend

---

### Option B: Render

#### 2.1 Create Web Service

1. Go to [render.com](https://render.com) and sign up
2. Click **New** > **Web Service**
3. Connect your GitHub repo

#### 2.2 Configure Service

- **Name**: synapticity-api
- **Root Directory**: (leave empty)
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm run server:prod`
- **Plan**: Free (or paid for better performance)

#### 2.3 Add Environment Variables

Same as Railway (Section 2.4)

#### 2.4 Deploy

Click **Create Web Service** - deployment will start automatically.

---

### Option C: Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Set secrets
fly secrets set SUPABASE_URL=xxx SUPABASE_ANON_KEY=xxx ...

# Deploy
fly deploy
```

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Update Frontend Config

1. Create `.env` file in project root:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

Replace `your-backend-url` with your Railway/Render URL from Step 2.

### 3.2 Update CORS in Backend

Ensure your backend `.env` includes:
```env
FRONTEND_URL=https://synapti-city.vercel.app
```

### 3.3 Deploy to Vercel

1. Your frontend already auto-deploys via GitHub Actions
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Find your `synaptiCITY` project
4. Go to **Settings** > **Environment Variables**
5. Add:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
6. Redeploy: **Deployments** > **⋯** > **Redeploy**

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend

```bash
# Health check
curl https://your-backend-url.railway.app/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":123}
```

### 4.2 Test Frontend

1. Visit `https://synapti-city.vercel.app`
2. Try creating a network
3. Check browser console for errors
4. Verify API calls in Network tab

### 4.3 Test End-to-End

1. Sign up for an account (Supabase Auth)
2. Create a network
3. Share a network
4. Check community library
5. View leaderboard

---

## 🔐 Security Checklist

- [ ] `.env` is in `.gitignore` (never commit secrets!)
- [ ] `SUPABASE_SERVICE_KEY` is only in backend environment
- [ ] JWT_SECRET is strong and random (32+ characters)
- [ ] CORS is configured correctly (only allow your frontend)
- [ ] Rate limiting is enabled
- [ ] Supabase RLS policies are active (run `database.sql`)
- [ ] HTTPS is enforced (automatic on Vercel/Railway)

---

## 🐛 Troubleshooting

### "CORS Error"

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check `FRONTEND_URL` in backend `.env`
2. Ensure it matches your Vercel URL exactly
3. Redeploy backend after changing

### "Authentication Failed"

**Problem**: Token is invalid

**Solution**:
1. Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` match
2. Verify Supabase project is active
3. Check token is sent in `Authorization: Bearer <token>` header

### "Database Connection Error"

**Problem**: Can't connect to Supabase

**Solution**:
1. Verify Supabase project is running
2. Check credentials are correct
3. Ensure database schema is created (`database.sql`)
4. Check Supabase dashboard for errors

### "Rate Limit Exceeded"

**Problem**: Too many requests

**Solution**:
1. Wait for rate limit window to reset
2. Increase limits in backend `.env` (for development)
3. Implement request caching in frontend

### Build Errors

**Problem**: Deployment fails

**Solution**:
1. Check build logs in Railway/Render dashboard
2. Ensure `package.json` scripts are correct
3. Verify all dependencies are in `dependencies` (not `devDependencies`)
4. Test build locally: `npm run build`

---

## 📊 Monitoring & Logs

### Railway

- **Logs**: Dashboard > **Logs** tab
- **Metrics**: Dashboard > **Metrics** tab
- **Alerts**: Dashboard > **Settings** > **Alerts**

### Render

- **Logs**: Dashboard > **Logs** tab
- **Metrics**: Dashboard > **Metrics** (paid plans)

### Supabase

- **Database**: Dashboard > **Database** > **Logs**
- **Auth**: Dashboard > **Authentication** > **Logs**
- **API**: Dashboard > **API** > **Logs**

---

## 🔄 Update Deployment

### Update Backend

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway/Render will auto-deploy on push.

### Update Frontend

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will auto-deploy via GitHub Actions.

### Update Database Schema

1. Write migration SQL
2. Test locally first
3. Go to Supabase **SQL Editor**
4. Run migration carefully
5. Backup before major changes!

---

## 💰 Cost Estimates

### Free Tier (Total: $0/month)

- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Railway**: $5/month credit (enough for low traffic)
- **Render**: Free tier (spins down after 15min inactivity)
- **Vercel**: Free (unlimited bandwidth)

### Paid (Production - ~$20/month)

- **Supabase**: Pro $25/month (8GB database, 50GB bandwidth)
- **Railway**: ~$10/month (always-on, better performance)
- **Vercel**: Pro $20/month (team features, analytics)

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🆘 Need Help?

- Check [GitHub Issues](https://github.com/sorathiyalaksh37-lang/synaptiCITY/issues)
- Read [server/README.md](server/README.md)
- Contact: [Your Email/Discord]

---

**Last Updated**: September 4, 2026
