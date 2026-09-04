# 🛠️ Neural Network Utilities Guide

Complete reference for the modular neural network utilities in `src/utils/`.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Modules](#core-modules)
4. [Complete API Reference](#complete-api-reference)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)
7. [Integration with Existing Code](#integration-with-existing-code)

---

## Overview

The utilities provide a modular, well-tested foundation for Hebbian learning neural networks. Each module has a single responsibility and can be used independently or together.

### Why These Utilities?

✅ **Modular**: Each file has a single purpose  
✅ **Type-Safe**: Full TypeScript coverage  
✅ **Well-Documented**: Every function has JSDoc comments  
✅ **Pure Functions**: Most functions don't mutate inputs  
✅ **Validated**: Comprehensive input checking  
✅ **Tested**: Example tests provided  

### File Structure

```
src/utils/
├── index.ts              # Main exports
├── neuralNetwork.ts      # NeuralNetwork class
├── hebbian.ts            # Hebbian learning rules
├── forwardPass.ts        # Forward pass (recall)
├── teach.ts              # Teaching & state management
├── README.md             # Documentation
└── __tests__/
    └── example.test.ts   # Example tests
```

---

## Quick Start

### Installation

Utilities are already included in the project. Just import:

```typescript
import {
  NeuralNetwork,
  hebbianUpdate,
  forwardPass,
  teach,
  createInitialState,
  recall
} from './utils';
```

### 5-Minute Example

```typescript
// 1. Create initial state
let state = createInitialState(6, 0.1); // 6 nodes, learning rate 0.1

// 2. Teach an association (DOG → ANIMAL)
state = teach(state, 0, 1, 3); // Node 0 → Node 1, 3 repetitions

// 3. Recall what node 0 predicts
const result = recall(state.weights, 0);
console.log(`Predicted: ${result.predictedIndex}`); // Should be 1
console.log(`Confidence: ${result.confidence}`);    // ~0.7-0.9
```

---

## Core Modules

### 1. `neuralNetwork.ts` - Network Management

**Purpose**: Manages the fundamental structure of the neural network.

**Key Class**: `NeuralNetwork`

```typescript
const network = new NeuralNetwork(6, 0.1);
const weights = network.getWeights();
network.setLearningRate(0.2);
network.reset();
```

**When to use**:
- Object-oriented approach
- Need to manage network state
- Prefer encapsulation

### 2. `hebbian.ts` - Learning Rules

**Purpose**: Implements Hebbian learning: **Δw = η × aᵢ × aⱼ**

**Key Functions**:
- `hebbianUpdate()` - Apply rule once
- `hebbianUpdateMultiple()` - Apply multiple times
- `hebbianUpdateWithDecay()` - With forgetting

```typescript
const newWeights = hebbianUpdate(weights, 0, 1, 0.1);
```

**When to use**:
- Direct weight manipulation
- Fine-grained control
- Understanding the learning mechanism

### 3. `forwardPass.ts` - Recall/Prediction

**Purpose**: Forward pass through the network (how it "thinks").

**Key Functions**:
- `forwardPass()` - Basic forward pass
- `recall()` - Recall with one-hot input
- `recallTopK()` - Get top predictions

```typescript
const output = forwardPass(weights, inputVector);
const result = recall(weights, 0); // What does node 0 predict?
```

**When to use**:
- Testing what the network learned
- Making predictions
- Understanding network behavior

### 4. `teach.ts` - Teaching & State

**Purpose**: High-level teaching interface with state management.

**Key Type**: `NetworkState`

**Key Functions**:
- `teach()` - Teach an association
- `teachMultiple()` - Teach multiple
- `detectInterference()` - Check for conflicts

```typescript
let state = createInitialState(6, 0.1);
state = teach(state, 0, 1, 3);
```

**When to use**:
- Building applications
- Need history tracking
- Want interference detection

---

## Complete API Reference

### NeuralNetwork Class

#### Constructor

```typescript
new NeuralNetwork(numNodes: number = 6, learningRate: number = 0.1)
```

Creates a neural network with N nodes.

**Parameters**:
- `numNodes`: Number of nodes (must be ≥ 2)
- `learningRate`: Learning rate η (0.01 - 1.0)

**Throws**: Error if parameters invalid

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getWeights()` | `number[][]` | Get weight matrix (copy) |
| `setWeights(weights)` | `void` | Update weight matrix |
| `getNodeCount()` | `number` | Get number of nodes |
| `getLearningRate()` | `number` | Get learning rate |
| `setLearningRate(rate)` | `void` | Update learning rate |
| `getWeight(from, to)` | `number` | Get specific weight |
| `setWeight(from, to, value)` | `void` | Set specific weight |
| `reset()` | `void` | Reset to random weights |
| `isSymmetric()` | `boolean` | Check if symmetric |
| `getWeightStats()` | `object` | Get statistics |
| `exportState()` | `object` | Export to JSON |
| `importState(state)` | `void` | Import from JSON |

---

### Hebbian Learning Functions

#### `hebbianUpdate`

```typescript
hebbianUpdate(
  weights: number[][],
  inputIndex: number,
  outputIndex: number,
  learningRate: number,
  inputActivation: number = 1.0,
  outputActivation: number = 1.0
): number[][]
```

Applies Hebbian learning rule: **Δw = η × aᵢ × aⱼ**

**Returns**: New weight matrix (pure function)

**Example**:
```typescript
const newWeights = hebbianUpdate(weights, 0, 1, 0.1);
// weights[0][1] increased by 0.1
```

#### `hebbianUpdateMultiple`

```typescript
hebbianUpdateMultiple(
  weights: number[][],
  inputIndex: number,
  outputIndex: number,
  learningRate: number,
  repetitions: number = 1
): number[][]
```

Applies Hebbian learning multiple times.

**Parameters**:
- `repetitions`: Number of times to apply (≥ 1)

**Example**:
```typescript
const newWeights = hebbianUpdateMultiple(weights, 0, 1, 0.1, 5);
// Applied 5 times
```

#### Other Hebbian Functions

| Function | Purpose |
|----------|---------|
| `hebbianUpdateWithDecay()` | Learning + forgetting |
| `antiHebbianUpdate()` | Weakens connections |
| `calculateHebbianDelta()` | Get delta without applying |
| `normalizeWeights()` | Normalize weight matrix |
| `getConnectionStrength()` | Get specific weight (alias) |

---

### Forward Pass Functions

#### `forwardPass`

```typescript
forwardPass(
  weights: number[][],
  inputVector: number[],
  activationFn: (x: number) => number = sigmoid
): number[]
```

Performs forward pass through the network.

**Flow**:
1. Multiply weights × input
2. Apply activation function
3. Return output vector

**Example**:
```typescript
const input = [1, 0, 0, 0, 0, 0];
const output = forwardPass(weights, input);
// output = [0.5, 0.87, 0.45, 0.52, 0.48, 0.51]
```

#### `recall`

```typescript
recall(
  weights: number[][],
  inputIndex: number
): {
  predictedIndex: number;
  confidence: number;
  allOutputs: number[];
}
```

Convenience function for recalling from a single node.

**Example**:
```typescript
const result = recall(weights, 0);
console.log(`Node 0 predicts: ${result.predictedIndex}`);
console.log(`Confidence: ${result.confidence.toFixed(2)}`);
```

#### Activation Functions

| Function | Formula | Range | Use Case |
|----------|---------|-------|----------|
| `sigmoid(x)` | 1/(1+e^-x) | (0, 1) | Default, smooth |
| `linear(x)` | x | (-∞, ∞) | No activation |
| `relu(x)` | max(0, x) | [0, ∞) | Fast, sparse |
| `softmax(vector)` | e^xi / Σe^xj | [0, 1], sum=1 | Probabilities |

#### Helper Functions

| Function | Purpose |
|----------|---------|
| `createOneHot()` | Create one-hot vector |
| `argmax()` | Find max index |
| `matrixVectorMultiply()` | Matrix × vector |
| `cosineSimilarity()` | Similarity measure |
| `recallTopK()` | Top-k predictions |
| `recallWithSoftmax()` | Probabilistic recall |

---

### Teaching Functions

#### `createInitialState`

```typescript
createInitialState(
  numNodes: number,
  learningRate: number = 0.1,
  memoryDecay: number = 0
): NetworkState
```

Creates initial network state with random weights.

**Returns**: `NetworkState` object

#### `teach`

```typescript
teach(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number,
  repetitions: number = 1
): NetworkState
```

Teaches an association by strengthening connection.

**Side effects**: Records event in history, updates counters

**Example**:
```typescript
let state = createInitialState(6);
state = teach(state, 0, 1, 3); // DOG → ANIMAL, 3 times
```

#### `teachMultiple`

```typescript
teachMultiple(
  state: NetworkState,
  associations: Array<{
    input: number;
    output: number;
    repetitions?: number;
  }>
): NetworkState
```

Teaches multiple associations at once.

**Example**:
```typescript
state = teachMultiple(state, [
  { input: 0, output: 1, repetitions: 3 },
  { input: 2, output: 1, repetitions: 3 }
]);
```

#### State Management Functions

| Function | Purpose |
|----------|---------|
| `detectInterference()` | Check for conflicts |
| `clearActivations()` | Reset activations |
| `setLearningRate()` | Update learning rate |
| `resetState()` | Reset network |
| `getStateStats()` | Get statistics |
| `exportState()` | Serialize state |
| `importState()` | Deserialize state |

---

## Usage Examples

### Example 1: Basic Teaching

```typescript
import { createInitialState, teach, recall } from './utils';

// Create network
let state = createInitialState(6, 0.1);

// Teach DOG → ANIMAL
state = teach(state, 0, 1, 5);

// Test recall
const result = recall(state.weights, 0);
console.log(`Prediction: ${result.predictedIndex}, Confidence: ${result.confidence}`);
```

### Example 2: Interference Experiment

```typescript
import { createInitialState, teach, recall, detectInterference } from './utils';

let state = createInitialState(6, 0.15);

// Teach DOG → ANIMAL
state = teach(state, 0, 1, 5);
const first = recall(state.weights, 0);
console.log(`Before interference: ${first.confidence.toFixed(2)}`);

// Check for interference
if (detectInterference(state, 0, 2)) {
  console.log('Warning: This will cause interference!');
}

// Teach competing: DOG → PET
state = teach(state, 0, 2, 5);
const second = recall(state.weights, 0);
console.log(`After interference: ${second.confidence.toFixed(2)}`);
```

### Example 3: Learning Rate Comparison

```typescript
import { createInitialState, teach, recall } from './utils';

// Slow learning
let slow = createInitialState(6, 0.05);
slow = teach(slow, 0, 1, 5);

// Fast learning
let fast = createInitialState(6, 0.3);
fast = teach(fast, 0, 1, 5);

console.log(`Slow: ${recall(slow.weights, 0).confidence.toFixed(2)}`);
console.log(`Fast: ${recall(fast.weights, 0).confidence.toFixed(2)}`);
```

### Example 4: Top-K Predictions

```typescript
import { createInitialState, teach, recallTopK } from './utils';

let state = createInitialState(6, 0.1);
state = teach(state, 0, 1, 3);

const topK = recallTopK(state.weights, 0, 3);
topK.forEach((pred, i) => {
  console.log(`${i + 1}. Node ${pred.index}: ${(pred.confidence * 100).toFixed(1)}%`);
});
```

### Example 5: State Statistics

```typescript
import { createInitialState, teach, getStateStats } from './utils';

let state = createInitialState(6, 0.1);
state = teach(state, 0, 1, 3);
state = teach(state, 0, 2, 3); // Causes interference

const stats = getStateStats(state);
console.log(`Total teachings: ${stats.totalTeachings}`);
console.log(`Interference rate: ${(stats.interferenceRate * 100).toFixed(1)}%`);
console.log(`Average weight: ${stats.averageWeight.toFixed(3)}`);
```

---

## Testing

### Running Tests

```bash
# Build first
npm run build

# Run example tests (when Jest/Vitest is configured)
npm test

# Or run directly with ts-node
npx ts-node src/utils/__tests__/example.test.ts
```

### Test Coverage

The example tests cover:
- ✅ NeuralNetwork class
- ✅ Hebbian learning
- ✅ Forward pass
- ✅ Sigmoid activation
- ✅ Teaching function
- ✅ Recall function
- ✅ Interference detection
- ✅ Multiple associations
- ✅ Top-K recall
- ✅ State statistics
- ✅ Complete learning cycle

### Writing Your Own Tests

```typescript
import { createInitialState, teach, recall } from './utils';

function testBasicLearning() {
  let state = createInitialState(3, 0.1);
  const weightBefore = state.weights[0][1];
  
  state = teach(state, 0, 1, 1);
  const weightAfter = state.weights[0][1];
  
  console.assert(weightAfter > weightBefore, 'Weight should increase');
  console.log('✓ Basic learning test passed');
}

testBasicLearning();
```

---

## Integration with Existing Code

### Option 1: Use Utilities Directly

Replace the existing `NeuralNetwork` class calls:

```typescript
// Before (existing code)
const network = new NeuralNetwork(VOCABULARY, 0.1);
network.teach('DOG', 'ANIMAL', 3);
const result = network.recall('DOG');

// After (with utilities)
import { createInitialState, teach, recall } from './utils';

let state = createInitialState(6, 0.1);
state = teach(state, dogIndex, animalIndex, 3);
const result = recall(state.weights, dogIndex);
```

### Option 2: Hybrid Approach

Use both:
- Original `NeuralNetwork` for vocabulary management
- Utilities for fine-grained control

```typescript
import { NeuralNetwork } from './lib/NeuralNetwork';
import { hebbianUpdate } from './utils/hebbian';

const network = new NeuralNetwork(VOCABULARY, 0.1);
let weights = network.getWeights();

// Use utility for precise control
weights = hebbianUpdate(weights, 0, 1, 0.1);
network.setWeights(weights);
```

### Option 3: Keep Separate

Use utilities for:
- Testing learning algorithms
- Educational demonstrations
- Research experiments

Use original `NeuralNetwork` for:
- Production application
- UI integration
- Vocabulary management

---

## Best Practices

### 1. **Validation**

Always validate inputs:
```typescript
if (inputIndex < 0 || inputIndex >= numNodes) {
  throw new Error('Index out of bounds');
}
```

### 2. **Pure Functions**

Prefer pure functions (no side effects):
```typescript
// Good: returns new weights
const newWeights = hebbianUpdate(weights, 0, 1, 0.1);

// Avoid: mutates weights
weights[0][1] += delta; // Don't do this
```

### 3. **Type Safety**

Use TypeScript types:
```typescript
const state: NetworkState = createInitialState(6);
```

### 4. **Error Handling**

Handle errors gracefully:
```typescript
try {
  state = teach(state, inputIndex, outputIndex, reps);
} catch (error) {
  console.error('Teaching failed:', error.message);
}
```

### 5. **Testing**

Test edge cases:
```typescript
// Test with same input/output (should fail)
// Test with out-of-bounds indices
// Test with invalid learning rates
```

---

## Troubleshooting

### Common Issues

**Q: Why are my weights not changing?**

A: Check learning rate isn't too small. Try 0.1 instead of 0.01.

**Q: Why is recall confidence low?**

A: Need more repetitions, or higher learning rate.

**Q: Why do I get "Index out of bounds"?**

A: Ensure indices are 0-based and < numNodes.

**Q: Why does interference destroy both memories?**

A: This is expected! Real systems need architectural solutions (see BDH).

---

## Next Steps

1. **Read** `src/utils/README.md` for more examples
2. **Run** example tests to see it in action
3. **Experiment** with parameters
4. **Integrate** into your application
5. **Learn** about BDH to see how real systems solve limitations

---

**Happy Learning!** 🧠✨
