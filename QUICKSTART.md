# 🚀 Quick Start - synaptiCITY

Get synaptiCITY running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org))

## Installation & Run

```bash
# 1. Navigate to the project directory
cd synaptiCITY

# 2. Install dependencies (may take 2-3 minutes)
npm install

# 3. Start the development server
npm run dev
```

Open your browser to `http://localhost:5173` 🎉

## First Steps

### 1️⃣ Teach an Association
- Select **DOG** → **ANIMAL**
- Set repetitions to **3**
- Click "Teach Association"
- Watch the connection strengthen!

### 2️⃣ Test Recall
- Select **DOG** as input
- Click "What does it recall?"
- It should predict **ANIMAL**!

### 3️⃣ Try Interference
- Teach **DOG → ANIMAL** (5 times)
- Then teach **DOG → PET** (5 times)
- Test recall - watch the conflict!

### 4️⃣ Learn About BDH
Click the **BDH/BDH-CQ** tab to see how this connects to real AI research.

### 5️⃣ Take the Test
Click the **Test** tab to verify your understanding.

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Deployment

### Vercel (Easiest)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

See `DEPLOYMENT_GUIDE.md` for more options.

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Need help?**  
Check `SETUP.md` for detailed instructions or open an issue on GitHub.

---

**Ready to explore synaptic plasticity!** 🧠✨
