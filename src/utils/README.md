# Neural Network Utilities

This directory contains modular, well-tested utilities for implementing Hebbian learning neural networks.

## 📁 File Structure

```
utils/
├── index.ts              # Main exports
├── neuralNetwork.ts      # Core NeuralNetwork class
├── hebbian.ts            # Hebbian learning rule implementation
├── forwardPass.ts        # Forward pass (recall) functions
├── teach.ts              # Teaching and state management
└── README.md             # This file
```

## 🧠 Core Concepts

### Hebbian Learning

**"Neurons that fire together, wire together"**

The fundamental rule: **Δw = η × aᵢ × aⱼ**

- When two neurons are simultaneously active, their connection strengthens
- Repetition increases strength
- This is how memory forms in the network

### Forward Pass (Recall)

**How the network "thinks"**

1. Input activations × Weight matrix
2. Apply activation function (sigmoid)
3. Highest output = prediction

### Network State

Complete state includes:
- Weight matrix (N × N)
- Current activations
- Learning parameters
- History tracking

## 📚 Usage Examples

### Example 1: Basic Teaching and Recall

```typescript
import { createInitialState, teach, recall } from './utils';

// Create initial state for 6 nodes
let state = createInitialState(6, 0.1);

// Teach: Node 0 → Node 1 (e.g., DOG → ANIMAL)
state = teach(state, 0, 1, 3); // 3 repetitions

// Recall: What does node 0 predict?
const result = recall(state.weights, 0);
console.log(`Predicted: ${result.predictedIndex}`); // Should be 1
console.log(`Confidence: ${result.confidence}`);    // ~0.8-0.9
```

### Example 2: Using NeuralNetwork Class

```typescript
import { NeuralNetwork } from './utils/neuralNetwork';
import { hebbianUpdate } from './utils/hebbian';
import { recall } from './utils/forwardPass';

// Create network
const network = new NeuralNetwork(6, 0.1);

// Get current weights
let weights = network.getWeights();

// Apply Hebbian learning
weights = hebbianUpdate(weights, 0, 1, 0.1);
weights = hebbianUpdate(weights, 0, 1, 0.1);
weights = hebbianUpdate(weights, 0, 1, 0.1);

// Update network
network.setWeights(weights);

// Test recall
const result = recall(weights, 0);
console.log(result);
```

### Example 3: Interference Experiment

```typescript
import { createInitialState, teach, recall, detectInterference } from './utils';

let state = createInitialState(6, 0.1);

// Teach DOG → ANIMAL
state = teach(state, 0, 1, 5);

// Test recall
let result = recall(state.weights, 0);
console.log(`Before interference: ${result.predictedIndex}`); // 1

// Teach conflicting association: DOG → PET
const hasInterference = detectInterference(state, 0, 2);
console.log(`Interference detected: ${hasInterference}`); // true

state = teach(state, 0, 2, 5);

// Test recall again
result = recall(state.weights, 0);
console.log(`After interference: ${result.predictedIndex}`); // Might be 2, or confused
console.log(`Confidence dropped: ${result.confidence}`); // Lower confidence
```

### Example 4: Multiple Associations

```typescript
import { createInitialState, teachMultiple, recallTopK } from './utils';

let state = createInitialState(6, 0.1);

// Teach multiple associations at once
state = teachMultiple(state, [
  { input: 0, output: 1, repetitions: 3 }, // DOG → ANIMAL
  { input: 2, output: 1, repetitions: 3 }, // CAT → ANIMAL
  { input: 4, output: 1, repetitions: 3 }, // BIRD → ANIMAL
]);

// Get top 3 predictions for node 0
const topPredictions = recallTopK(state.weights, 0, 3);
topPredictions.forEach((pred, i) => {
  console.log(`${i + 1}. Node ${pred.index}: ${pred.confidence.toFixed(2)}`);
});
```

### Example 5: State Statistics

```typescript
import { createInitialState, teach, getStateStats } from './utils';

let state = createInitialState(6, 0.1);

// Teach several associations
state = teach(state, 0, 1, 3);
state = teach(state, 0, 2, 3); // Causes interference
state = teach(state, 2, 3, 3);

// Get statistics
const stats = getStateStats(state);
console.log(`Total teachings: ${stats.totalTeachings}`);
console.log(`Interference rate: ${stats.interferenceRate.toFixed(2)}`);
console.log(`Average weight: ${stats.averageWeight.toFixed(3)}`);
console.log(`Max weight: ${stats.maxWeight.toFixed(3)}`);
```

