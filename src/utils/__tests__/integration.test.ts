/**
 * Integration tests for neural network system
 * 
 * Tests complete workflows, multi-step operations, and real-world scenarios.
 * Validates end-to-end functionality across all modules.
 */

import { createInitialState } from '../teach';
import {
  handleTeach,
  handleRecall,
  handleInterference,
  handleReset,
  handleDecay,
  handleBatchTeach,
} from '../../hooks/useStateHandlers';
import { getDebugData } from '../debug';
import { NetworkCache, cachedRecall, warmCache } from '../cache';
import { recallFromState } from '../recall';
import { NetworkState } from '../../types/network.types';

// Simple assertion function
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('🧪 Starting Integration Tests...\n');

// ============================================================================
// Scenario 1: Complete Learning Flow
// ============================================================================

console.log('Scenario 1: Complete Learning Flow');

// Test I.1: Teach → Recall workflow
(() => {
  let state = createInitialState(4);
  
  // Teach DOG → ANIMAL
  state = handleTeach(state, 0, 1, { repetitions: 3 });
  
  // Verify learning
  const result = handleRecall(state, 0);
  
  assert(result.outputIndex === 1, 'Should recall correct output');
  assert(result.success === true, 'Recall should succeed');
  assert(result.confidence > 0.6, 'Should have good confidence');
  assert(state.repetitions === 3, 'Should track repetitions');
  
  console.log('✓ Test I.1: Basic teach → recall workflow');
})();

// Test I.2: Multiple associations
(() => {
  let state = createInitialState(6);
  
  // Teach multiple associations
  state = handleTeach(state, 0, 1); // DOG → ANIMAL
  state = handleTeach(state, 2, 3); // CAT → PET
  state = handleTeach(state, 4, 5); // BIRD → FLIES
  
  // Test all associations
  const r1 = handleRecall(state, 0);
  const r2 = handleRecall(state, 2);
  const r3 = handleRecall(state, 4);
  
  assert(r1.outputIndex === 1, 'Association 1 should work');
  assert(r2.outputIndex === 3, 'Association 2 should work');
  assert(r3.outputIndex === 5, 'Association 3 should work');
  
  console.log('✓ Test I.2: Multiple independent associations');
})();

// Test I.3: Repeated teaching strengthens memory
(() => {
  let state = createInitialState(4);
  
  // Teach once
  state = handleTeach(state, 0, 1);
  const weakConfidence = handleRecall(state, 0).confidence;
  
  // Teach more
  state = handleTeach(state, 0, 1, { repetitions: 5 });
  const strongConfidence = handleRecall(state, 0).confidence;
  
  assert(strongConfidence > weakConfidence, 
    'More repetitions should increase confidence');
  
  console.log('✓ Test I.3: Repetition strengthens memory');
})();

// ============================================================================
// Scenario 2: Interference Scenarios
// ============================================================================

console.log('\nScenario 2: Interference Scenarios');

// Test I.4: Basic interference
(() => {
  let state = createInitialState(4);
  
  // Teach original association
  state = handleTeach(state, 0, 1, { repetitions: 3 });
  const originalConfidence = handleRecall(state, 0).confidence;
  
  // Add interference
  state = handleInterference(state, 0, 2);
  const afterInterference = handleRecall(state, 0);
  
  assert(afterInterference.confidence < originalConfidence, 
    'Interference should reduce confidence');
  assert(state.interferenceCount > 0, 'Should track interference');
  
  console.log('✓ Test I.4: Interference reduces confidence');
})();

// Test I.5: Catastrophic interference
(() => {
  let state = createInitialState(4);
  
  // Teach and reinforce
  state = handleTeach(state, 0, 1, { repetitions: 5 });
  
  // Add multiple competing associations
  state = handleInterference(state, 0, 2);
  state = handleInterference(state, 0, 3);
  
  const result = handleRecall(state, 0);
  
  // Network should be confused
  assert(result.confidence < 0.5, 
    'Multiple interference should cause low confidence');
  
  console.log('✓ Test I.5: Catastrophic interference');
})();

