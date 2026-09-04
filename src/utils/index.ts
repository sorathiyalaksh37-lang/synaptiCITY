/**
 * Neural Network Utilities - Main Export
 * 
 * This module provides a complete toolkit for building and understanding
 * Hebbian learning neural networks.
 * 
 * Usage:
 * ------
 * ```typescript
 * import { 
 *   NeuralNetwork,
 *   hebbianUpdate,
 *   forwardPass,
 *   teach,
 *   createInitialState,
 *   recallFromState,
 *   applyMemoryDecay
 * } from './utils';
 * 
 * // Create network
 * const network = new NeuralNetwork(6, 0.1);
 * 
 * // Or use state-based approach
 * let state = createInitialState(6, 0.1);
 * state = teach(state, 0, 1, 3); // Teach 0 → 1 three times
 * 
 * // Recall
 * const result = recallFromState(state, 0);
 * console.log(`Predicted: ${result.outputIndex}, Confidence: ${result.confidence}`);
 * 
 * // Apply decay
 * state = applyMemoryDecay(state, 0.05);
 * ```
 * 
 * @module utils
 */

// Core Network Management
export {
  NeuralNetwork,
  createNeuralNetwork,
  clampWeights
} from './neuralNetwork';

// Hebbian Learning
export {
  hebbianUpdate,
  hebbianUpdateMultiple,
  hebbianUpdateWithDecay,
  antiHebbianUpdate,
  calculateHebbianDelta,
  normalizeWeights,
  getConnectionStrength
} from './hebbian';

// Forward Pass
export {
  forwardPass,
  recall,
  recallWithSoftmax,
  recallTopK,
  sigmoid,
  sigmoidVector,
  linear,
  relu,
  softmax,
  matrixVectorMultiply,
  createOneHot,
  argmax,
  cosineSimilarity
} from './forwardPass';

// Teaching Functions
export {
  teach,
  teachMultiple,
  createInitialState,
  clearActivations,
  setLearningRate,
  resetState,
  getStateStats,
  detectInterference,
  exportState,
  importState
} from './teach';

// Recall Functions (Phase 3)
export {
  recallFromState,
  recallMultiple,
  testAssociation,
  getRecallAccuracy,
  analyzeConfusion,
  getAssociationStrength,
  compareRecall,
  calculateConfidence
} from './recall';
export type { RecallResult } from './recall';

// Interference Functions (Phase 3)
export {
  detectInterferenceDetailed,
  teachWithInterference,
  measureInterferenceEffect,
  simulateCatastrophicInterference,
  applyInterferenceDecay,
  getInterferenceStatistics,
  resolveInterference
} from './interference';
export type { InterferenceResult } from './interference';

// Network State Management (Phase 4)
export {
  createInitialState as createNetworkState,
  cloneState,
  validateState,
  getStateSnapshot,
  serializeState,
  deserializeState,
  compareStates,
  mergeStates,
  resetToInitial,
  getStateDifference
} from './networkState';

// Memory Decay Functions (Phase 4)
export {
  applyMemoryDecay,
  applyMemoryDecayWithMetrics,
  applySelectiveDecay,
  applyExponentialDecay,
  applyActivityDependentDecay,
  simulateTimePassing,
  getDecayStatistics,
  preventDecayFor
} from './decay';
export type { DecayResult } from './decay';

// Types
export type {
  NetworkState,
  TeachingEvent
} from './teach';
