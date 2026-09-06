# synaptiCITY - When Connections Become Memory

An interactive educational simulation demonstrating how **synaptic plasticity**—the strengthening of connections between neurons—creates short-term memory. Watch memory emerge in real-time through Hebbian learning, experiment with parameters, and discover the connection to cutting-edge AI systems like Dragon Hatchling (BDH) and BDH-CQ.

![synaptiCITY](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)
![License](https://img.shields.io/badge/license-MIT-green)

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

## 🚀 Reproducing the Demo

This application is entirely frontend/client-side.

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
npm run build
npm run preview
```

## 🏗️ Artifact Architecture

The repository is built primarily as a client-side React/Vite application:

```
synapticity/
├── src/
│   ├── components/      # React components (Visual network, Control panel, Debug panel, BDH module)
│   ├── lib/
│   │   └── NeuralNetwork.ts # Pure JS implementation of the toy neural network (Hebbian logic)
│   ├── utils/           # Utilities for the application state
│   ├── styles/          # Tailwind CSS styles
│   └── App.tsx          # Main application orchestrator for the educational stages
├── package.json         # Dependencies (React, Vite, Tailwind, oxlint)
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

### External Assets & Licenses
- **Code Dependencies**: The project utilizes standard open-source web technologies including `react`, `react-dom`, `vite`, and `tailwindcss`. For complete license information of dependencies, refer to `package.json` and the respective package metadata which should be treated as authoritative.
- **Visual Assets**: Standard `react.svg` and `vite.svg` are included as default Vite assets. There are no other external images or icon libraries used.
- **Code License**: This project is licensed under the MIT License.

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
