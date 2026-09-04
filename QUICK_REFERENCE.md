# synaptiCITY Quick Reference

**One-page guide for developers using synaptiCITY utilities**

---

## Installation

```bash
cd /Users/lakshsorathiya/synaptiCITY
npm install
npm run dev  # http://localhost:5173
```

---

## Basic Usage (React Hook)

```typescript
import { useNeuralNetwork } from './hooks/useNeuralNetwork';

function MyComponent() {
  const { state, teach, recall, reset } = useNeuralNetwork({
    numNodes: 6,
    learningRate: 0.1
  });

  teach(0, 1);                    // DOG → ANIMAL
  const result = recall(0);       // Predict from DOG
  console.log(result.confidence); // 0.85
}
```

---

## Core Functions

### Teaching
```typescript
teach(inputIdx, outputIdx, { repetitions: 3 });
```

### Recalling
```typescript
const result = recall(inputIdx);
// { outputIndex: 1, confidence: 0.85, success: true, allOutputs: [...] }
```

### Interference
```typescript
addInterference(inputIdx, competingOutputIdx);
```

### Decay
```typescript
applyDecay(0.1); // 10% decay rate
```

### Reset
```typescript
reset(); // Fresh network
```

---

## Advanced Features

### Undo/Redo
```typescript
const { undo, redo, canUndo, canRedo } = useNeuralNetwork();

undo();  // Go back
redo();  // Go forward
```

### Debug Data
```typescript
const debug = getDebugData();
console.log(debug.averageWeight);
console.log(debug.strongestConnection);
console.log(debug.accuracy);
```

### Caching
```typescript
import { NetworkCache, cachedRecall } from './utils/cache';

const cache = new NetworkCache({ maxSize: 100, ttl: 5000 });
const result = cachedRecall(state, 0, recallFromState, cache);

const stats = cache.getStats();
console.log(`Hit rate: ${stats.hitRate}`);
```

---

## Utility Imports

```typescript
// State handlers
import {
  handleTeach,
  handleRecall,
  handleInterference,
  handleReset,
  handleDecay
} from './hooks/useStateHandlers';

// Utilities
import {
  createInitialState,
  teach,
  recallFromState,
  applyMemoryDecay
} from './utils';

// Debug
import {
  getDebugData,
  getActiveConnections,
  compareStates
} from './utils/debug';

// Cache
import {
  NetworkCache,
  cachedRecall,
  warmCache
} from './utils/cache';
```

---

## Type Definitions

```typescript
interface NetworkState {
  weights: number[][];
  activations: number[];
  learningRate: number;
  repetitions: number;
  interferenceCount: number;
  memoryDecay: number;
  history: HistoryEntry[];
  timestamp: number;
}

interface RecallResult {
  outputIndex: number;
  confidence: number;
  allOutputs: number[];
  success: boolean;
}

interface DebugData {
  weights: number[][];
  strongestConnection: ConnectionInfo;
  weakestConnection: ConnectionInfo;
  averageWeight: number;
  accuracy: number;
  // ... more fields
}
```

---

## Common Patterns

### Simple Learning Flow
```typescript
let state = createInitialState(4);
state = teach(state, 0, 1);
state = teach(state, 0, 1);
state = teach(state, 0, 1);

const result = recallFromState(state, 0);
console.log(result.outputIndex === 1); // true
```

### With React Hook
```typescript
function TeachDemo() {
  const { teach, recall } = useNeuralNetwork({ numNodes: 4 });
  
  const handleTeachClick = () => {
    teach(0, 1, { repetitions: 3 });
    const result = recall(0);
    alert(`Predicted: ${result.outputIndex}`);
  };
  
  return <button onClick={handleTeachClick}>Teach & Test</button>;
}
```

### Batch Teaching
```typescript
const associations = [[0, 1], [2, 3], [4, 5]];
state = handleBatchTeach(state, associations, 3);
```

### Interference Experiment
```typescript
// Original
teach(0, 1, { repetitions: 5 });
const before = recall(0).confidence;

// Add interference
addInterference(0, 2);
const after = recall(0).confidence;

console.log(`Dropped from ${before} to ${after}`);
```

