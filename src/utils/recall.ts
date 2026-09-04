/**
 * Recall Function Implementation
 * 
 * Handles the recall (prediction) of learned associations.
 * This is how the network "remembers" what it has learned.
 * 
 * @module recall
 */

import { forwardPass, createOneHot, argmax } from './forwardPass';
import type { NetworkState } from './teach';

/**
 * Result of a recall operation
 * 
 * Contains information about what the network predicted
 * and how confident it is in that prediction.
 */
export interface RecallResult {
  /** Index of the node with highest activation (the prediction) */
  outputIndex: number;
  
  /** Confidence score between 0 and 1 */
  confidence: number;
  
  /** All output activations for debugging */
  allOutputs: number[];
  
  /** Whether recall was successful (confidence > threshold) */
  success: boolean;
  
  /** The input index that was recalled */
  inputIndex: number;
  
  /** Timestamp of recall */
  timestamp: number;
}

/**
 * Validates that an index is within bounds
 */
function validateIndex(index: number, maxIndex: number, name: string): void {
  if (!Number.isInteger(index)) {
    throw new Error(`${name} must be an integer, got ${index}`);
  }
  if (index < 0 || index >= maxIndex) {
    throw new Error(
      `${name} must be between 0 and ${maxIndex - 1}, got ${index}`
    );
  }
}

/**
 * Calculates confidence score for recall
 * 
 * Confidence represents how certain the network is about its prediction.
 * 
 * Two methods:
 * 1. Normalized: max(output) / sum(output) - relative confidence
 * 2. Absolute: max(output) - absolute activation strength
 * 
 * We use normalized by default as it's more interpretable.
 * 
 * @param outputs - Array of output activations
 * @param method - 'normalized' or 'absolute'
 * @returns Confidence score between 0 and 1
 */
export function calculateConfidence(
  outputs: number[],
  method: 'normalized' | 'absolute' = 'normalized'
): number {
  if (outputs.length === 0) {
    return 0;
  }
  
  const maxOutput = Math.max(...outputs);
  
  if (method === 'absolute') {
    // Absolute confidence is just the max activation
    return Math.min(maxOutput, 1.0);
  }
  
  // Normalized confidence
  const sum = outputs.reduce((acc, val) => acc + val, 0);
  
  if (sum === 0) {
    return 0; // No activations = no confidence
  }
  
  return maxOutput / sum;
}

/**
 * Performs recall operation on the neural network
 * 
 * This is the core function that makes the network "remember".
 * Given an input node, it predicts which output node should activate.
 * 
 * How It Works:
 * ------------
 * 1. Activate the input node (set to 1.0)
 * 2. Run forward pass through weight matrix
 * 3. Get all output activations
 * 4. Find the node with highest activation
 * 5. Calculate confidence in the prediction
 * 6. Determine if recall was successful
 * 
 * Example:
 * --------
 * If you taught DOG → ANIMAL:
 * - Input: DOG (node 0)
 * - Forward pass activates all nodes based on weights
 * - ANIMAL (node 1) has highest activation
 * - Return: outputIndex=1, confidence=0.85
 * 
 * Success Criteria:
 * ----------------
 * Recall is "successful" if:
 * - Confidence > threshold (default 0.5)
 * - At least one output is activated
 * - The prediction is clear (not ambiguous)
 * 
 * @param state - Current network state
 * @param inputIndex - Index of input node to recall from
 * @param successThreshold - Minimum confidence for success (default: 0.5)
 * @param confidenceMethod - How to calculate confidence (default: 'normalized')
 * @returns RecallResult with prediction and metadata
 * 
 * @throws Error if inputIndex is out of bounds
 * @throws Error if state has invalid weights
 * 
 * @example
 * ```typescript
 * const result = recallFromState(state, 0);
 * console.log(`Predicted: ${result.outputIndex}`);
 * console.log(`Confidence: ${result.confidence.toFixed(2)}`);
 * console.log(`Success: ${result.success}`);
 * ```
 */