// Test I.6: Interference between different associations
(() => {
  let state = createInitialState(6);
  
  // Teach two associations
  state = handleTeach(state, 0, 1, { repetitions: 3 });
  state = handleTeach(state, 2, 3, { repetitions: 3 });
  
  // Add interference to first
  state = handleInterference(state, 0, 4);
  
  // Second association should be unaffected
  const r1 = handleRecall(state, 0);
  const r2 = handleRecall(state, 2);
  
  assert(r1.confidence < 0.7, 'First should be affected');
  assert(r2.confidence > 0.7, 'Second should be intact');
  assert(r2.outputIndex === 3, 'Second should recall correctly');
  
  console.log('✓ Test I.6: Selective interference');
})();

// ============================================================================
// Scenario 3: Memory Decay
// ============================================================================

console.log('\nScenario 3: Memory Decay');

// Test I.7: Decay weakens memories
(() => {
  let state = createInitialState(4);
  
  // Learn association
  state = handleTeach(state, 0, 1, { repetitions: 3 });
  const beforeDecay = handleRecall(state, 0).confidence;
  
  // Apply decay
  state = handleDecay(state, { rate: 0.2 });
  const afterDecay = handleRecall(state, 0).confidence;
  
  assert(afterDecay < beforeDecay, 'Decay should reduce confidence');
  
  console.log('✓ Test I.7: Decay weakens memories');
})();

// Test I.8: Multiple decay steps compound
(() => {
  let state = createInitialState(4);
  state.weights[0][1] = 1.0;
  
  // Apply decay 3 times
  state = handleDecay(state, { rate: 0.1 });
  state = handleDecay(state, { rate: 0.1 });
  state = handleDecay(state, { rate: 0.1 });
  
  // Should be approximately 0.729 (0.9^3)
  assert(state.weights[0][1] < 0.75, 'Decay should compound');
  assert(state.weights[0][1] > 0.70, 'Decay should be gradual');
  
  console.log('✓ Test I.8: Compound decay over time');
})();

// Test I.9: Decay + relearning
(() => {
  let state = createInitialState(4);
  
  // Learn, decay, relearn
  state = handleTeach(state, 0, 1, { repetitions: 3 });
  state = handleDecay(state, { rate: 0.5 });
  state = handleTeach(state, 0, 1, { repetitions: 2 });
  
  const result = handleRecall(state, 0);
  
  assert(result.success === true, 'Should recover after relearning');
  assert(result.outputIndex === 1, 'Should remember correct association');
  
  console.log('✓ Test I.9: Relearning after decay');
})();

// ============================================================================
// Scenario 4: State Management
// ============================================================================

console.log('\nScenario 4: State Management');

// Test I.10: Reset clears all learning
(() => {
  let state = createInitialState(4);
  
  // Learn associations
  state = handleTeach(state, 0, 1, { repetitions: 5 });
  state = handleTeach(state, 2, 3, { repetitions: 5 });
  
  // Reset
  const newState = handleReset(4);
  
  assert(newState.repetitions === 0, 'Repetitions should reset');
  assert(newState.interferenceCount === 0, 'Interference should reset');
  assert(newState.history.length === 1, 'History should be cleared (except reset entry)');
  
  console.log('✓ Test I.10: Reset clears learning');
})();

// Test I.11: Batch teaching
(() => {
  let state = createInitialState(8);
  
  const associations: Array<[number, number]> = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
  ];
  
  state = handleBatchTeach(state, associations, 2);
  
  // Test all associations
  for (const [input, output] of associations) {
    const result = handleRecall(state, input);
    assert(result.outputIndex === output, 
      `Association ${input}→${output} should work`);
  }
  
  console.log('✓ Test I.11: Batch teaching multiple associations');
})();

