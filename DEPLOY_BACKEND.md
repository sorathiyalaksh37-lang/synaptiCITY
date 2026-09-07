# 🚀 Railway Backend Deployment Guide

## ✅ Prerequisites (COMPLETED)
- [x] Supabase project created
- [x] Railway project created
- [x] Environment variables added to Railway
- [x] GitHub repository connected to Railway
- [x] Configuration files pushed to GitHub

---

## 📋 Current Status

### Files Added/Updated
✅ `nixpacks.toml` - Railway build configuration  
✅ `railway.toml` - Railway deployment settings  
✅ `package.json` - Updated server:prod script  
✅ `.env.production` - Production environment template

### Environment Variables in Railway
Make sure these 7 variables are set in Railway dashboard:

```
SUPABASE_URL=https://xblbatyouqzbzgednryn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=997026ef7f0cfd016c24b20806336d36e5e9424b01f9b9d264a0a0b54afca771d423953f8346735fdc5e1f5ff2d1b4a1cbe3d264fcc974306fb3a5ba696e9f07
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://synapti-city.vercel.app
```

---

## 🔄 Deployment Steps

### Step 1: Watch Railway Auto-Deploy
1. Go to Railway dashboard: https://railway.app
2. Click on your **synaptiCITY** project
3. Click the **"Deployments"** tab
4. You should see a new deployment starting automatically (from commit `4dea9d9`)

### Step 2: Monitor Build Progress
Railway will:
1. 🔄 Clone your GitHub repository
2. 📦 Install Node.js 20
3. 📥 Run `npm install --production=false`
4. 🚀 Start server with `npm run server:prod`

**Expected Timeline:** 2-5 minutes

### Step 3: Check Deployment Status

#### ✅ If Successful:
- You'll see a **green checkmark** ✅
- Status will show "Deployment Successful"
- A Railway URL will be generated (e.g., `https://synapticity-production.up.railway.app`)

#### ❌ If Failed:
- You'll see a **red X** ❌
- Click on the failed deployment
- Click **"View Logs"**
- Screenshot the error and send it back

---

## 🧪 Testing Your Deployment

### Test 1: Health Check
Once deployed, get your Railway URL and test:

```bash
curl https://your-app.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-04T...",
  "uptime": 123.45
}
```

### Test 2: API Root
```bash
curl https://your-app.up.railway.app/
```

Expected response:
```json
{
  "name": "synaptiCITY API",
  "version": "1.0.0",
  "description": "Backend API for synaptiCITY neural network learning platform",
  ...
}
```

### Test 3: Networks Endpoint
```bash
curl https://your-app.up.railway.app/api/networks
```

Should return an empty array or your networks (not a 500 error).

---

## 🔗 Connect Frontend to Backend

Once Railway deployment is successful:

### Update Vercel Environment Variable

1. Go to Vercel dashboard: https://vercel.com
2. Select your **synapti-city** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` or add it if missing
5. Set value to: `https://your-app.up.railway.app`
6. Click **Save**
7. Go to **Deployments** tab
8. Click **"Redeploy"** on the latest deployment

---

## 🎯 What Railway Does

### Build Configuration (nixpacks.toml)
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "npm-9_x"]

[phases.install]
cmds = ["npm install --production=false"]

[start]
cmd = "npm run server:prod"
```

### Deployment Configuration (railway.toml)
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install --production=false"

[deploy]
startCommand = "npm run server:prod"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Server Start Command (package.json)
```json
{
  "server:prod": "node --loader tsx server/index.ts"
}
```

This uses Node.js native loader to run TypeScript files without compilation.

---

## 🐛 Troubleshooting

### Issue: "Node.js detected but native WebSocket not found"
**Status:** FIXED ✅  
**Solution:** Updated to use `node --loader tsx` instead of direct `tsx`

### Issue: Build fails during npm install
**Check:**
- Railway has enough memory (should be fine on free tier)
- All dependencies are in package.json
- No conflicting peer dependencies

### Issue: Server starts but crashes immediately
**Check Railway Logs for:**
- Missing environment variables
- Port binding issues
- Database connection errors

### Issue: 502 Bad Gateway
**Possible causes:**
- Server not listening on PORT from environment
- Health check endpoint not responding
- Server crashed during startup

---

## 📝 Current Commit

Latest commit pushed: `4dea9d9`

```
fix: Railway deployment with nixpacks config
- Added nixpacks.toml for Node.js 20
- Updated railway.toml with proper config
- Fixed server:prod script to use node --loader tsx
```

---

## 🔐 Security Note

⚠️ **IMPORTANT:** After deployment succeeds, you should **rotate your Supabase keys** because they were shared in chat:
1. Go to Supabase dashboard
2. Settings → API
3. Click "Reset" on service_role key
4. Update Railway environment variable with new key
5. Redeploy on Railway

---

## ✅ Success Checklist

- [ ] Railway deployment shows green checkmark
- [ ] Health check endpoint responds with 200 OK
- [ ] API root endpoint returns JSON info
- [ ] Railway URL copied
- [ ] Vercel VITE_API_URL updated with Railway URL
- [ ] Vercel redeployed
- [ ] Frontend can connect to backend
- [ ] Supabase keys rotated (security)

---

## 🎉 Next Steps After Successful Deployment

1. **Test full integration:**
   - Open https://synapti-city.vercel.app
   - Try creating a neural network
   - Check if it saves to Supabase
   - Test authentication features

2. **Monitor Railway:**
   - Check "Metrics" tab for CPU/Memory usage
   - Set up alerts for downtime
   - Monitor request logs

3. **Set up custom domain (optional):**
   - Railway Settings → Domains
   - Add your custom domain
   - Update DNS records
   - Update Vercel VITE_API_URL

---

## 📞 Need Help?

If deployment fails again:
1. Go to Railway → Deployments → Click failed deployment
2. Copy the error logs
3. Screenshot the error
4. Share in chat for immediate fix

---

**Last Updated:** September 4, 2026  
**Commit:** 4dea9d9  
**Status:** Waiting for Railway auto-deploy...