### Example 6: Learning Rate Experiments

```typescript
import { createInitialState, teach, recall, setLearningRate } from './utils';

// Slow learning
let stateSlow = createInitialState(6, 0.05);
stateSlow = teach(stateSlow, 0, 1, 5);

// Fast learning
let stateFast = createInitialState(6, 0.3);
stateFast = teach(stateFast, 0, 1, 5);

// Compare
const resultSlow = recall(stateSlow.weights, 0);
const resultFast = recall(stateFast.weights, 0);

console.log(`Slow learning confidence: ${resultSlow.confidence}`);
console.log(`Fast learning confidence: ${resultFast.confidence}`);
```

### Example 7: Softmax Recall

```typescript
import { createInitialState, teach, recallWithSoftmax } from './utils';

let state = createInitialState(6, 0.1);
state = teach(state, 0, 1, 3);

// Get probabilities (sum to 1)
const result = recallWithSoftmax(state.weights, 0);
console.log('Probabilities:');
result.probabilities.forEach((prob, i) => {
  console.log(`  Node ${i}: ${(prob * 100).toFixed(1)}%`);
});
```

## 🎓 Key Functions Reference

### Neural Network Management

| Function | Purpose |
|----------|---------|
| `NeuralNetwork(nodes, rate)` | Create network object |
| `createNeuralNetwork(...)` | Factory function |
| `getWeights()` | Get weight matrix |
| `setWeights(weights)` | Update weights |
| `reset()` | Reset to random weights |

### Hebbian Learning

| Function | Purpose |
|----------|---------|
| `hebbianUpdate(...)` | Apply Hebbian rule once |
| `hebbianUpdateMultiple(...)` | Apply multiple times |
| `hebbianUpdateWithDecay(...)` | With forgetting |
| `antiHebbianUpdate(...)` | Weaken connections |
| `calculateHebbianDelta(...)` | Get delta without applying |

### Forward Pass

| Function | Purpose |
|----------|---------|
| `forwardPass(weights, input)` | Basic forward pass |
| `recall(weights, index)` | Recall with one-hot input |
| `recallWithSoftmax(...)` | Probabilistic recall |
| `recallTopK(...)` | Get top-k predictions |
| `sigmoid(x)` | Sigmoid activation |
| `softmax(vector)` | Softmax activation |

### Teaching

| Function | Purpose |
|----------|---------|
| `teach(state, in, out, reps)` | Teach association |
| `teachMultiple(state, assocs)` | Teach multiple |
| `createInitialState(...)` | Initialize state |
| `detectInterference(...)` | Check for conflicts |
| `getStateStats(state)` | Get statistics |
| `resetState(state)` | Reset network |

## 🧪 Testing

Each utility can be tested independently:

```bash
# Run TypeScript compiler to check types
npm run build

# Test specific utility
node -e "
  const { createInitialState, teach, recall } = require('./dist/utils');
  let state = createInitialState(6);
  state = teach(state, 0, 1, 3);
  console.log(recall(state.weights, 0));
"
```

## 🔍 Design Principles

1. **Pure Functions**: Most functions don't mutate inputs
2. **Type Safety**: Full TypeScript coverage
3. **Validation**: Comprehensive input checking
4. **Documentation**: Every function documented
5. **Modularity**: Each file has single responsibility
6. **Testability**: Easy to unit test

## 🚀 Integration with Existing Code

These utilities are designed to work alongside the existing `src/lib/NeuralNetwork.ts`.

You can:
- Use utilities directly for fine-grained control
- Use the original `NeuralNetwork` class for simplicity
- Mix both approaches as needed

## 📖 Further Reading

- **CONCEPT_SUMMARY.md**: Educational theory
- **README.md**: Project overview
- **SETUP.md**: Installation guide

## 🤝 Contributing

When adding utilities:
1. Keep functions pure when possible
2. Add comprehensive JSDoc comments
3. Include usage examples
4. Validate all inputs
5. Export from `index.ts`

---

**Happy Learning!** 🧠✨
