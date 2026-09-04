# Setup Guide - synaptiCITY

Complete step-by-step guide to get synaptiCITY running on your machine.

## 📋 System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Node.js**: v18.0.0 or higher
- **RAM**: 4GB
- **Disk Space**: 500MB free
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Recommended
- **Node.js**: v20.x (LTS)
- **RAM**: 8GB
- **Modern browser** with JavaScript enabled

## 🔧 Step 1: Install Node.js

### Check if Node.js is installed

```bash
node --version
npm --version
```

If you see version numbers (e.g., `v20.10.0`), skip to Step 2.

### Install Node.js

**Option A: Official Installer** (Recommended)
1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS version
3. Run the installer
4. Verify: `node --version`

**Option B: Using nvm (Node Version Manager)**

macOS/Linux:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 20
nvm use 20
```

Windows:
1. Install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
2. Open PowerShell as Administrator
3. Run: `nvm install 20` and `nvm use 20`

## 📥 Step 2: Get the Code

### Option A: Clone from GitHub

```bash
# If you have Git installed
git clone https://github.com/sorathiyalaksh37-lang/synaptiCITY.git
cd synaptiCITY
```

### Option B: Download ZIP

1. Go to [GitHub repository](https://github.com/sorathiyalaksh37-lang/synaptiCITY)
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal/command prompt in the extracted folder

## 📦 Step 3: Install Dependencies

```bash
npm install
```

This will:
- Download all required packages (~150MB)
- Set up React, TypeScript, Vite, Tailwind CSS
- Install development tools
- Take 2-5 minutes depending on your internet speed

### Troubleshooting Installation

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "Permission denied"**
```bash
# macOS/Linux
sudo npm install

# Or fix npm permissions permanently
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Error: "Network timeout"**
```bash
npm install --registry=https://registry.npmjs.org/
```

**On Windows: "execution policy" error**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 🚀 Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 324 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

## 🌐 Step 5: Open in Browser

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the synaptiCITY homepage!

### First-Time Setup Complete! 🎉

The app is now running locally. Any changes you make to the code will automatically reload.

## 🎓 Quick Tutorial

### 1. Teach an Association

1. Click the **Simulation** tab
2. In "Teach an Association":
   - Select **DOG** as input
   - Select **ANIMAL** as output
   - Set repetitions to **3**
   - Click "Teach Association"

Watch the connection between DOG and ANIMAL strengthen (line gets thicker and greener)!

### 2. Test Recall

1. In "Test Recall":
   - Select **DOG** as input
   - Click "What does it recall?"

The network should predict **ANIMAL**!

### 3. Experiment with Interference

1. Teach **DOG → ANIMAL** (5 repetitions)
2. Test recall (should work)
3. Now teach **DOG → PET** (5 repetitions)
4. Test recall again (watch it struggle!)

This demonstrates interference—competing memories weaken each other.

### 4. Explore BDH Connection

Click the **BDH/BDH-CQ** tab to learn how this toy mechanism connects to real AI systems.

### 5. Take the Test

Click the **Test** tab to verify your understanding with the Sixty-Second Test.

## 🛠️ Development Commands

### Run Development Server
```bash
npm run dev
```
- Hot reload enabled
- Access at http://localhost:5173

### Build for Production
```bash
npm run build
```
- Creates optimized production build in `dist/` folder
- Minifies code, removes development warnings
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Test before deploying

### Run Linter
```bash
npm run lint
```
- Checks code quality
- Identifies TypeScript errors
- Ensures best practices

### Type Checking
```bash
npx tsc --noEmit
```
- Validates TypeScript types
- No output means success!

## 📂 Project Structure

```
synaptiCITY/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── NeuralGrid.tsx
│   │   ├── TeachInterface.tsx
│   │   ├── RecallInterface.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── StateDebugPanel.tsx
│   │   ├── BDHModule.tsx
│   │   └── SixtySecondTest.tsx
│   ├── lib/
│   │   └── NeuralNetwork.ts    # Hebbian learning logic
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── styles/
│   │   └── index.css           # Global styles
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔍 Verifying Your Setup

Run these checks to ensure everything works:

### 1. Check Node.js Version
```bash
node --version
# Should be v18.0.0 or higher
```

### 2. Check Installation
```bash
npm list react react-dom typescript vite
# Should show installed versions
```

### 3. Check TypeScript
```bash
npx tsc --version
# Should show TypeScript version
```

### 4. Check Build
```bash
npm run build
# Should complete without errors
```

### 5. Check Production Preview
```bash
npm run preview
# Should start server on port 4173
```

## 🐛 Common Issues & Solutions

### Issue: Port 5173 Already in Use

```bash
# Kill the process using port 5173
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Issue: "Module not found" Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .vite
npm install
```

### Issue: Slow Initial Load

The first load downloads and caches dependencies. Subsequent loads are much faster.

### Issue: TypeScript Errors in IDE

1. Install TypeScript globally: `npm install -g typescript`
2. Reload your IDE/editor
3. Check `tsconfig.json` is present

### Issue: Styles Not Loading

```bash
# Rebuild Tailwind CSS
npm run build
npm run dev
```

### Issue: Changes Not Reflecting

1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart dev server

## 🎨 Customizing the Experience

### Change Port
```bash
# Edit package.json scripts
"dev": "vite --port 3000"
```

### Change Theme Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'neural-weak': '#your-color',
      'neural-medium': '#your-color',
      'neural-strong': '#your-color',
    },
  },
}
```

### Add More Words

Edit `src/App.tsx`:
```typescript
const VOCABULARY = ['DOG', 'ANIMAL', 'PET', 'CAT', 'BIRD', 'FISH', 'YOUR_WORD'];
```

## 📱 Testing on Mobile

### Test on Same Network

1. Find your local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. Start dev server with host flag:
   ```bash
   npm run dev -- --host
   ```

3. On mobile browser, visit: `http://YOUR_IP:5173`

### Test with ngrok (Expose to Internet)

```bash
# Install ngrok
npm install -g ngrok

# Run dev server
npm run dev

# In another terminal
ngrok http 5173
```

Use the ngrok URL to test from anywhere.

## 🚀 Next Steps

1. **Explore the Code**: Read through `src/lib/NeuralNetwork.ts` to understand Hebbian learning
2. **Read Documentation**: Check out `CONCEPT_SUMMARY.md` for theoretical background
3. **Try Experiments**: Use the interference demo to see memory conflicts
4. **Learn About BDH**: Read the BDH/BDH-CQ module for connections to real AI
5. **Deploy**: Follow `DEPLOYMENT_GUIDE.md` to put your app online

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 💬 Getting Help

1. **Check existing issues**: [GitHub Issues](https://github.com/sorathiyalaksh37-lang/synaptiCITY/issues)
2. **Open a new issue**: Describe your problem with:
   - OS and Node.js version
   - Error messages
   - Steps to reproduce
3. **Ask questions**: Use GitHub Discussions

---

**Congratulations! You're all set up to explore synaptic plasticity!** 🧠✨

Need help? Open an issue on GitHub!