export function recallFromState(
  state: NetworkState,
  inputIndex: number,
  successThreshold: number = 0.5,
  confidenceMethod: 'normalized' | 'absolute' = 'normalized'
): RecallResult {
  // Validate inputs
  const numNodes = state.weights.length;
  validateIndex(inputIndex, numNodes, 'inputIndex');
  
  if (successThreshold < 0 || successThreshold > 1) {
    throw new Error(`Success threshold must be between 0 and 1, got ${successThreshold}`);
  }
  
  // Validate weights matrix
  if (!Array.isArray(state.weights) || state.weights.length === 0) {
    throw new Error('State must have valid weights matrix');
  }
  
  // Create one-hot input vector (only input node is active)
  const inputVector = createOneHot(inputIndex, numNodes);
  
  // Run forward pass through the network
  const allOutputs = forwardPass(state.weights, inputVector);
  
  // Handle edge case: all outputs are zero
  if (allOutputs.every(output => output === 0)) {
    return {
      outputIndex: -1,
      confidence: 0,
      allOutputs,
      success: false,
      inputIndex,
      timestamp: Date.now()
    };
  }
  
  // Find the node with highest activation
  const outputIndex = argmax(allOutputs);
  
  // Calculate confidence in the prediction
  const confidence = calculateConfidence(allOutputs, confidenceMethod);
  
  // Determine if recall was successful
  const success = confidence >= successThreshold;
  
  return {
    outputIndex,
    confidence,
    allOutputs,
    success,
    inputIndex,
    timestamp: Date.now()
  };
}

/**
 * Performs multiple recall operations
 * 
 * Tests recall for multiple input nodes at once.
 * Useful for evaluating overall network performance.
 * 
 * @param state - Current network state
 * @param inputIndices - Array of input indices to test
 * @param successThreshold - Minimum confidence for success
 * @returns Array of RecallResult objects
 * 
 * @example
 * ```typescript
 * const results = recallMultiple(state, [0, 1, 2]);
 * results.forEach(result => {
 *   console.log(`Input ${result.inputIndex} → Output ${result.outputIndex}`);
 * });
 * ```
 */
export function recallMultiple(
  state: NetworkState,
  inputIndices: number[],
  successThreshold: number = 0.5
): RecallResult[] {
  return inputIndices.map(index => 
    recallFromState(state, index, successThreshold)
  );
}

/**
 * Tests if a specific association has been learned
 * 
 * Checks whether input → expectedOutput is correctly recalled.
 * 
 * @param state - Current network state
 * @param inputIndex - Input node index
 * @param expectedOutputIndex - Expected output node index
 * @param successThreshold - Minimum confidence for success
 * @returns Object with success status and actual result
 * 
 * @example
 * ```typescript
 * // Test if DOG → ANIMAL was learned
 * const test = testAssociation(state, 0, 1);
 * console.log(`Learned correctly: ${test.isCorrect}`);
 * console.log(`Confidence: ${test.result.confidence}`);
 * ```
 */
export function testAssociation(
  state: NetworkState,
  inputIndex: number,
  expectedOutputIndex: number,
  successThreshold: number = 0.5
): {
  isCorrect: boolean;
  result: RecallResult;
  expectedOutput: number;
} {
  const result = recallFromState(state, inputIndex, successThreshold);
  const isCorrect = result.outputIndex === expectedOutputIndex && result.success;
  
  return {
    isCorrect,
    result,
    expectedOutput: expectedOutputIndex
  };
}

