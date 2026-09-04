/**
 * Tests for Phase 3 & 4: Recall, Interference, State Management, and Decay
 * 
 * These tests demonstrate the complete neural network utilities including
 * advanced features like interference detection and memory decay.
 */

import {
  createInitialState,
  teach,
  recallFromState,
  teachWithInterference,
  detectInterferenceDetailed,
  measureInterferenceEffect,
  applyMemoryDecay,
  applyMemoryDecayWithMetrics,
  cloneState,
  validateState,
  getStateSnapshot,
  getRecallAccuracy,
  testAssociation,
  getInterferenceStatistics,
  simulateTimePassing
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

console.log('🧪 Running Phase 3 & 4 Tests\n');

// ============================================================================
// PHASE 3: RECALL & INTERFERENCE
// ============================================================================

console.log('=== PHASE 3: RECALL & INTERFERENCE ===\n');

// Test 1: Basic Recall
console.log('Test 1: Basic Recall Function');
let state = createInitialState(6, 0.15);
state = teach(state, 0, 1, 5); // Teach DOG → ANIMAL

const recallResult = recallFromState(state, 0);
assert(typeof recallResult.outputIndex === 'number', 'Recall returns output index');
assert(recallResult.confidence >= 0 && recallResult.confidence <= 1, 'Confidence in valid range');
assert(recallResult.inputIndex === 0, 'Input index recorded correctly');
assert(recallResult.allOutputs.length === 6, 'All outputs returned');
assert(typeof recallResult.success === 'boolean', 'Success status returned');

console.log(`  Input: 0 → Output: ${recallResult.outputIndex}, Confidence: ${recallResult.confidence.toFixed(2)}`);
console.log('');

// Test 2: Recall Success Detection
console.log('Test 2: Recall Success Detection');
const highConfidenceResult = recallFromState(state, 0, 0.3); // Low threshold
const lowConfidenceResult = recallFromState(state, 0, 0.9); // High threshold

assert(highConfidenceResult.success || lowConfidenceResult.success, 'Success detection works');
console.log(`  With threshold 0.3: ${highConfidenceResult.success ? 'Success' : 'Failed'}`);
console.log(`  With threshold 0.9: ${lowConfidenceResult.success ? 'Success' : 'Failed'}`);
console.log('');

// Test 3: Test Association
console.log('Test 3: Test Association');
const assocTest = testAssociation(state, 0, 1, 0.5);
assert(typeof assocTest.isCorrect === 'boolean', 'Association test returns correctness');
assert(assocTest.expectedOutput === 1, 'Expected output tracked');

console.log(`  DOG → ANIMAL: ${assocTest.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}`);
console.log('');

// Test 4: Interference Detection
console.log('Test 4: Interference Detection');
let interferenceState = createInitialState(6, 0.15);
interferenceState = teach(interferenceState, 0, 1, 5);

const interferenceAnalysis = detectInterferenceDetailed(interferenceState, 0, 2, 0.2);
assert(typeof interferenceAnalysis.hasInterference === 'boolean', 'Interference detection works');
assert(typeof interferenceAnalysis.competitionCount === 'number', 'Competition count returned');
assert(Array.isArray(interferenceAnalysis.competingConnections), 'Competing connections listed');

console.log(`  Interference detected: ${interferenceAnalysis.hasInterference}`);
console.log(`  Competing connections: ${interferenceAnalysis.competitionCount}`);
console.log('');

// Test 5: Teaching With Interference
console.log('Test 5: Teaching With Interference');
let competingState = createInitialState(6, 0.15);

// Teach first association
competingState = teach(competingState, 0, 1, 5);
const firstRecall = recallFromState(competingState, 0);

// Teach competing association
competingState = teachWithInterference(competingState, 0, 2, 5, 0.1);
const secondRecall = recallFromState(competingState, 0);

assert(competingState.interferenceCount > 0, 'Interference count increased');
console.log(`  Before competing: Output ${firstRecall.outputIndex}, Conf: ${firstRecall.confidence.toFixed(2)}`);
console.log(`  After competing: Output ${secondRecall.outputIndex}, Conf: ${secondRecall.confidence.toFixed(2)}`);
console.log(`  Interference count: ${competingState.interferenceCount}`);
console.log('');

// Test 6: Measure Interference Effect
console.log('Test 6: Measure Interference Effect');
let measureState = createInitialState(6, 0.15);
measureState = teach(measureState, 0, 1, 5);
const beforeInterference = cloneState(measureState);

measureState = teach(measureState, 0, 2, 5);

const effect = measureInterferenceEffect(
  beforeInterference,
  measureState,
  [{ input: 0, output: 1 }]
);

assert(typeof effect.averageStrengthLoss === 'number', 'Average strength loss calculated');
assert(typeof effect.maxStrengthLoss === 'number', 'Max strength loss calculated');
assert(effect.details.length > 0, 'Details provided');

console.log(`  Average strength loss: ${effect.averageStrengthLoss.toFixed(3)}`);
console.log(`  Max strength loss: ${effect.maxStrengthLoss.toFixed(3)}`);
console.log('');

// Test 7: Recall Accuracy
console.log('Test 7: Recall Accuracy');
let accuracyState = createInitialState(6, 0.15);
accuracyState = teach(accuracyState, 0, 1, 5);
accuracyState = teach(accuracyState, 2, 3, 5);

const accuracy = getRecallAccuracy(
  accuracyState,
  [
    { input: 0, expectedOutput: 1 },
    { input: 2, expectedOutput: 3 }
  ],
  0.5
);

assert(accuracy.total === 2, 'Total associations counted');
assert(typeof accuracy.percentage === 'number', 'Percentage calculated');
assert(accuracy.results.length === 2, 'Individual results returned');

console.log(`  Accuracy: ${accuracy.correct}/${accuracy.total} (${accuracy.percentage.toFixed(1)}%)`);
console.log('');

// Test 8: Interference Statistics
console.log('Test 8: Interference Statistics');
let statsState = createInitialState(6, 0.15);
statsState = teach(statsState, 0, 1, 3);
statsState = teach(statsState, 0, 2, 3);
statsState = teach(statsState, 0, 3, 3);

const interfStats = getInterferenceStatistics(statsState, 0.2);
assert(typeof interfStats.totalInterferenceCount === 'number', 'Total interference tracked');
assert(typeof interfStats.mostConflictedNode === 'number', 'Most conflicted node identified');
assert(Array.isArray(interfStats.overloadedNodes), 'Overloaded nodes listed');

console.log(`  Total interference: ${interfStats.totalInterferenceCount}`);
console.log(`  Most conflicted node: ${interfStats.mostConflictedNode}`);
console.log(`  Overloaded nodes: ${interfStats.overloadedNodes.length}`);
console.log('');

// ============================================================================
// PHASE 4: STATE MANAGEMENT & DECAY
// ============================================================================

console.log('=== PHASE 4: STATE MANAGEMENT & DECAY ===\n');

// Test 9: State Cloning
console.log('Test 9: State Cloning');
const original = createInitialState(6, 0.1);
const cloned = cloneState(original);

// Modify clone
cloned.weights[0][1] = 0.999;

assert(original.weights[0][1] !== cloned.weights[0][1], 'Clone is independent');
assert(cloned.weights.length === original.weights.length, 'Dimensions preserved');
console.log('  Clone independence verified ✓');
console.log('');

// Test 10: State Validation
console.log('Test 10: State Validation');
const validState = createInitialState(6, 0.1);
const isValid = validateState(validState);

assert(isValid === true, 'Valid state passes validation');

// Create invalid state
const invalidState = { ...validState, learningRate: 2.0 }; // Invalid rate
const isInvalid = validateState(invalidState);

assert(isInvalid === false, 'Invalid state fails validation');
console.log('  Validation working correctly ✓');
console.log('');

// Test 11: State Snapshot
console.log('Test 11: State Snapshot');
let snapshotState = createInitialState(6, 0.15);
snapshotState = teach(snapshotState, 0, 1, 3);

const snapshot = getStateSnapshot(snapshotState);
assert(snapshot.numNodes === 6, 'Node count in snapshot');
assert(snapshot.repetitions === 3, 'Repetitions tracked');
assert(typeof snapshot.weightStats.mean === 'number', 'Weight stats calculated');
assert(typeof snapshot.timestamp === 'number', 'Timestamp included');

console.log(`  Nodes: ${snapshot.numNodes}`);
console.log(`  Repetitions: ${snapshot.repetitions}`);
console.log(`  Avg weight: ${snapshot.weightStats.mean.toFixed(3)}`);
console.log('');

// Test 12: Memory Decay
console.log('Test 12: Memory Decay');
let decayState = createInitialState(6, 0.15, 0.1);
decayState = teach(decayState, 0, 1, 5);

const weightBefore = decayState.weights[0][1];
decayState = applyMemoryDecay(decayState, 0.1);
const weightAfter = decayState.weights[0][1];

assert(weightAfter < weightBefore, 'Weights decreased after decay');
assert(weightAfter > 0, 'Weights still positive');

console.log(`  Weight before: ${weightBefore.toFixed(3)}`);
console.log(`  Weight after: ${weightAfter.toFixed(3)}`);
console.log(`  Decay: ${(weightBefore - weightAfter).toFixed(3)}`);
console.log('');

// Test 13: Decay With Metrics
console.log('Test 13: Decay With Metrics');
let metricsState = createInitialState(6, 0.15);
metricsState = teach(metricsState, 0, 1, 5);
metricsState = teach(metricsState, 2, 3, 5);

const decayResult = applyMemoryDecayWithMetrics(metricsState, 0.1);
assert(decayResult.weightsBefore > decayResult.weightsAfter, 'Average weight decreased');
assert(typeof decayResult.totalDecay === 'number', 'Total decay calculated');
assert(typeof decayResult.weakenedWeights === 'number', 'Weakened weights counted');

console.log(`  Weights before: ${decayResult.weightsBefore.toFixed(3)}`);
console.log(`  Weights after: ${decayResult.weightsAfter.toFixed(3)}`);
console.log(`  Total decay: ${decayResult.totalDecay.toFixed(3)}`);
console.log(`  Weakened weights: ${decayResult.weakenedWeights}`);
console.log('');

// Test 14: Time Simulation
console.log('Test 14: Time Simulation');
let timeState = createInitialState(6, 0.15, 0.05);
timeState = teach(timeState, 0, 1, 5);

const strengthBefore = timeState.weights[0][1];
timeState = simulateTimePassing(timeState, 10, 1, 0.05);
const strengthAfter = timeState.weights[0][1];

assert(strengthAfter < strengthBefore, 'Memory faded over time');
console.log(`  Strength before: ${strengthBefore.toFixed(3)}`);
console.log(`  Strength after 10 steps: ${strengthAfter.toFixed(3)}`);
console.log(`  Fading: ${((strengthBefore - strengthAfter) / strengthBefore * 100).toFixed(1)}%`);
console.log('');

// Test 15: Complete Learning Cycle with Decay
console.log('Test 15: Complete Learning Cycle with Decay');
let cycleState = createInitialState(6, 0.15, 0.03);

// Teach association
cycleState = teach(cycleState, 0, 1, 5);
const initialRecall = recallFromState(cycleState, 0);

// Time passes
cycleState = simulateTimePassing(cycleState, 20, 2);
const afterDecay = recallFromState(cycleState, 0);

// Reteach to strengthen
cycleState = teach(cycleState, 0, 1, 3);
const afterReteach = recallFromState(cycleState, 0);

console.log(`  Initial: Output ${initialRecall.outputIndex}, Conf: ${initialRecall.confidence.toFixed(2)}`);
console.log(`  After decay: Output ${afterDecay.outputIndex}, Conf: ${afterDecay.confidence.toFixed(2)}`);
console.log(`  After reteach: Output ${afterReteach.outputIndex}, Conf: ${afterReteach.confidence.toFixed(2)}`);

assert(
  afterReteach.confidence >= afterDecay.confidence,
  'Reteaching restores confidence'
);
console.log('');

// Test 16: Interference + Decay Combined
console.log('Test 16: Interference + Decay Combined');
let combinedState = createInitialState(6, 0.15, 0.05);

// Teach first association
combinedState = teach(combinedState, 0, 1, 5);
const first = recallFromState(combinedState, 0);

// Add interference
combinedState = teachWithInterference(combinedState, 0, 2, 5);
const withInterference = recallFromState(combinedState, 0);

// Apply decay
combinedState = applyMemoryDecay(combinedState, 0.1);
const afterBoth = recallFromState(combinedState, 0);

console.log(`  Original: Conf ${first.confidence.toFixed(2)}`);
console.log(`  With interference: Conf ${withInterference.confidence.toFixed(2)}`);
console.log(`  With interference + decay: Conf ${afterBoth.confidence.toFixed(2)}`);

assert(
  first.confidence > afterBoth.confidence,
  'Combined effects reduce confidence'
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
  console.log('\n✨ All Phase 3 & 4 tests passed!\n');
  console.log('Phase 3 Features Verified:');
  console.log('  ✓ Recall function with confidence');
  console.log('  ✓ Interference detection');
  console.log('  ✓ Competing association handling');
  console.log('  ✓ Accuracy measurement');
  console.log('  ✓ Statistics tracking\n');
  
  console.log('Phase 4 Features Verified:');
  console.log('  ✓ State management (clone, validate)');
  console.log('  ✓ Memory decay');
  console.log('  ✓ Time simulation');
  console.log('  ✓ State snapshots');
  console.log('  ✓ Combined interference + decay\n');
} else {
  console.log(`\n⚠️  ${testsFailed} test(s) failed. Please review.\n`);
  process.exit(1);
}
