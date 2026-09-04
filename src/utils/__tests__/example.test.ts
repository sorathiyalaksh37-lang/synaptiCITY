/**
 * Example Tests for Neural Network Utilities
 * 
 * These are example tests demonstrating how the utilities work.
 * In a full project, you would use a testing framework like Jest or Vitest.
 * 
 * To run these examples:
 * 1. Build the project: npm run build
 * 2. Run with ts-node: npx ts-node src/utils/__tests__/example.test.ts
 */

import {
  NeuralNetwork,
  hebbianUpdate,
  hebbianUpdateMultiple,
  forwardPass,
  recall,
  recallTopK,
  sigmoid,
  teach,
  teachMultiple,
  createInitialState,
  detectInterference,
  getStateStats,
  argmax
} from '../index';

// Test counter
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ ${message}`);
    testsFailed++;
  }
}

console.log('🧪 Running Neural Network Utility Tests\n');

// ============================================================================
// Test 1: NeuralNetwork Class
// ============================================================================
console.log('Test 1: NeuralNetwork Class');
const network = new NeuralNetwork(6, 0.1);
assert(network.getNodeCount() === 6, 'Network has 6 nodes');
assert(network.getLearningRate() === 0.1, 'Learning rate is 0.1');

const weights = network.getWeights();
assert(weights.length === 6, 'Weight matrix has 6 rows');
assert(weights[0].length === 6, 'Weight matrix has 6 columns');

network.setLearningRate(0.2);
assert(network.getLearningRate() === 0.2, 'Learning rate updated to 0.2');

console.log('');

// ============================================================================
// Test 2: Hebbian Learning
// ============================================================================
console.log('Test 2: Hebbian Learning');
const initialWeights = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

const updatedWeights = hebbianUpdate(initialWeights, 0, 1, 0.1);
assert(
  updatedWeights[0][1] > initialWeights[0][1],
  'Weight increased after Hebbian update'
);
assert(
  updatedWeights[0][1] === 0.1,
  'Weight increased by exactly 0.1 (η × 1 × 1)'
);

// Multiple updates
const multiUpdated = hebbianUpdateMultiple(initialWeights, 0, 1, 0.1, 3);
assert(
  Math.abs(multiUpdated[0][1] - 0.3) < 0.001,
  'Weight increased by 0.3 after 3 repetitions'
);

console.log('');

// ============================================================================
// Test 3: Forward Pass
// ============================================================================
console.log('Test 3: Forward Pass (Recall)');
const testWeights = [
  [0, 0.8, 0.1],
  [0.2, 0, 0.3],
  [0.1, 0.2, 0]
];

const input = [1, 0, 0]; // First node active
const output = forwardPass(testWeights, input);

assert(output.length === 3, 'Output has 3 elements');
assert(output.every(v => v >= 0 && v <= 1), 'All outputs between 0 and 1');

const maxIndex = argmax(output);
assert(maxIndex === 1, 'Highest output is at index 1 (where weight is 0.8)');

console.log('');

// ============================================================================
// Test 4: Sigmoid Function
// ============================================================================
console.log('Test 4: Sigmoid Activation');
assert(Math.abs(sigmoid(0) - 0.5) < 0.001, 'sigmoid(0) = 0.5');
assert(sigmoid(100) > 0.99, 'sigmoid(large positive) ≈ 1');
assert(sigmoid(-100) < 0.01, 'sigmoid(large negative) ≈ 0');
assert(sigmoid(1) > 0.5 && sigmoid(1) < 1, 'sigmoid(1) is between 0.5 and 1');

console.log('');

// ============================================================================
// Test 5: Teaching Function
// ============================================================================
console.log('Test 5: Teaching Function');
let state = createInitialState(6, 0.1);
const initialWeight = state.weights[0][1];

state = teach(state, 0, 1, 3); // Teach node 0 → 1, three times

assert(state.weights[0][1] > initialWeight, 'Weight increased after teaching');
assert(state.repetitions === 3, 'Repetition counter updated');
assert(state.history.length === 1, 'Teaching event recorded in history');

console.log('');

// ============================================================================
// Test 6: Recall Function
// ============================================================================
console.log('Test 6: Recall Function');
const recallResult = recall(state.weights, 0);

assert(
  typeof recallResult.predictedIndex === 'number',
  'Recall returns predicted index'
);
assert(
  recallResult.confidence >= 0 && recallResult.confidence <= 1,
  'Confidence is between 0 and 1'
);
assert(recallResult.allOutputs.length === 6, 'All outputs returned');

console.log('');

// ============================================================================
// Test 7: Interference Detection
// ============================================================================
console.log('Test 7: Interference Detection');
let interferenceState = createInitialState(6, 0.1);

// Teach DOG → ANIMAL
interferenceState = teach(interferenceState, 0, 1, 5);

// Check if teaching DOG → PET would cause interference
const hasInterference = detectInterference(interferenceState, 0, 2, 0.3);
assert(hasInterference, 'Interference detected for competing association');

console.log('');

// ============================================================================
// Test 8: Multiple Associations
// ============================================================================
console.log('Test 8: Teaching Multiple Associations');
let multiState = createInitialState(6, 0.1);

multiState = teachMultiple(multiState, [
  { input: 0, output: 1, repetitions: 3 },
  { input: 2, output: 1, repetitions: 3 },
  { input: 4, output: 1, repetitions: 3 }
]);

assert(multiState.repetitions === 9, 'Total repetitions is 9 (3+3+3)');
assert(multiState.history.length === 3, 'Three teaching events recorded');

console.log('');

// ============================================================================
// Test 9: Top-K Recall
// ============================================================================
console.log('Test 9: Top-K Recall');
const topK = recallTopK(multiState.weights, 0, 3);

assert(topK.length === 3, 'Returns top 3 predictions');
assert(topK[0].confidence >= topK[1].confidence, 'Results sorted by confidence');
assert(topK[1].confidence >= topK[2].confidence, 'Results sorted by confidence');

console.log('');

// ============================================================================
// Test 10: State Statistics
// ============================================================================
console.log('Test 10: State Statistics');
const stats = getStateStats(multiState);

assert(stats.totalTeachings === 9, 'Total teachings recorded');
assert(typeof stats.averageWeight === 'number', 'Average weight calculated');
assert(typeof stats.maxWeight === 'number', 'Max weight calculated');
assert(typeof stats.minWeight === 'number', 'Min weight calculated');
assert(stats.historyLength === 3, 'History length correct');

console.log('');

// ============================================================================
// Test 11: Complete Learning Cycle
// ============================================================================
console.log('Test 11: Complete Learning Cycle (DOG → ANIMAL)');
let cycleState = createInitialState(6, 0.15);

// Teach DOG (0) → ANIMAL (1)
const weightBefore = cycleState.weights[0][1];
cycleState = teach(cycleState, 0, 1, 5);
const weightAfter = cycleState.weights[0][1];

assert(weightAfter > weightBefore, 'Weight strengthened');

// Recall DOG
const dogRecall = recall(cycleState.weights, 0);
console.log(`  DOG → Predicted: ${dogRecall.predictedIndex}, Confidence: ${dogRecall.confidence.toFixed(2)}`);

assert(
  dogRecall.predictedIndex === 1 || dogRecall.confidence > 0.6,
  'Network recalls ANIMAL with reasonable confidence'
);

console.log('');

// ============================================================================
// Test 12: Interference Experiment
// ============================================================================
console.log('Test 12: Interference Experiment');
let intState = createInitialState(6, 0.15);

// Teach DOG → ANIMAL
intState = teach(intState, 0, 1, 5);
const firstRecall = recall(intState.weights, 0);
console.log(`  After teaching DOG→ANIMAL: confidence = ${firstRecall.confidence.toFixed(2)}`);

// Teach competing association: DOG → PET
intState = teach(intState, 0, 2, 5);
const secondRecall = recall(intState.weights, 0);
console.log(`  After teaching DOG→PET: confidence = ${secondRecall.confidence.toFixed(2)}`);

assert(
  intState.interferenceCount > 0,
  'Interference was detected and counted'
);

console.log('');

// ============================================================================
// Summary
// ============================================================================
console.log('='.repeat(60));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(60));

if (testsFailed === 0) {
  console.log('\n✨ All tests passed! The utilities are working correctly.\n');
} else {
  console.log(`\n⚠️  ${testsFailed} test(s) failed. Please review.\n`);
  process.exit(1);
}

// Export for use in other test files
export { assert };