/**
 * Gets recall accuracy for multiple associations
 * 
 * Tests a set of expected associations and calculates accuracy.
 * 
 * @param state - Current network state
 * @param associations - Array of {input, expectedOutput} pairs
 * @param successThreshold - Minimum confidence for success
 * @returns Object with accuracy metrics
 * 
 * @example
 * ```typescript
 * const accuracy = getRecallAccuracy(state, [
 *   { input: 0, expectedOutput: 1 }, // DOG → ANIMAL
 *   { input: 2, expectedOutput: 1 }, // CAT → ANIMAL
 * ]);
 * console.log(`Accuracy: ${accuracy.percentage.toFixed(1)}%`);
 * ```
 */
export function getRecallAccuracy(
  state: NetworkState,
  associations: Array<{ input: number; expectedOutput: number }>,
  successThreshold: number = 0.5
): {
  correct: number;
  total: number;
  percentage: number;
  results: Array<{ isCorrect: boolean; result: RecallResult }>;
} {
  const results = associations.map(assoc => 
    testAssociation(state, assoc.input, assoc.expectedOutput, successThreshold)
  );
  
  const correct = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  
  return {
    correct,
    total,
    percentage,
    results
  };
}

/**
 * Analyzes confusion in recall
 * 
 * Identifies which associations are being confused with each other.
 * Useful for understanding interference patterns.
 * 
 * @param state - Current network state
 * @param associations - Expected associations to test
 * @returns Confusion matrix and analysis
 * 
 * @example
 * ```typescript
 * const confusion = analyzeConfusion(state, [
 *   { input: 0, expectedOutput: 1 },
 *   { input: 0, expectedOutput: 2 }, // Competing!
 * ]);
 * console.log('Confusion detected:', confusion.hasConfusion);
 * ```
 */
export function analyzeConfusion(
  state: NetworkState,
  associations: Array<{ input: number; expectedOutput: number }>
): {
  hasConfusion: boolean;
  confusedPairs: Array<{ input: number; expected: number; actual: number }>;
  averageConfidence: number;
} {
  const results = associations.map(assoc => ({
    assoc,
    result: recallFromState(state, assoc.input)
  }));
  
  const confusedPairs = results
    .filter(r => r.result.outputIndex !== r.assoc.expectedOutput)
    .map(r => ({
      input: r.assoc.input,
      expected: r.assoc.expectedOutput,
      actual: r.result.outputIndex
    }));
  
  const averageConfidence = results.reduce(
    (sum, r) => sum + r.result.confidence,
    0
  ) / results.length;
  
  return {
    hasConfusion: confusedPairs.length > 0,
    confusedPairs,
    averageConfidence
  };
}

/**
 * Gets the strength of a learned association
 * 
 * Returns the weight value for a specific connection,
 * which represents how strongly the association was learned.
 * 
 * @param state - Current network state
 * @param inputIndex - Input node
 * @param outputIndex - Output node
 * @returns Weight value (association strength)
 * 
 * @example
 * ```typescript
 * const strength = getAssociationStrength(state, 0, 1);
 * console.log(`DOG → ANIMAL strength: ${strength.toFixed(3)}`);
 * ```
 */
export function getAssociationStrength(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number
): number {
  const numNodes = state.weights.length;
  validateIndex(inputIndex, numNodes, 'inputIndex');
  validateIndex(outputIndex, numNodes, 'outputIndex');
  
  return state.weights[inputIndex][outputIndex];
}

/**
 * Compares recall before and after an operation
 * 
 * Useful for measuring the effect of interference or decay.
 * 
 * @param beforeState - State before operation
 * @param afterState - State after operation
 * @param inputIndex - Input to test
 * @returns Comparison object
 */
export function compareRecall(
  beforeState: NetworkState,
  afterState: NetworkState,
  inputIndex: number
): {
  before: RecallResult;
  after: RecallResult;
  confidenceChange: number;
  outputChanged: boolean;
} {
  const before = recallFromState(beforeState, inputIndex);
  const after = recallFromState(afterState, inputIndex);
  
  return {
    before,
    after,
    confidenceChange: after.confidence - before.confidence,
    outputChanged: before.outputIndex !== after.outputIndex
  };
}
