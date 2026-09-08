# synaptiCITY — When Connections Become Memory

> **An interactive visual simulation for understanding how learning can emerge from changing connection strengths.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00d4ff?style=for-the-badge)](https://synapti-city.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Railway-7B61FF?style=for-the-badge)](https://railway.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## 🌐 Live Application

**Try synaptiCITY:**  
https://synapti-city.vercel.app

synaptiCITY is an interactive educational environment that lets users **teach associations, observe synaptic changes, recall learned information, and explore interference** through a live neural-network simulation.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Core Idea](#-core-idea)
- [How the Simulation Works](#-how-the-simulation-works)
- [Features](#-features)
- [Live vs Computed vs Precomputed](#-live-vs-computed-vs-precomputed)
- [Learning Objectives](#-learning-objectives)
- [Intended Learners](#-intended-learners)
- [Connection to Real AI](#-connection-to-real-ai)
- [Toy Model vs Real Systems](#-toy-model-vs-real-systems)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Design Philosophy](#-design-philosophy)
- [One-Page Concept Summary](#-one-page-concept-summary)
- [Quick Start](#-quick-start)
- [Development Commands](#-development-commands)
- [Deployment](#-deployment)
- [API](#-api)
- [Documentation](#-documentation)
- [Research & References](#-research--references)
- [AI Assistance & Provenance](#-ai-assistance--provenance)
- [Development Progress](#-development-progress)
- [Contributing](#-contributing)
- [License](#-license)
- [Credits](#-credits)

---

# 🧠 Overview

synaptiCITY explores a simple but powerful question:

> **What if memory is not only stored in fixed parameters, but can emerge from temporarily changing the strength of connections?**

The project provides a visual and interactive way to explore this idea using a simplified neural network.

Instead of only displaying precomputed diagrams, synaptiCITY allows users to interact with a running simulation:

**Teach → Update → Change Connections → Recall → Interfere → Observe**

The goal is to make concepts such as **Hebbian learning, synaptic plasticity, dynamic state, recurrent memory, and brain-inspired AI** easier to understand.

---

# ⚡ Core Idea

Traditional machine-learning models often distinguish between:

- **Parameters** — weights learned during training
- **Activations** — temporary values produced during inference

synaptiCITY introduces an educational third perspective:

> **Connection strength can itself become a dynamic form of memory.**

For example, if the user repeatedly teaches:

```text
DOG → ANIMAL
```

the simulation strengthens the corresponding connection.

A simplified Hebbian update is represented as:

$$\Delta w = \eta \times a_i \times a_j$$

Where:

- `Δw` = change in connection strength
- `η` = learning rate
- `aᵢ` = activity of the source neuron
- `aⱼ` = activity of the destination neuron

The result is visible immediately in the simulation.

---

# 🔄 How the Simulation Works

### 1. Teach

The user introduces an association such as:

```text
DOG → ANIMAL
```

### 2. Hebbian Update

Active neurons cause their connecting weight to change.

```text
Δw = η × aᵢ × aⱼ
```

### 3. Synaptic Change

The corresponding connection becomes stronger or weaker depending on activity.

The visualization reflects this change in real time.

### 4. Recall

The user presents the learned concept again.

The network uses its current state and connection strengths to produce a prediction.

### 5. Interference

The user can introduce another association.

For example:

```text
DOG → PET
```

This allows users to observe how new learning can modify or compete with previously established associations.

---

# ✨ Features

## Interactive Neural Network

- Live neural-network visualization
- Animated neurons and connections
- Connection strength represented visually
- Multi-layer visualization
- Dynamic state updates

## Hebbian Learning

Users can directly observe the simplified Hebbian learning rule:

```text
Δw = η × aᵢ × aⱼ
```

Learning rate and other parameters can be adjusted to explore their effects.

## Teach & Recall

Users can:

- Teach associations
- Repeat learning
- Recall learned concepts
- Observe prediction changes
- Experiment with competing associations

## Interference

New learning can interact with existing connection strengths, providing an intuitive demonstration of interference and forgetting.

## State Debugging

The project exposes internal simulation state so learners can inspect:

- Neuron activity
- Connection weights
- Learning updates
- Network state
- Predictions

## Multi-Layer Visualization

The simulation can represent multiple layers to provide a more realistic conceptual picture of information flowing through a neural system.

## BDH / BDH-CQ Conceptual Module

The project includes an educational connection to:

- **The Dragon Hatchling (BDH)**
- **BDH-CQ**
- Recurrent latent reasoning
- Synaptic-style memory
- Dynamic state

This module is intentionally conceptual rather than a reproduction of the original research systems.

## Gamification

The application includes interactive learning elements such as:

- Achievements
- Progress tracking
- Learning challenges
- Exploration-based interactions

## Community Library

Users can explore and share learned network configurations through the application's community-oriented features.

## PWA Support

synaptiCITY is designed to work as a Progressive Web App, allowing installation and a more app-like experience.

## Accessibility & Responsive Design

The interface is designed to support:

- Responsive layouts
- Keyboard-friendly interaction
- Accessible visual hierarchy
- Reduced-motion considerations

---

# 📊 Live vs Computed vs Precomputed

One important goal of synaptiCITY is transparency.

Not every visual element represents a live neural computation.

### 🟢 Live / Dynamic

The following are generated or updated during interaction:

- Neuron activity
- Connection weights
- Hebbian updates
- Predictions
- Network state
- SVG/canvas connection visuals
- Interactive transitions

### 🔵 Computed

Values calculated from the current simulation state include:

- Weight changes
- Activation values
- Prediction scores
- Network responses
- Learning updates

### ⚪ Static / Precomputed

Some educational content is intentionally static:

- Vocabulary/examples
- Explanatory text
- BDH background information
- Research references
- Educational descriptions

### 🎨 Animated

Animations communicate state changes and interaction:

- Neuron activation
- Connection strengthening
- Learning events
- Recall transitions
- Interface feedback

> **Important:** synaptiCITY is a toy educational model. It is not a full implementation of BDH, BDH-CQ, or an actual large language model.

---

# 🎯 Learning Objectives

After interacting with synaptiCITY, learners should be able to understand:

- What Hebbian learning means
- How activity can modify connection strength
- How synaptic plasticity can encode recent activity
- The difference between static parameters and dynamic state
- How recurrent systems can maintain information
- Why interference can occur during continual learning
- Why dynamic memory is interesting for AI
- At a high level, how BDH connects neural-network ideas with synaptic-style memory
- At a high level, what BDH-CQ adds through latent recurrent reasoning

---

# 👩‍💻 Intended Learners

synaptiCITY is aimed primarily at students and developers interested in:

- Neural networks
- Machine learning
- Deep learning
- Hebbian learning
- Synaptic plasticity
- Recurrent neural networks
- Brain-inspired AI
- Continual learning
- Modern AI architectures

### Prerequisites

Basic familiarity with:

- Neural networks
- Activations
- Weights
- Machine-learning fundamentals

No neuroscience expertise is required.

---

# 🤖 Connection to Real AI

synaptiCITY is inspired by a broader idea appearing in modern AI research:

> **Can neural networks learn through dynamic state changes rather than relying exclusively on fixed parameters?**

This provides a conceptual bridge toward architectures such as **The Dragon Hatchling (BDH)**.

BDH explores a formulation where attention-like computation can be represented through recurrent/synaptic-style memory updates.

BDH-CQ extends these ideas toward **in-context learning and recurrent latent reasoning**.

synaptiCITY simplifies these ideas into an interactive toy environment so learners can see the underlying intuition.

---

# 🔬 Toy Model vs Real Systems

| Concept | synaptiCITY | Real BDH / BDH-CQ |
|---|---|---|
| Neural connections | Simplified | Research architecture |
| Learning rule | Simplified Hebbian update | More sophisticated mechanisms |
| Memory | Connection strength | Learned/dynamic latent state |
| Network | Small educational model | Large-scale architecture |
| Training | Interactive simulation | Research training procedures |
| Reasoning | Educational demonstration | Actual model computation |
| Scale | Browser-based toy model | Research-scale AI |
| Purpose | Education & visualization | AI research |

> synaptiCITY should therefore be understood as an **educational bridge to the concepts**, not as an implementation of BDH or BDH-CQ.

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Three.js
- Progressive Web App support

## Backend

- Node.js
- Express
- TypeScript
- WebSocket support
- Helmet
- Rate limiting

## Database & Services

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Realtime
- Plausible Analytics
- Optional Sentry integration

## Development & Quality

- Vitest
- oxlint
- GitHub Actions
- Vercel
- Railway

---

# 🏗 Architecture

```text
┌──────────────────────────────────────┐
│            React Frontend            │
│                                      │
│  NeuralGrid                          │
│  TeachInterface                      │
│  RecallInterface                     │
│  ControlPanel                        │
│  MultiLayerVisualizer                │
│  AttentionMechanism                  │
│  AchievementPanel                    │
│  CommunityLibrary                    │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         Simulation / Logic            │
│                                      │
│  NeuralNetwork.ts                    │
│  MultiLayerNetwork.ts                │
│  LearningRules.ts                    │
│  State + Weight Updates              │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│            Backend API               │
│                                      │
│  Express + TypeScript                │
│  Controllers                         │
│  Routes                              │
│  Middleware                          │
│  WebSocket                           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│              Supabase                │
│                                      │
│  PostgreSQL                          │
│  Authentication                      │
│  Realtime                            │
└──────────────────────────────────────┘
```

### Project Structure

```text
synaptiCITY/
│
├── src/
│   ├── components/
│   │   ├── NeuralGrid.tsx
│   │   ├── TeachInterface.tsx
│   │   ├── RecallInterface.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── MultiLayerVisualizer.tsx
│   │   ├── AttentionMechanism.tsx
│   │   ├── AchievementPanel.tsx
│   │   └── CommunityLibrary.tsx
│   │
│   ├── lib/
│   │   ├── NeuralNetwork.ts
│   │   ├── MultiLayerNetwork.ts
│   │   ├── LearningRules.ts
│   │   └── api.ts
│   │
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── config/
│
├── public/
├── package.json
└── README.md
```

---

# 🎨 Design Philosophy

synaptiCITY uses a visual language inspired by **bioluminescence, neural activity, and deep-space laboratories**.

The design system is centered around:

- Deep neural environments
- Cyan/bioluminescent accents
- Glassmorphism
- Animated neural connections
- Space Grotesk / Geist typography
- JetBrains Mono for technical information
- Data-driven visual feedback

The objective is not animation for decoration alone.

> **Animation is used as part of the explanation.**

When a connection becomes stronger, the visual system should communicate that change immediately.

---

# 📄 One-Page Concept Summary

For a quick overview of the project's **problem, concept, learning approach, technical direction, and BDH/BDH-CQ connection**, see the one-page concept document:

📄 **[Read the One-Page Concept Summary](./one-page-concept-summary.pdf)**

This is intended as a concise introduction for reviewers, teammates, mentors, or anyone who wants to understand the project before exploring the full application.

---

# 🚀 Quick Start

### Requirements

- Node.js 18+
- npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd synaptiCITY
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available through the local Vite development server.

---

# 🧪 Development Commands

```bash
# Start development server
npm run dev

# Build production application
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run linting
npm run lint
```

---

# ☁️ Deployment

The current deployment architecture is:

```text
User
 │
 ▼
Vercel
Frontend
 │
 ▼
Railway
Backend API
 │
 ▼
Supabase
Database + Auth + Realtime
```

### Frontend

Deployed through Vercel.

### Backend

Deployed through Railway.

### Database

Supabase/PostgreSQL provides persistence and backend services.

---

# 🔌 API

The backend currently exposes endpoints including:

### Health

```http
GET /health
```

### API Root

```http
GET /
```

### Networks

```http
GET /api/networks
POST /api/networks
```

### User Profile

```http
GET /api/users/profile
```

For detailed API information, see:

**[API Documentation](./API.md)**

---

# 📚 Documentation

Additional project documentation:

- 📄 **[One-Page Concept Summary](./one-page-concept-summary.pdf)**
- 📘 **[FAQ](./FAQ.md)**
- 🤝 **[Contributing Guide](./CONTRIBUTING.md)**
- 🔌 **[API Documentation](./API.md)**
- 🚀 **[Deployment Guide](./DEPLOYMENT.md)**
- ✅ **[Deployment Success](./DEPLOYMENT_SUCCESS.md)**
- 📱 **[PWA Guide](./PWA_GUIDE.md)**
- ♿ **[Accessibility Guide](./ACCESSIBILITY.md)**
- 📈 **[Development Progress](./PROGRESS.md)**
- 📋 **[Project Summary](./PROJECT_SUMMARY.md)**

---

# 📚 Research & References

The educational concepts in synaptiCITY are informed by research on dynamic memory, recurrent learning, synaptic-style computation, and modern brain-inspired AI.

### 1. The Dragon Hatchling

Kosowski et al. (2025)

**The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain**

arXiv:2509.26507

https://arxiv.org/abs/2509.26507

### 2. BDH-CQ

Engdahl et al. (2026)

**BDH-CQ: In-Context Learning with Recurrent Latent Reasoning**

arXiv:2608.09888

https://arxiv.org/abs/2608.09888

### 3. Learning to Learn at Test Time

Sun et al. (2024)

**Learning to (Learn at Test Time): RNNs with Expressive Hidden States**

arXiv:2407.04620

https://arxiv.org/abs/2407.04620

---

# 🤖 AI Assistance & Provenance

AI-assisted development was used during parts of the project for:

- Brainstorming
- Code generation and debugging
- UI/UX iteration
- Documentation
- Research exploration
- Development planning

AI assistance does **not** imply that the underlying research concepts are original to synaptiCITY.

The project explicitly credits the research and ideas that inspired its educational model.

---

# 📈 Development Progress

The project has been developed through multiple phases:

| Phase | Area | Status |
|---|---|---|
| 1 | Core Simulation | ✅ Complete |
| 2 | Educational Features | ✅ Complete |
| 3 | Technical Features | ✅ Complete |
| 4 | Gamification | ✅ Complete |
| 5 | Community | ✅ Complete |
| 6 | Backend | ✅ Complete |
| 7 | Advanced AI Concepts | ✅ Complete |
| 8 | PWA | ✅ Complete |
| 9 | Analytics | ✅ Complete |
| 10 | Documentation | ✅ Complete |
| 11 | Polish | ✅ Complete |

---

# 🤝 Contributing

Contributions are welcome.

If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Commit your changes
6. Open a pull request

Please read the **[Contributing Guide](./CONTRIBUTING.md)** before submitting a contribution.

---

# 📜 License

This project is licensed under the **MIT License**.

See [LICENSE](./LICENSE) for details.

---

# 🙌 Credits

synaptiCITY is inspired by research and ideas around:

- Hebbian learning
- Synaptic plasticity
- Recurrent neural computation
- Continual learning
- The Dragon Hatchling (BDH)
- BDH-CQ
- Brain-inspired AI

The project was developed as part of the **Pathway Track** and focuses on making advanced AI concepts easier to understand through interactive visualization.

---

# 💡 Final Thought

> **Learning does not always have to mean changing everything. Sometimes, it can mean changing the strength of a connection.**

synaptiCITY turns that idea into something users can **see, interact with, modify, and understand**.

**Teach a connection. Watch it strengthen. Recall it. Interfere with it.**

That's where the concept of **memory through dynamic connections** becomes tangible.