### Memory Decay Over Time
```typescript
teach(0, 1, { repetitions: 3 });

// Simulate days passing
applyDecay(0.1); // Day 1
applyDecay(0.1); // Day 2
applyDecay(0.1); // Day 3

const result = recall(0);
console.log(`Confidence after decay: ${result.confidence}`);
```

---

## Testing

```bash
# Run tests (if you set up Jest/Vitest)
npm test

# Run specific test file
npx tsx src/utils/__tests__/unit.test.ts
npx tsx src/utils/__tests__/integration.test.ts
```

---

## Performance Tips

1. **Use caching** for repeated recalls
2. **Batch teach** multiple associations
3. **Memoize** with React hooks (already done)
4. **Warm cache** for predictable inputs
5. **Limit history** size if memory constrained

---

## Common Issues

### Issue: Index out of bounds
```typescript
// ❌ Wrong
teach(state, 0, 10); // If network has only 6 nodes

// ✅ Correct
teach(state, 0, 5); // Valid index
```

### Issue: Self-connections
```typescript
// ❌ Wrong
teach(state, 1, 1); // Cannot connect node to itself

// ✅ Correct
teach(state, 1, 2); // Different nodes
```

### Issue: Invalid learning rate
```typescript
// ❌ Wrong
useNeuralNetwork({ learningRate: -0.1 }); // Negative
useNeuralNetwork({ learningRate: 1.5 });  // > 1

// ✅ Correct
useNeuralNetwork({ learningRate: 0.1 }); // 0 < lr ≤ 1
```

---

## File Structure

```
src/
├── utils/              # Core utilities
│   ├── neuralNetwork.ts
│   ├── hebbian.ts
│   ├── forwardPass.ts
│   ├── teach.ts
│   ├── recall.ts
│   ├── interference.ts
│   ├── networkState.ts
│   ├── decay.ts
│   ├── debug.ts        # NEW
│   ├── cache.ts        # NEW
│   └── __tests__/
│       ├── unit.test.ts
│       └── integration.test.ts
├── hooks/              # React hooks (NEW)
│   ├── useNeuralNetwork.ts
│   └── useStateHandlers.ts
└── types/              # TypeScript types
    ├── index.ts
    └── network.types.ts # NEW
```

---

## Configuration

### Network Parameters
```typescript
{
  numNodes: 6,           // 2-20+ nodes
  learningRate: 0.1,     // 0.01-1.0
  memoryDecay: 0.01,     // 0.0-1.0
  maxHistory: 50         // Undo buffer size
}
```

### Cache Parameters
```typescript
{
  maxSize: 100,          // Max cache entries
  ttl: 5000             // Time-to-live (ms)
}
```

---

## Deployment

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to GitHub Pages
npm run deploy
```

---

## Documentation

- **UTILITIES_GUIDE.md** - Complete API (8,000+ words)
- **README.md** - Project overview
- **PHASES_5-8_COMPLETION.md** - Implementation details
- **DEPLOY_NOW.md** - Deployment guide

---

## Key Equations

### Hebbian Learning
```
Δw = η × aᵢ × aⱼ
```

### Sigmoid Activation
```
σ(x) = 1 / (1 + e^(-x))
```

### Confidence (Normalized)
```
confidence = max(outputs) / sum(outputs)
```

### Memory Decay
```
w_new = w_old × (1 - decay_rate)
```

---

## Quick Links

- 🏠 Home: `README.md`
- 📚 API: `UTILITIES_GUIDE.md`
- 🚀 Deploy: `DEPLOY_NOW.md`
- ✅ Status: `PROJECT_COMPLETE.md`
- 🧪 Tests: `src/utils/__tests__/`

---

## Support

Questions? Check:
1. `UTILITIES_GUIDE.md` for detailed API
2. `src/utils/__tests__/` for examples
3. GitHub issues (if applicable)

---

**Quick Start**: `npm run dev` → http://localhost:5173

**Built with ❤️ by Kiro AI**