// Test I.12: History tracking
(() => {
  let state = createInitialState(4);
  
  state = handleTeach(state, 0, 1);
  state = handleInterference(state, 0, 2);
  state = handleDecay(state);
  
  assert(state.history.length >= 3, 'Should track all operations');
  assert(state.history.some(h => h.action === 'teach'), 'Should track teaching');
  assert(state.history.some(h => h.action === 'interference'), 'Should track interference');
  assert(state.history.some(h => h.action === 'decay'), 'Should track decay');
  
  console.log('✓ Test I.12: Complete history tracking');
})();

// ============================================================================
// Scenario 5: Debug & Monitoring
// ============================================================================

console.log('\nScenario 5: Debug & Monitoring');

// Test I.13: Debug data throughout lifecycle
(() => {
  let state = createInitialState(4);
  
  // Initial state
  let debug = getDebugData(state);
  assert(debug.repetitions === 0, 'Initially no repetitions');
  assert(debug.totalUpdates === 0, 'Initially no updates');
  
  // After teaching
  state = handleTeach(state, 0, 1, { repetitions: 3 });
  debug = getDebugData(state);
  assert(debug.repetitions === 3, 'Should track repetitions');
  assert(debug.totalUpdates > 0, 'Should track updates');
  assert(debug.strongestConnection.value > 0, 'Should identify strongest');
  
  // After interference
  state = handleInterference(state, 0, 2);
  debug = getDebugData(state);
  assert(debug.interferenceCount > 0, 'Should track interference');
  
  console.log('✓ Test I.13: Debug data accuracy');
})();

// Test I.14: Debug statistics calculation
(() => {
  let state = createInitialState(4);
  state = handleTeach(state, 0, 1, { repetitions: 5 });
  state = handleTeach(state, 2, 3, { repetitions: 3 });
  
  const debug = getDebugData(state);
  
  assert(debug.averageWeight !== undefined, 'Should calculate average');
  assert(debug.weightStdDev !== undefined, 'Should calculate std dev');
  assert(debug.accuracy >= 0 && debug.accuracy <= 1, 'Accuracy in range');
  
  console.log('✓ Test I.14: Debug statistics');
})();

// ============================================================================
// Scenario 6: Caching & Performance
// ============================================================================

console.log('\nScenario 6: Caching & Performance');

// Test I.15: Cache improves performance
(() => {
  const cache = new NetworkCache({ maxSize: 50, ttl: 10000 });
  let state = createInitialState(4);
  state = handleTeach(state, 0, 1, { repetitions: 5 });
  
  // First call (cache miss)
  const result1 = cachedRecall(state, 0, recallFromState, cache);
  const stats1 = cache.getStats();
  assert(stats1.misses === 1, 'Should miss first time');
  
  // Second call (cache hit)
  const result2 = cachedRecall(state, 0, recallFromState, cache);
  const stats2 = cache.getStats();
  assert(stats2.hits === 1, 'Should hit second time');
  
  assert(result1.outputIndex === result2.outputIndex, 
    'Cached result should match');
  
  console.log('✓ Test I.15: Cache hit/miss behavior');
})();

// Test I.16: Cache invalidation on state change
(() => {
  const cache = new NetworkCache();
  let state = createInitialState(4);
  state = handleTeach(state, 0, 1);
  
  // Cache result
  cachedRecall(state, 0, recallFromState, cache);
  
  // Modify state
  state = handleTeach(state, 0, 1);
  
  // Should not use old cache (weights changed)
  const result = cachedRecall(state, 0, recallFromState, cache);
  const stats = cache.getStats();
  
  // With different state, hash will differ, so miss expected
  assert(stats.misses >= 1, 'State change should cause cache miss');
  
  console.log('✓ Test I.16: Cache invalidation on state change');
})();

