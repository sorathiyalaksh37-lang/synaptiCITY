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
 *   createInitialState
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
 * const result = recall(state.weights, 0);
 * console.log(`Predicted: ${result.predictedIndex}, Confidence: ${result.confidence}`);
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

// Forward Pass (Recall)
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

// Types
export type {
  NetworkState,
  TeachingEvent
} from './teach';
