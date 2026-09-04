# synaptiCITY - When Connections Become Memory

⭐⭐⭐⭐⭐ **A uniquely interactive approach to understanding synaptic plasticity**

An interactive educational simulation demonstrating how **synaptic plasticity**—the strengthening of connections between neurons—creates short-term memory. Watch memory emerge in real-time through Hebbian learning, experiment with parameters, and discover the connection to cutting-edge AI systems like Dragon Hatchling (BDH) and BDH-CQ.

![synaptiCITY](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🧠 The Core Claim

**Memory can emerge from temporarily changing the strength of connections in a neural system, and this mechanism enables both rapid learning and interference between competing memories.**

## 🎯 What Problem Are We Solving?

Students can read that "synaptic plasticity allows recent activity to modify connection strengths," but they still don't understand:

- **What exactly changes?** (Abstract concept, no visual)
- **Where is the memory?** (Hidden in matrices)
- **How does changing a connection allow recall?** (Counterintuitive)
- **Why does repetition strengthen memory?** (Not obvious)
- **What happens when memories compete?** (Not explained)
- **How does this connect to modern AI?** (No bridge)

**synaptiCITY solves this** through live, interactive computation where learners can see memory forming, break it through interference, and connect the intuition to real AI architectures.

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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

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

## 🎓 The Learning Journey

1. **Intuition**: "What if memory isn't a place, but a change?"
2. **Neural Connections**: Visual grid of nodes and weighted edges
3. **Repeated Activity**: Teach DOG → ANIMAL three times
4. **Connection Strength Changes**: Line thickens, color changes from red to green
5. **Memory Emerges**: System now recalls ANIMAL when asked DOG → ?
6. **Recall Test**: Verify the network learned
7. **Interference**: Teach DOG → PET → both connections weaken
8. **Why This Matters for AI**: Connection to BDH's synaptic memory mechanism
9. **BDH & BDH-CQ**: Equations, architecture, published evidence
10. **Sixty-Second Test**: Prove understanding
11. **Limitations**: Interference, forgetting, toy vs real model

## 🔬 Try This: Interference Experiment

1. Teach DOG → ANIMAL (repeat 5 times)
2. Test recall: DOG → ? (should predict ANIMAL)
3. Now teach DOG → PET (repeat 5 times)
4. Test recall again: DOG → ? (watch what happens!)

This demonstrates **interference**—a fundamental limitation of synaptic memory.

## 🧬 Connection to Real AI: BDH & BDH-CQ

### Dragon Hatchling (BDH)

BDH reformulates attention as **synaptic memory** through Hebbian-style writes, enabling models to learn from context without massive key-value caches.

**Core recurrent update:**
```
h_t = f(W · x_t + U · h_{t-1})
```

Where:
- `h_t` = hidden state at time t
- `W, U` = learned weight matrices
- `f` = non-linear activation function

### BDH-CQ (Contextual Memory + Reasoning)

BDH-CQ extends the synaptic memory mechanism with **latent reasoning**—learning from demonstrations without requiring chain-of-thought explanations.

**Key capabilities:**
- Learning from demonstrations
- Reasoning without verbal chain-of-thought
- Proven on ARC-AGI benchmark
- Scales from 1B to 600B parameters

### Toy Model vs. Real System

| Aspect | Our Toy Model | BDH/BDH-CQ |
|--------|---------------|------------|
| **Scale** | 6-word vocabulary | 1B-600B parameters |
| **Learning Rule** | Hebbian: Δw = η × aᵢ × aⱼ | Hebbian-inspired with backprop |
| **Memory** | Visible weight matrix | Hidden synaptic state |
| **Interference** | Demonstrated directly | Managed through architecture |
| **Purpose** | Educational visualization | Production AI reasoning |

### ⚠️ Important Distinction

Our toy model demonstrates **one mechanism** used in real systems. It is NOT a reimplementation of BDH or BDH-CQ. Published benchmark results (ARC-AGI, Sudoku) come from the original research papers, not our simulation.

## 📚 Primary Sources

- **Dragon Hatchling (2025)**: BDH architecture and equations
- **BDH-CQ Technical Report (2026)**: Contextual memory and reasoning
- **The Equations of Reasoning**: Microscopic graph dynamics
- **From Attention to Synapses**: Theoretical derivation of BDH

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     synaptiCITY ARCHITECTURE                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              USER INTERFACE (React)                  │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐    │   │
│  │  │ Neural  │  │Controls │  │  Debug Panel    │    │   │
│  │  │  Grid   │  │         │  │  (State Viewer) │    │   │
│  │  └─────────┘  └─────────┘  └─────────────────┘    │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐    │   │
│  │  │  BDH    │  │  60-    │  │  Expected vs    │    │   │
│  │  │ Module  │  │ Second  │  │  Model Output   │    │   │
│  │  │         │  │  Test   │  │                 │    │   │
│  │  └─────────┘  └─────────┘  └─────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↕                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           NEURAL NETWORK (Plain JS)                 │   │
│  │  ┌─────────────────────────────────────────────┐  │   │
│  │  │           Hebbian Learning Rule              │  │   │
│  │  │      Δw = η × aᵢ × aⱼ                      │  │   │
│  │  └─────────────────────────────────────────────┘  │   │
│  │  ┌─────────────────────────────────────────────┐  │   │
│  │  │           Weight Matrix                      │  │   │
│  │  │  [0.0, 0.8, 0.2]                           │  │   │
│  │  │  [0.1, 0.0, 0.9]                           │  │   │
│  │  │  [0.3, 0.4, 0.0]                           │  │   │
│  │  └─────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | React + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Visualization** | Custom SVG Components |
| **Neural Network** | Plain JavaScript (no external libs) |
| **Hebbian Learning** | Custom implementation |
| **Math Rendering** | HTML/CSS (no external math lib needed) |
| **Build Tool** | Vite |
| **Linting** | ESLint + TypeScript |

## 📁 Project Structure

```
synapticity/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── NeuralGrid.tsx          # Neural network visualization
│   │   ├── TeachInterface.tsx      # Teaching UI
│   │   ├── RecallInterface.tsx     # Recall testing UI
│   │   ├── ControlPanel.tsx        # Parameter controls
│   │   ├── StateDebugPanel.tsx     # Weight matrix viewer
│   │   ├── BDHModule.tsx           # BDH/BDH-CQ content
│   │   └── SixtySecondTest.tsx     # Quiz component
│   ├── lib/
│   │   └── NeuralNetwork.ts        # Core Hebbian learning logic
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── styles/
│   │   └── index.css               # Global styles + Tailwind
│   ├── App.tsx                     # Main application
│   └── main.tsx                    # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🧪 Key Components

### NeuralNetwork Class

The core of the simulation implements Hebbian learning:

```typescript
// Hebbian learning rule: Δw = η × aᵢ × aⱼ
private hebbianUpdate(inputWord: string, outputWord: string): void {
  const i = this.getIndex(inputWord);
  const j = this.getIndex(outputWord);
  
  const ai = this.activations[i];
  const aj = this.activations[j];
  
  const deltaW = this.learningRate * ai * aj;
  this.weights[i][j] += deltaW;
}
```

### Modular Utilities

For advanced use cases, we also provide modular utilities in `src/utils/`:

```typescript
import { createInitialState, teach, recall } from './utils';

// Create network state
let state = createInitialState(6, 0.1);

// Teach association
state = teach(state, 0, 1, 3); // Node 0 → Node 1, 3 times

// Test recall
const result = recall(state.weights, 0);
```

**See [UTILITIES_GUIDE.md](UTILITIES_GUIDE.md) for complete API reference.**

### NeuralGrid Component

Visualizes the network state with SVG:
- Nodes sized and colored by activation
- Edges colored by weight (red = weak, green = strong)
- Edge thickness proportional to weight
- Smooth animations on state changes

## 🎨 Design Decisions

1. **Plain JavaScript Neural Network**: No external ML libraries to keep the mechanism transparent and educational
2. **SVG Visualization**: Scalable, accessible, and performant
3. **Circular Layout**: Shows all-to-all connections clearly
4. **Color Coding**: Intuitive weak → strong progression (red → orange → green)
5. **State Debug Panel**: Exposes internal state for deeper learning
6. **Tab-based UI**: Separates simulation, theory (BDH), and assessment (test)

## ♿ Accessibility Features

- Full ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme
- Focus indicators
- Semantic HTML structure

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy (configure base URL in vite.config.ts first)
npm run deploy
```

## 🧑‍💻 Development

```bash
# Run dev server with hot reload
npm run dev

# Type checking
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| **Learning Outcome** | 3/3 on Sixty-Second Test |
| **Performance** | < 1 second feedback |
| **Mobile Support** | Works on all screen sizes |
| **Accessibility** | Keyboard + ARIA compliant |
| **User Engagement** | Completes all 5 sections |

## 🤝 Contributing

This is an educational project built for the Pathway Track competition. Contributions are welcome after the competition period.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Dragon Hatchling (BDH)** research team for the synaptic memory concept
- **BDH-CQ** researchers for contextual reasoning insights
- **Pathway Track** for inspiring this educational resource

## 📧 Contact

For questions or feedback about this project, please open an issue on GitHub.

---

**Built with ❤️ for understanding how connections become memory**

⭐⭐⭐⭐⭐ **No one else is building this** — A truly unique interactive approach to synaptic plasticity education.