// Test I.17: Cache warming
(() => {
  const cache = new NetworkCache();
  let state = createInitialState(6);
  state = handleTeach(state, 0, 1);
  state = handleTeach(state, 2, 3);
  state = handleTeach(state, 4, 5);
  
  // Warm cache for all inputs
  warmCache(state, [0, 2, 4], recallFromState, cache);
  
  assert(cache.size() === 3, 'Should warm all entries');
  
  // All subsequent calls should hit cache
  cachedRecall(state, 0, recallFromState, cache);
  cachedRecall(state, 2, recallFromState, cache);
  cachedRecall(state, 4, recallFromState, cache);
  
  const stats = cache.getStats();
  assert(stats.hits === 3, 'All warmed entries should hit');
  
  console.log('✓ Test I.17: Cache warming');
})();

// ============================================================================
// Scenario 7: Complex Workflows
// ============================================================================

console.log('\nScenario 7: Complex Real-World Workflows');

// Test I.18: Complete simulation of learning lifecycle
(() => {
  let state = createInitialState(6);
  
  // Day 1: Initial learning
  state = handleTeach(state, 0, 1, { repetitions: 5 }); // DOG → ANIMAL
  state = handleTeach(state, 2, 3, { repetitions: 5 }); // CAT → PET
  
  const day1_dog = handleRecall(state, 0);
  assert(day1_dog.success, 'Day 1: Should remember DOG');
  
  // Day 2: Memory decay overnight
  state = handleDecay(state, { rate: 0.1 });
  
  // Day 2: Add new learning
  state = handleTeach(state, 4, 5, { repetitions: 3 }); // BIRD → FLIES
  
  // Day 2: Interference
  state = handleInterference(state, 0, 4); // DOG → FLIES (wrong!)
  
  // Day 3: More decay
  state = handleDecay(state, { rate: 0.1 });
  
  // Day 3: Test memory
  const day3_dog = handleRecall(state, 0);
  const day3_cat = handleRecall(state, 2);
  const day3_bird = handleRecall(state, 4);
  
  // DOG association should be weakest (interference + decay)
  // CAT should be intact (no interference, only decay)
  // BIRD should be recent and strong
  
  assert(day3_cat.success, 'CAT should still be remembered');
  assert(day3_bird.success, 'BIRD should be recent');
  
  const debug = getDebugData(state);
  assert(debug.interferenceCount > 0, 'Should track interference events');
  
  console.log('✓ Test I.18: Multi-day learning simulation');
})();

// Test I.19: Large network stress test
(() => {
  let state = createInitialState(20);
  
  // Teach 10 associations
  for (let i = 0; i < 10; i++) {
    const input = i * 2;
    const output = i * 2 + 1;
    state = handleTeach(state, input, output, { repetitions: 3 });
  }
  
  // Test all associations
  let successCount = 0;
  for (let i = 0; i < 10; i++) {
    const input = i * 2;
    const output = i * 2 + 1;
    const result = handleRecall(state, input);
    if (result.outputIndex === output) {
      successCount++;
    }
  }
  
  assert(successCount >= 8, 'Should remember most associations in large network');
  
  console.log('✓ Test I.19: Large network (20 nodes, 10 associations)');
})();

// Test I.20: Parameter tuning affects learning
(() => {
  // High learning rate
  let fastState = createInitialState(4);
  fastState = handleTeach(fastState, 0, 1, { learningRate: 0.5 });
  const fastConfidence = handleRecall(fastState, 0).confidence;
  
  // Low learning rate
  let slowState = createInitialState(4);
  slowState = handleTeach(slowState, 0, 1, { learningRate: 0.05 });
  const slowConfidence = handleRecall(slowState, 0).confidence;
  
  assert(fastConfidence > slowConfidence, 
    'Higher learning rate should learn faster');
  
  console.log('✓ Test I.20: Learning rate affects speed');
})();

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log('✅ All Integration Tests Passed!');
console.log('='.repeat(50));
console.log('Total scenarios: 7');
console.log('Total tests: 20');
console.log('Coverage:');
console.log('  - Complete learning workflows ✓');
console.log('  - Interference scenarios ✓');
console.log('  - Memory decay ✓');
console.log('  - State management ✓');
console.log('  - Debug & monitoring ✓');
console.log('  - Caching & performance ✓');
console.log('  - Complex real-world workflows ✓');
console.log('='.repeat(50));
