# Deployment Guide - synaptiCITY

This guide covers deploying synaptiCITY to various platforms.

## Prerequisites

Before deploying, ensure:
1. ✅ All dependencies are installed: `npm install`
2. ✅ Project builds successfully: `npm run build`
3. ✅ No TypeScript errors: `npm run lint`
4. ✅ Local preview works: `npm run preview`

## Option 1: Vercel (Recommended)

Vercel provides the best developer experience with automatic deployments.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
# From project root
vercel

# For production deployment
vercel --prod
```

### Step 4: Configure (if needed)

Vercel auto-detects Vite projects. If you need custom configuration, create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Step 5: Set up GitHub Integration (Optional)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Every push to `main` will auto-deploy

**URL**: Your app will be at `https://synapticity.vercel.app` (or custom domain)

---

## Option 2: Netlify

Netlify is another excellent option with similar features.

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login

```bash
netlify login
```

### Step 3: Build

```bash
npm run build
```

### Step 4: Deploy

```bash
# Deploy to preview URL
netlify deploy

# Deploy to production
netlify deploy --prod --dir=dist
```

### Step 5: Configure (Optional)

Create `netlify.toml` for custom configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**URL**: Your app will be at `https://synapticity.netlify.app` (or custom domain)

---

## Option 3: GitHub Pages

Free hosting directly from your GitHub repository.

### Step 1: Update `vite.config.ts`

Add the base URL:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/synaptiCITY/', // Replace with your repo name
})
```

### Step 2: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 3: Add Deploy Script

Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Deploy

```bash
npm run deploy
```

### Step 5: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: `gh-pages` branch
3. Save

**URL**: Your app will be at `https://yourusername.github.io/synaptiCITY/`

---

## Option 4: AWS S3 + CloudFront

For production-grade hosting with CDN.

### Step 1: Build

```bash
npm run build
```

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://synapticity-app
```

### Step 3: Enable Static Website Hosting

```bash
aws s3 website s3://synapticity-app \
  --index-document index.html \
  --error-document index.html
```

### Step 4: Upload Files

```bash
aws s3 sync dist/ s3://synapticity-app --delete
```

### Step 5: Set Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::synapticity-app/*"
    }
  ]
}
```

### Step 6: Create CloudFront Distribution

1. Go to CloudFront console
2. Create distribution
3. Origin: Your S3 bucket
4. Default root object: `index.html`
5. Error pages: 404 → /index.html (for SPA routing)

**URL**: Your CloudFront distribution URL (e.g., `https://d123456.cloudfront.net`)

---

## Option 5: Docker + Any Cloud

Deploy as a Docker container to any cloud provider.

### Step 1: Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Step 3: Build Image

```bash
docker build -t synapticity:latest .
```

### Step 4: Run Locally (Test)

```bash
docker run -p 8080:80 synapticity:latest
```

### Step 5: Deploy to Cloud

**AWS ECS**:
```bash
# Tag and push to ECR
docker tag synapticity:latest YOUR_ECR_URI:latest
docker push YOUR_ECR_URI:latest
```

**Google Cloud Run**:
```bash
gcloud run deploy synapticity \
  --image synapticity:latest \
  --platform managed \
  --allow-unauthenticated
```

**Azure Container Instances**:
```bash
az container create \
  --resource-group myResourceGroup \
  --name synapticity \
  --image synapticity:latest \
  --dns-name-label synapticity \
  --ports 80
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Home page loads correctly
- [ ] All three tabs work (Simulation, BDH/BDH-CQ, Test)
- [ ] Neural network visualization renders
- [ ] Teaching associations works
- [ ] Recall testing works
- [ ] Weight matrix updates in debug panel
- [ ] Sixty-Second Test functions
- [ ] Mobile responsive design works
- [ ] Accessibility features work (keyboard navigation)
- [ ] No console errors
- [ ] Fast load time (< 3 seconds)

---

## Performance Optimization

### 1. Code Splitting (Already Configured)

Vite automatically code-splits by route. No additional config needed.

### 2. Image Optimization

If you add images later:

```bash
npm install --save-dev vite-plugin-imagemin
```

### 3. Compression

Most platforms (Vercel, Netlify) auto-enable gzip/brotli. For nginx:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;
```

### 4. CDN Headers

For S3/CloudFront, set Cache-Control headers:

```bash
aws s3 sync dist/ s3://synapticity-app \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --delete

aws s3 sync dist/ s3://synapticity-app \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --delete
```

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Netlify provides DNS or CNAME instructions

### CloudFront

1. Request ACM certificate for your domain
2. Add alternate domain name (CNAME) to distribution
3. Point your domain's DNS to CloudFront

---

## Environment Variables (If Needed)

If you add API keys or secrets later:

### Vercel
```bash
vercel env add VITE_API_KEY
```

### Netlify
```bash
netlify env:set VITE_API_KEY your_value
```

### GitHub Pages
Use GitHub Secrets and build-time injection

---

## Monitoring & Analytics

### Add Google Analytics (Optional)

Install:
```bash
npm install react-ga4
```

In `src/main.tsx`:
```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send("pageview");
```

### Add Vercel Analytics

```bash
npm install @vercel/analytics
```

In `src/main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// Add <Analytics /> to your app
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on Refresh (SPA Routing)

Ensure your platform redirects all routes to `index.html`:

- **Vercel**: Auto-configured
- **Netlify**: Use `netlify.toml` redirect rule
- **S3**: Set error document to `index.html`
- **Nginx**: Use `try_files` directive

### Slow Loading

1. Check bundle size: `npm run build -- --report`
2. Enable compression
3. Use CDN
4. Lazy load components

---

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Security Headers

For production, add security headers:

### Netlify (`netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Vercel (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

---

## Recommended: Vercel Deployment

For this project, **Vercel is recommended** because:

1. ✅ Zero-config deployment
2. ✅ Automatic HTTPS
3. ✅ Global CDN
4. ✅ Preview deployments for PRs
5. ✅ Built-in analytics
6. ✅ Generous free tier

Simply run:
```bash
vercel --prod
```

Your synaptiCITY app will be live in seconds! 🚀
