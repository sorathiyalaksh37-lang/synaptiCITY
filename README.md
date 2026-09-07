# synaptiCITY - When Connections Become Memory 🧠

An interactive educational platform demonstrating how **synaptic plasticity**—the strengthening of connections between neurons—creates short-term memory. Experience memory emergence in real-time through Hebbian learning, experiment with neural networks, and discover connections to cutting-edge AI systems.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://synapti-city.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Railway-blueviolet?style=for-the-badge)](https://synapticity-production.up.railway.app)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007acc?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Application

**🚀 Frontend:** [https://synapti-city.vercel.app](https://synapti-city.vercel.app)  
**⚡ Backend API:** [https://synapticity-production.up.railway.app](https://synapticity-production.up.railway.app)  
**📊 Database:** Supabase (PostgreSQL + Realtime)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Educational Content](#-educational-content)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

### The Core Claim

**Memory can emerge from temporarily changing the strength of connections in a neural system, and this mechanism enables both rapid learning and interference between competing memories.**

### Who Is This For?

synaptiCITY is designed for learners interested in:
- 🧠 Neural networks and machine learning
- 🔬 Hebbian learning and synaptic plasticity
- 🤖 Brain-inspired AI and cognitive computing
- 🎓 Interactive educational simulations

### Learning Objectives

By exploring synaptiCITY, you will:
- ✅ Understand the intuition behind Hebbian learning
- ✅ Visualize how connection strengths encode recent activity
- ✅ Distinguish static parameters from dynamic state
- ✅ Explore the role of synaptic plasticity in memory
- ✅ Connect toy models to real AI systems (BDH, BDH-CQ)
- ✅ Experiment with live neural network state changes

---

## ✨ Features

### 🎨 Core Simulation
- **Visual Neural Network**: Real-time node and connection visualization
- **Interactive Teaching**: Teach associations (DOG → ANIMAL)
- **Live Recall Testing**: Watch predictions based on learned connections
- **Hebbian Learning**: Implements Δw = η × aᵢ × aⱼ
- **Parameter Control**: Adjust learning rate and repetitions
- **Interference Demo**: See competing memories interact

### 🚀 Advanced Features (Phase 2-10)
- **� Educational Modules**: Custom vocabulary builder, time-series graphs
- **🎨 3D Visualization**: Three.js neural network rendering
- **🔧 Technical Tools**: Larger networks (50 nodes), topology selection
- **📊 Performance Metrics**: Real-time analytics dashboard
- **💾 Data Export**: JSON, CSV, PNG formats
- **🎮 Gamification**: Achievement system, challenges, leaderboards
- **👥 Community**: Shareable networks, user-generated content
- **🔐 Backend**: User authentication, profiles, cross-device sync
- **📱 PWA**: Offline support, install on mobile
- **📈 Analytics**: Performance monitoring, A/B testing
- **📖 Documentation**: Interactive FAQ, glossary, blog system

### 🎯 11 Development Phases (100% Complete!)
✅ **Phase 1**: Core Features (Keyboard shortcuts, tooltips, export/import)  
✅ **Phase 2**: Educational (Vocabulary, time-series, 3D visualization)  
✅ **Phase 3**: Technical Capabilities (50 nodes, topologies, batch teaching)  
✅ **Phase 4**: Gamification (Achievements, challenges, leaderboards)  
✅ **Phase 5**: Community (Shareable URLs, community library)  
✅ **Phase 6**: Backend (Express.js API, PostgreSQL, OAuth)  
✅ **Phase 7**: Advanced AI (Multi-layer networks, attention mechanism)  
✅ **Phase 8**: Mobile/PWA (Service workers, offline, touch gestures)  
✅ **Phase 9**: Analytics (GA/Plausible, error boundaries, Web Vitals)  
✅ **Phase 10**: Documentation (FAQ, Contributing, API docs)  
✅ **Phase 11**: Polish (Code splitting, accessibility, i18n, optimization)  

---

## 🌐 Live Demo

### Try It Now!
Visit **[synapti-city.vercel.app](https://synapti-city.vercel.app)** to:
1. 🎓 Learn about Hebbian learning
2. 🧪 Experiment with neural networks
3. 📊 Visualize synaptic plasticity
4. 🏆 Complete challenges and earn achievements
5. 💾 Save and share your networks

### API Endpoints
Backend API: **[synapticity-production.up.railway.app](https://synapticity-production.up.railway.app)**

- `GET /health` - Health check
- `GET /` - API information
- `GET /api/networks` - List networks
- `POST /api/networks` - Create network
- `GET /api/users/profile` - User profile
- See [API.md](./API.md) for full documentation

---

## 🛠️ Tech Stack

### Frontend (Vercel)
- **⚛️ React 19** - UI framework
- **📘 TypeScript 6** - Type safety
- **⚡ Vite 8** - Build tool
- **🎨 Tailwind CSS 4** - Styling
- **🌟 Three.js** - 3D visualization
- **📱 PWA** - Offline support

### Backend (Railway)
- **🟢 Node.js 22** - Runtime (with native WebSocket)
- **🚂 Express.js 5** - API framework
- **🔷 TypeScript** - Type safety
- **⚡ tsx** - Direct TS execution
- **🔒 Helmet** - Security headers
- **⏱️ Rate Limiting** - API protection

### Database & Services
- **🐘 Supabase** - PostgreSQL + Auth + Realtime
- **📊 Plausible** - Privacy-friendly analytics
- **🔍 Sentry** - Error monitoring (optional)

### Development
- **🧹 oxlint** - Fast linting
- **🧪 Vitest** - Testing framework
- **🤖 GitHub Actions** - CI/CD
- **📦 npm** - Package management

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** (22+ recommended)
- **npm 9+** or **yarn 4+**
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/sorathiyalaksh37-lang/synaptiCITY.git
cd synaptiCITY

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Open http://localhost:5173
```

### Development Commands

```bash
# Frontend development
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code with oxlint

# Backend development
npm run server           # Start Express server (development)
npm run server:prod      # Start Express server (production)

# Testing
npm run test             # Run tests with Vitest
```

---

## 🚀 Deployment

### Architecture Overview

```
User Browser
     ↓
Vercel Frontend (React + Vite)
  synapti-city.vercel.app
     ↓
Railway Backend (Express + Node.js 22)
  synapticity-production.up.railway.app
     ↓
Supabase Database (PostgreSQL + Auth)
  xblbatyouqzbzgednryn.supabase.co
```

### Deployment Platforms

#### Frontend - Vercel ✅
**Live:** https://synapti-city.vercel.app

- Automatic deployment on push to `main`
- Preview deployments for pull requests
- Environment variables configured
- CDN distribution worldwide

**Setup:**
```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

#### Backend - Railway ✅
**Live:** https://synapticity-production.up.railway.app

- Node.js 22 runtime
- Automatic GitHub deployments
- Environment variables configured
- Free tier with generous limits

**Configuration:**
- `railway.toml` - Deployment settings
- `nixpacks.toml` - Build configuration
- `.nvmrc` - Node version (22)

#### Database - Supabase ✅
**Connected:** PostgreSQL + Realtime + Auth

- Managed PostgreSQL database
- Real-time subscriptions
- Row-level security
- Authentication system

### Environment Variables

**Frontend (.env.local):**
```env
VITE_API_URL=https://synapticity-production.up.railway.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ENABLE_ANALYTICS=true
```

**Backend (Railway):**
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://synapti-city.vercel.app
```

See [DEPLOYMENT_SUCCESS.md](./DEPLOYMENT_SUCCESS.md) for detailed deployment guide.

---

## 🏗️ Architecture

### Project Structure

```
synaptiCITY/
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
├── public/
│   ├── logo.png                 # App logo
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker
│   └── icons/                   # PWA icons
├── server/
│   ├── config/
│   │   ├── database.sql         # DB schema
│   │   └── supabase.ts          # Supabase client
│   ├── controllers/
│   │   ├── networkController.ts # Network CRUD
│   │   └── userController.ts    # User management
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── rateLimiter.ts       # Rate limiting
│   │   └── validator.ts         # Input validation
│   ├── routes/
│   │   ├── networks.ts          # Network routes
│   │   └── users.ts             # User routes
│   └── index.ts                 # Express server
├── src/
│   ├── components/              # React components
│   │   ├── NeuralGrid.tsx       # Network visualization
│   │   ├── TeachInterface.tsx   # Teaching UI
│   │   ├── RecallInterface.tsx  # Recall testing
│   │   ├── ControlPanel.tsx     # Parameter controls
│   │   ├── MultiLayerVisualizer.tsx # Multi-layer networks
│   │   ├── AttentionMechanism.tsx   # Attention viz
│   │   ├── AchievementPanel.tsx     # Gamification
│   │   ├── CommunityLibrary.tsx     # User content
│   │   └── ... (40+ components)
│   ├── lib/
│   │   ├── NeuralNetwork.ts     # Hebbian learning
│   │   ├── MultiLayerNetwork.ts # Backpropagation
│   │   ├── LearningRules.ts     # STDP, BCM, etc.
│   │   └── api.ts               # API client
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts
│   ├── utils/
│   │   ├── exportUtils.ts       # Export functionality
│   │   └── analytics.ts         # Analytics wrapper
│   ├── styles/
│   │   └── index.css            # Tailwind + custom CSS
│   ├── types.ts                 # TypeScript types
│   ├── App.tsx                  # Main app
│   └── main.tsx                 # Entry point
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind setup
├── railway.toml                 # Railway config
├── nixpacks.toml                # Build config
├── vercel.json                  # Vercel config
└── README.md                    # This file
```

### Design System

**Synaptic Bioluminescence** - A bio-mimetic design language:
- **Colors**: Deep neural medium with cyan (#38bdf8) accents
- **Typography**: Space Grotesk (display), Geist (body), JetBrains Mono (code)
- **Visual Language**: Glassmorphism with bioluminescent glow
- **Aesthetic**: Bio-intelligence meets deep-space lab instrumentation

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Main overview & getting started (you are here!) |
| [FAQ.md](./FAQ.md) | 40+ frequently asked questions |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines & development setup |
| [API.md](./API.md) | Backend API reference & examples |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide for all platforms |
| [DEPLOYMENT_SUCCESS.md](./DEPLOYMENT_SUCCESS.md) | Current deployment status & URLs |
| [PWA_GUIDE.md](./PWA_GUIDE.md) | Progressive Web App features |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | WCAG compliance & a11y audit |
| [PROGRESS.md](./PROGRESS.md) | Development progress (100% complete!) |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Technical architecture overview |

---

## 🎓 Educational Content

### Connection to Real AI: BDH & BDH-CQ

#### Dragon Hatchling (BDH)
BDH reformulates attention as **synaptic memory** through Hebbian-style writes, enabling models to learn from context without massive key-value caches.

#### BDH-CQ (Contextual Memory + Reasoning)
BDH-CQ extends synaptic memory with **latent reasoning**—learning from demonstrations without requiring chain-of-thought explanations.

### Toy Model vs. Real System

| Aspect | Our Toy Model | BDH/BDH-CQ |
|--------|---------------|------------|
| **Scale** | 6-50 nodes | Variable scale |
| **Learning Rule** | Hebbian: Δw = η × aᵢ × aⱼ | Hebbian-inspired + backprop |
| **Memory** | Visible weight matrix | Hidden synaptic state |
| **Interference** | Demonstrated directly | Managed through architecture |
| **Purpose** | Educational visualization | Production AI reasoning |

### Research Sources

- **BDH Architecture**: Kosowski, A. et al. (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*. [arXiv:2509.26507](https://arxiv.org/abs/2509.26507)
- **BDH-CQ**: Engdahl, B. et al. (2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*. [arXiv:2608.09888](https://arxiv.org/abs/2608.09888)
- **Supporting Context (TTT)**: Sun, Y. et al. (2024). *Learning to (Learn at Test Time): RNNs with Expressive Hidden States*. [arXiv:2407.04620](https://arxiv.org/abs/2407.04620)

---

## 🛠️ Development

### Setup Development Environment

```bash
# 1. Clone and install
git clone https://github.com/sorathiyalaksh37-lang/synaptiCITY.git
cd synaptiCITY
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 3. Set up Supabase (optional, for backend features)
# Create project at https://supabase.com
# Run server/config/database.sql in SQL editor
# Add credentials to .env.local

# 4. Start development servers
npm run dev              # Frontend (http://localhost:5173)
npm run server           # Backend (http://localhost:3001)
```

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm run lint             # Check code style
npm run test             # Run tests
npm run build            # Test production build

# Commit changes
git add .
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

### Code Style

- **Linting**: oxlint (faster than ESLint)
- **Formatting**: Prettier (configured in package.json)
- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for variables, PascalCase for components

### Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test
npm run test NeuralNetwork.test.ts
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code of conduct
- Development setup
- Pull request process
- Coding standards
- Testing requirements

### Quick Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 🎯 Roadmap

### Completed ✅
- ✅ All 11 development phases (100% complete!)
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Railway
- ✅ Database on Supabase
- ✅ PWA with offline support
- ✅ Full documentation suite

### Future Enhancements 🚀
- [ ] Custom domains for production
- [ ] Advanced monitoring & alerting
- [ ] Automated backup system
- [ ] Mobile native apps (React Native)
- [ ] Multiplayer collaboration features
- [ ] More learning modules & content
- [ ] Integration with educational platforms

---

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: 620KB JS (160KB gzipped), 113KB CSS (19KB gzipped)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Code Splitting**: Enabled for optimal loading

---

## 🔒 Security

- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Rate limiting on API endpoints
- ✅ JWT authentication
- ✅ Input validation and sanitization
- ✅ HTTPS on all services
- ✅ Environment variables secured
- ✅ No secrets in repository

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### Third-Party Licenses

This project uses open-source dependencies. See `package.json` for a complete list. Major dependencies include:
- React (MIT)
- Express.js (MIT)
- Three.js (MIT)
- Tailwind CSS (MIT)
- Supabase JS SDK (MIT)

---

## 🙏 Acknowledgments

- **Dragon Hatchling (BDH)** research team for synaptic memory concepts
- **BDH-CQ** researchers for contextual reasoning insights
- **Pathway Track** for inspiring this educational resource
- **Open Source Community** for amazing tools and libraries
- **Vercel** for hosting the frontend
- **Railway** for hosting the backend
- **Supabase** for database infrastructure

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/sorathiyalaksh37-lang/synaptiCITY/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sorathiyalaksh37-lang/synaptiCITY/discussions)
- **Email**: [Contact through GitHub](https://github.com/sorathiyalaksh37-lang)

---

## 🌟 Star History

If you find synaptiCITY helpful, please consider giving it a star ⭐ on GitHub!

---

<div align="center">

**Built with 🧠 for understanding how connections become memory**

[Live Demo](https://synapti-city.vercel.app) • [Documentation](./FAQ.md) • [API Docs](./API.md) • [Contributing](./CONTRIBUTING.md)

</div>
