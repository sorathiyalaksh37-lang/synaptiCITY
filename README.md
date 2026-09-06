# synaptiCITY - When Connections Become Memory

An interactive educational simulation demonstrating how **synaptic plasticity**—the strengthening of connections between neurons—creates short-term memory. Watch memory emerge in real-time through Hebbian learning, experiment with parameters, and discover the connection to cutting-edge AI systems like Dragon Hatchling (BDH) and BDH-CQ.

![synaptiCITY](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Deployment](https://img.shields.io/badge/deployed-Vercel-black)

## 🌐 Live Demo

**Experience synaptiCITY now:** [https://synapti-city.vercel.app](https://synapti-city.vercel.app)

## 🎨 Design System

Built with the **Synaptic Bioluminescence** design system:
- **Color Palette**: Deep neural medium with cyan (#38bdf8) accents, dark backgrounds (#10131c)
- **Typography**: Space Grotesk (display), Geist (body), JetBrains Mono (code)
- **Visual Language**: Glassmorphism with bioluminescent glow effects
- **Aesthetic**: Bio-mimetic intelligence meets deep-space lab instrumentation

## 🧠 The Core Claim

**Memory can emerge from temporarily changing the strength of connections in a neural system, and this mechanism enables both rapid learning and interference between competing memories.**

## 🎯 Intended Learner

This project is intended for learners interested in:
- Neural networks and machine learning memory
- Hebbian learning and synaptic plasticity
- Recurrent models and brain-inspired AI

It is designed to be accessible to beginners and intermediate learners looking to build intuition about how connections store memory.

## 📚 Prerequisites

**To understand the concepts:**
Basic familiarity with:
- Neural networks
- Neurons/activations
- Weights
- Basic machine-learning terminology

**To run the project:**
- Node.js 18+ and npm

## 🎯 Learning Objectives

By the end of this module, the learner should be able to:
- Explain the basic intuition behind Hebbian learning.
- Explain how changing connection strengths can encode recent activity.
- Distinguish static parameters from dynamically changing state.
- Understand the role of synaptic plasticity in the demonstrated model.
- Understand at a high level how BDH/BDH-CQ relate to recurrent memory and brain-inspired computation.
- Inspect the interactive state/weight changes demonstrated by the application.

## ✨ Features

### Core Simulation
- 🎨 **Visual Neural Network**: See nodes and weighted connections in real-time
- 📚 **Interactive Teaching**: Teach associations like DOG → ANIMAL
- 🔍 **Live Recall Testing**: Watch the network predict based on learned connections
- ⚡ **Hebbian Learning**: Implements the rule Δw = η × aᵢ × aⱼ
- 🎛️ **Parameter Control**: Adjust learning rate and repetitions
- 🔬 **Interference Demo**: See competing memories weaken each other

### Advanced Features
- 🐛 **State Debug Panel**: Inspect the weight matrix and activations
- 🧪 **BDH & BDH-CQ Module**: Connect toy model to real AI research
- ✅ **Sixty-Second Test**: Verify understanding with quiz
- ♿ **Accessibility**: Full ARIA labels and keyboard navigation
- 📱 **Responsive Design**: Works on all screen sizes

## 🚦 Live vs Precomputed vs Animated

To provide full transparency on what you are seeing:
- **Live / computed**:
  - The neural network state (activations and weight matrix)
  - The weight updates via the Hebbian learning rule (`teach` function)
  - The prediction/recall calculations
  - The SVG lines displaying the weight matrix (thickness and color reflect the live computed weights)
- **Precomputed**:
  - The small vocabulary set (6 static words)
  - The text of the BDH/BDH-CQ educational module
- **Animated / decorative**:
  - The smooth SVG path transitions when weights change (visually interpolated by React/CSS, representing live state)
  - UI stage transitions

*Note: The UI is an educational simulation of a simple Hebbian network, not a real BDH/LLM model.*

## 🚀 Quick Start

### Try it Online
Visit **[https://synapti-city.vercel.app](https://synapti-city.vercel.app)** to experience the simulation immediately.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/sorathiyalaksh37-lang/synaptiCITY.git
cd synaptiCITY

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview

# Lint the code
npm run lint
```

## 🚀 Deployment

This project is configured for automated deployment with GitHub Actions and Vercel.

### Automatic Deployment
Every push to the `main` branch automatically triggers:
1. ✅ Linting and build verification
2. ✅ Production deployment to Vercel
3. ✅ Preview deployments for pull requests

### Manual Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **Static hosting**: Deploy the `dist` folder after `npm run build`

See [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md) for detailed deployment instructions.

## 🏗️ Artifact Architecture

The repository is built primarily as a client-side React/Vite application:

```
synapticity/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD pipeline
├── public/
│   ├── logo.png            # Hexagonal neural network logo
│   └── logo-icon.svg       # SVG logo icon
├── src/
│   ├── components/         # React components
│   │   ├── Logo.tsx        # Brand logo component
│   │   ├── NeuralGrid.tsx  # Visual network display
│   │   ├── TeachInterface.tsx
│   │   ├── RecallInterface.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── StateDebugPanel.tsx
│   │   ├── ConnectionInspector.tsx
│   │   ├── CompetingMemoryPanel.tsx
│   │   ├── TeachingHistory.tsx
│   │   ├── GuidedTour.tsx
│   │   ├── ExperimentStageRail.tsx
│   │   ├── BDHModule.tsx
│   │   └── SixtySecondTest.tsx
│   ├── lib/
│   │   └── NeuralNetwork.ts # Hebbian learning implementation
│   ├── utils/
│   │   └── transitionSound.ts
│   ├── styles/
│   │   └── index.css       # Synaptic Bioluminescence design system
│   ├── types.ts
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vercel.json             # Vercel deployment config
├── netlify.toml            # Netlify deployment config
└── README.md
```
- **React/Vite Application**: Provides the interactive educational stage and navigation structure.
- **Neural-Network Simulation**: A pure JavaScript implementation (`src/lib/NeuralNetwork.ts`) that manages the vocabulary, weights, and Hebbian learning updates without external ML libraries.
- **Visualization Components**: Custom React components rendering the nodes and weighted connections based on live state.

## 🧬 Connection to Real AI: BDH & BDH-CQ

### Dragon Hatchling (BDH)

BDH reformulates attention as **synaptic memory** through Hebbian-style writes, enabling models to learn from context without massive key-value caches.

### BDH-CQ (Contextual Memory + Reasoning)

BDH-CQ extends the synaptic memory mechanism with **latent reasoning**—learning from demonstrations without requiring chain-of-thought explanations.

### Toy Model vs. Real System

| Aspect | Our Toy Model | BDH/BDH-CQ |
|--------|---------------|------------|
| **Scale** | 6-word vocabulary | Variable scale |
| **Learning Rule** | Hebbian: Δw = η × aᵢ × aⱼ | Hebbian-inspired with backprop |
| **Memory** | Visible weight matrix | Hidden synaptic state |
| **Interference** | Demonstrated directly | Managed through architecture |
| **Purpose** | Educational visualization | Production AI reasoning |

### ⚠️ Important Distinction

Our toy model demonstrates **one mechanism** used in real systems. It is NOT a reimplementation of BDH or BDH-CQ. Published benchmark results (ARC-AGI, Sudoku) come from the original research papers, not our simulation.

## 📚 Sources, Licenses & Attribution

### Research Sources
- **BDH Architecture**: Kosowski, A. et al. (2025). *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*. [arXiv:2509.26507](https://arxiv.org/abs/2509.26507)
- **BDH-CQ**: Engdahl, B. et al. (2026). *BDH-CQ: In-Context Learning with Recurrent Latent Reasoning*. [arXiv:2608.09888](https://arxiv.org/abs/2608.09888)
- **Supporting Context (TTT)**: Sun, Y. et al. (2024). *Learning to (Learn at Test Time): RNNs with Expressive Hidden States*. [arXiv:2407.04620](https://arxiv.org/abs/2407.04620)

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom CSS (Synaptic Bioluminescence Design System)
- **Fonts**: Space Grotesk, Geist, JetBrains Mono
- **Linting**: oxlint
- **Deployment**: Vercel, Netlify (configured)
- **CI/CD**: GitHub Actions

### External Assets & Licenses
- **Code Dependencies**: The project utilizes standard open-source web technologies. For complete license information of dependencies, refer to `package.json` and the respective package metadata.
- **Visual Assets**: Custom hexagonal neural network logo design
- **Code License**: This project is licensed under the MIT License.

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

### Design System
The **Synaptic Bioluminescence** design system tokens are defined in `src/styles/index.css`:
- Color tokens for surfaces, primary (cyan), secondary (indigo), tertiary (violet)
- Typography scale with semantic naming
- Spacing scale (8px base rhythm)
- Border radius tokens
- Glassmorphism and bioluminescent glow utilities

## 🤖 AI Assistance & Provenance

During the development of this project, AI-assisted development tools were utilized for:
- Code implementation and refactoring assistance
- Documentation drafting and editing
- UI and content iteration

**Provenance Note**:
- The final implementation was reviewed and tested by the project team.
- Technical claims are grounded in the cited primary sources, not AI-generated hallucinations.
- Generated suggestions were checked before being incorporated.

## 🙏 Credits

- **Dragon Hatchling (BDH)** research team for the synaptic memory concept
- **BDH-CQ** researchers for contextual reasoning insights
- **Pathway Track** for inspiring this educational resource

---

**Built for understanding how connections become memory.**
