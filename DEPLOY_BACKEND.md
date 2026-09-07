# Backend Deployment Guide - Railway

## ✅ Prerequisites Complete

Your Supabase is set up with:
- URL: `https://xblbatyouqzbzgednryn.supabase.co`
- Anon Key: Configured ✅
- Service Key: Configured ✅
- JWT Secret: Generated ✅

## 🚀 Deploy to Railway (5 minutes)

### Step 1: Sign Up for Railway

1. Go to **https://railway.app**
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: **synaptiCITY**
4. Railway will automatically detect it's a Node.js project

### Step 3: Add Environment Variables

In the Railway dashboard, go to **Variables** tab and add these:

```bash
SUPABASE_URL=https://xblbatyouqzbzgednryn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGJhdHlvdXF6YnpnZWRucnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3OTU5ODcsImV4cCI6MjEwNDM3MTk4N30.lUCM7xwfeqQLvpkRVR0hrHhpFv0qeqS1YZruejiWgEo
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGJhdHlvdXF6YnpnZWRucnluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODc5NTk4NywiZXhwIjoyMTA0MzcxOTg3fQ.8NSaaDeDpUZF_qe0wCawCKBh7SfhD9iEsT4ujlTr6R4
JWT_SECRET=997026ef7f0cfd016c24b20806336d36e5e9424b01f9b9d264a0a0b54afca771d423953f8346735fdc5e1f5ff2d1b4a1cbe3d264fcc974306fb3a5ba696e9f07
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://synapti-city.vercel.app
```

**Pro Tip**: Copy-paste each line individually in Railway's variable editor.

### Step 4: Configure Build Settings

Railway should auto-detect these, but verify:

**Build Command**: `npm install`  
**Start Command**: `npm run server:prod`

If not set, go to **Settings** → **Build** and add them.

### Step 5: Deploy!

1. Click **"Deploy"**
2. Railway will:
   - Clone your repo
   - Install dependencies
   - Build your backend
   - Start the server
3. Wait 2-3 minutes for deployment

### Step 6: Get Your Backend URL

Once deployed:
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. You'll get a URL like: `https://synaptiCITY-production.up.railway.app`

**Copy this URL!** You'll need it for the frontend.

### Step 7: Test Your Backend

Open your backend URL in browser:
```
https://your-app.up.railway.app/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-09-04T...",
  "uptime": 123
}
```

✅ **Backend is live!**

---

## 🔗 Connect Frontend to Backend

### Update Frontend API URL

1. Go to your Vercel dashboard
2. Select your synaptiCITY project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app/api
   ```
5. Redeploy your frontend (trigger by pushing a commit)

**OR** update locally:

```typescript
// In src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-railway-app.up.railway.app/api';
```

Then commit and push:
```bash
git add .
git commit -m "feat: connect to Railway backend"
git push origin main
```

Vercel will auto-deploy!

---

## ✅ Verification Checklist

Test these endpoints:

1. **Health Check**
   ```
   GET https://your-app.up.railway.app/health
   ```

2. **API Documentation**
   ```
   GET https://your-app.up.railway.app/api
   ```

3. **Get Networks** (public)
   ```
   GET https://your-app.up.railway.app/api/networks
   ```

4. **Get Leaderboard** (public)
   ```
   GET https://your-app.up.railway.app/api/users/leaderboard
   ```

All should return JSON responses!

---

## 🔒 Post-Deployment Security

### IMPORTANT: Rotate Your Supabase Keys

Since you shared your keys publicly, rotate them:

1. Go to **Supabase Dashboard**
2. **Settings** → **API**
3. Click **"Reset API Keys"**
4. Update the new keys in Railway environment variables
5. Redeploy

### Enable CORS

Your backend already has CORS configured for:
- `https://synapti-city.vercel.app`

If you need to add more origins, update `server/index.ts`.

---

## 📊 Monitor Your Backend

### Railway Dashboard

Monitor in real-time:
- **Metrics**: CPU, Memory, Network
- **Logs**: Console output and errors
- **Deployments**: History and rollbacks

### Set Usage Alerts

1. Go to **Settings** → **Usage**
2. Set alerts for:
   - CPU > 80%
   - Memory > 90%
   - Monthly spend > $5

---

## 💰 Free Tier Limits

Railway free tier includes:
- **$5 credit/month** (usually enough!)
- **512MB RAM**
- **1 CPU**
- **100GB bandwidth**

Your backend should easily stay within these limits for 1000-5000 users/month.

---

## 🆘 Troubleshooting

### Deployment Failed

**Check Railway logs**:
1. Go to **Deployments** tab
2. Click failed deployment
3. Read error messages

**Common issues**:
- Missing environment variables
- Wrong start command
- Port conflicts (Railway assigns PORT automatically)

### Backend Not Responding

1. Check logs for errors
2. Verify environment variables are set
3. Test database connection: Go to `/health` endpoint
4. Restart service: **Settings** → **Restart**

### CORS Errors

Update `server/index.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://synapti-city.vercel.app',
  credentials: true
}));
```

---

## 🎉 Success!

Your backend should now be:
- ✅ Deployed on Railway
- ✅ Connected to Supabase
- ✅ Accessible via HTTPS
- ✅ Auto-deploying on git push

**Frontend** → **Railway Backend** → **Supabase Database** ✅

---

## 🔄 Continuous Deployment

Every time you push to GitHub:
1. Vercel auto-deploys frontend
2. Railway auto-deploys backend (if server/ files changed)
3. No manual work needed!

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Your DEPLOYMENT.md**: More detailed guides
- **GitHub Issues**: Open an issue in your repo

---

**Last Updated**: September 4, 2026  
**Status**: Ready to Deploy! 🚀
