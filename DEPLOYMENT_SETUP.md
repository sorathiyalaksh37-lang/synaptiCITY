# 🚀 synaptiCITY Deployment Setup

## ✅ Current Status
Your project is **LIVE** on Vercel!
- **Production URL**: https://synapti-city.vercel.app
- **Latest Deployment**: https://synapticity-3frr7jy4-laksh-sorathiya.vercel.app

## 🔐 Setting Up GitHub Actions for Auto-Deployment

To enable automatic deployments when you push to GitHub, follow these steps:

### Step 1: Get Your Vercel Credentials

#### A. Get Vercel Token
1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name: `GitHub Actions - synaptiCITY`
4. Scope: **Full Account**
5. Click **"Create"**
6. **Copy the token** (you'll only see it once!)

#### B. Get Vercel Org ID & Project ID
1. Go to your project settings: https://vercel.com/sorathiyalaksh37-lang/synapticity/settings
2. Scroll to **"General"** section
3. Find and copy:
   - **Project ID** (e.g., `prj_xxxxxxxxxxxxx`)
   - **Team ID** or **User ID** (this is your Org ID)

### Step 2: Add Secrets to GitHub Repository

1. Go to: https://github.com/sorathiyalaksh37-lang/synaptiCITY/settings/secrets/actions
2. Click **"New repository secret"** for each of the following:

**Secret 1: VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Value: [Your token from Step 1A]
- Click "Add secret"

**Secret 2: VERCEL_ORG_ID**
- Name: `VERCEL_ORG_ID`
- Value: [Your Org/Team ID from Step 1B]
- Click "Add secret"

**Secret 3: VERCEL_PROJECT_ID**
- Name: `VERCEL_PROJECT_ID`
- Value: [Your Project ID from Step 1B]
- Click "Add secret"

### Step 3: Test the Automated Deployment

Once all secrets are added, push any change to trigger GitHub Actions:

```bash
cd /Users/lakshsorathiya/synaptiCITY
git commit --allow-empty -m "chore: test automated deployment"
git push origin main
```

Then watch the deployment progress:
- GitHub Actions: https://github.com/sorathiyalaksh37-lang/synaptiCITY/actions
- Vercel Dashboard: https://vercel.com/sorathiyalaksh37-lang/synapticity

## 🎯 What Happens Next?

After setup:
1. ✅ Every push to `main` branch will automatically deploy
2. ✅ Pull requests will get preview deployments
3. ✅ Build errors will be caught before deployment
4. ✅ Vercel will show the deployment status on GitHub

## 📝 Current Deployment Configuration

Your `.github/workflows/deploy.yml` includes:
- ✅ Automated linting on push
- ✅ Build verification
- ✅ Production deployment to Vercel
- ✅ Artifact retention (7 days)

## 🌐 Live URLs

**Production**: https://synapti-city.vercel.app
**Latest Preview**: https://synapticity-3frr7jy4-laksh-sorathiya.vercel.app

---

Need help? Check the troubleshooting section in the README or the GitHub Actions logs.
