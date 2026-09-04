/**
 * Forward Pass (Recall) Implementation
 * 
 * Implements the forward pass through the neural network, which is how
 * the network "recalls" or "predicts" based on learned weights.
 * 
 * This is the inference step where:
 * - Input activations are multiplied by weights
 * - Results pass through activation function
 * - Output represents the network's prediction
 * 
 * @module forwardPass
 */

/**
 * Sigmoid activation function
 * 
 * Maps any real value to the range (0, 1)
 * 
 * Formula: σ(x) = 1 / (1 + e^(-x))
 * 
 * Properties:
 * - Smooth, differentiable
 * - Output bounded between 0 and 1
 * - S-shaped curve (sigmoidal)
 * - σ(0) = 0.5
 * - σ(+∞) → 1
 * - σ(-∞) → 0
 * 
 * @param x - Input value
 * @returns Activated value between 0 and 1
 */
export function sigmoid(x: number): number {
  // Prevent overflow for very large negative numbers
  if (x < -500) return 0;
  if (x > 500) return 1;
  
  return 1 / (1 + Math.exp(-x));
}

/**
 * Applies sigmoid activation to an array of values
 * 
 * @param vector - Array of numbers to activate
 * @returns Array with sigmoid applied to each element
 */
export function sigmoidVector(vector: number[]): number[] {
  return vector.map(sigmoid);
}

/**
 * Linear activation (identity function)
 * 
 * Returns the input unchanged.
 * Useful for understanding network behavior without non-linearity.
 * 
 * @param x - Input value
 * @returns Same value
 */
export function linear(x: number): number {
  return x;
}

/**
 * ReLU (Rectified Linear Unit) activation
 * 
 * Formula: ReLU(x) = max(0, x)
 * 
 * Properties:
 * - Fast to compute
 * - No saturation for positive values
 * - Sparse activation (many zeros)
 * 
 * @param x - Input value
 * @returns max(0, x)
 */
export function relu(x: number): number {
  return Math.max(0, x);
}

/**
 * Softmax activation for probability distribution
 * 
 * Converts a vector of values into a probability distribution
 * where all outputs sum to 1.
 * 
 * Formula: softmax(x_i) = e^(x_i) / Σ(e^(x_j))
 * 
 * @param vector - Input vector
 * @returns Probability distribution (sums to 1)
 */
export function softmax(vector: number[]): number[] {
  // Subtract max for numerical stability
  const max = Math.max(...vector);
  const exps = vector.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(exp => exp / sum);
}

/**
 * Matrix-vector multiplication
 * 
 * Multiplies a matrix by a column vector.
 * 
 * For weight matrix W (m × n) and input vector x (n × 1):
 * y = W × x
 * 
 * Where y_i = Σ(W_ij × x_j) for all j
 * 
 * @param matrix - Weight matrix (m × n)
 * @param vector - Input vector (n × 1)
 * @returns Result vector (m × 1)
 * @throws Error if dimensions don't match
 */
export function matrixVectorMultiply(
  matrix: number[][],
  vector: number[]
): number[] {
  const rows = matrix.length;
  if (rows === 0) {
    throw new Error('Matrix must have at least one row');
  }
  
  const cols = matrix[0].length;
  if (cols !== vector.length) {
    throw new Error(
      `Matrix columns (${cols}) must match vector length (${vector.length})`
    );
  }
  
  const result: number[] = [];
  
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    for (let j = 0; j < cols; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result.push(sum);
  }
  
  return result;
}

/**
 * Performs forward pass through the neural network
 * 
 * This is how the network "thinks" or "recalls":
 * 1. Takes an input activation pattern
 * 2. Multiplies by learned weights
 * 3. Applies activation function
 * 4. Returns output predictions
 * 
 * The Science:
 * -----------
 * - High output values = strong prediction
 * - The highest output is the network's best guess
 * - Output strengths reflect connection strengths
 * 
 * Example:
 * --------
 * If we learned DOG → ANIMAL:
 * - Input: [1, 0, 0, 0, 0, 0] (DOG active)
 * - Weights multiply this
 * - Output: [0.1, 0.8, 0.2, 0.1, 0.1, 0.1]
 * - Highest = index 1 (ANIMAL)
 * 
 * @param weights - Weight matrix (N × N)
 * @param inputVector - Input activations (N × 1)
 * @param activationFn - Activation function (default: sigmoid)
 * @returns Output vector (N × 1) with activated values
 * @throws Error if dimensions don't match
 * 
 * @example
 * ```typescript
 * const weights = [
 *   [0, 0.8, 0.1],
 *   [0.2, 0, 0.3],
 *   [0.1, 0.2, 0]
 * ];
 * const input = [1, 0, 0]; // First node active
 * const output = forwardPass(weights, input);
 * // output ≈ [0.5, 0.69, 0.55] (after sigmoid)
 * ```
 */
export function forwardPass(
  weights: number[][],
  inputVector: number[],
  activationFn: (x: number) => number = sigmoid
): number[] {
  // Validate inputs
  if (!Array.isArray(weights) || weights.length === 0) {
    throw new Error('Weights must be a non-empty 2D array');
  }
  
  if (!Array.isArray(inputVector) || inputVector.length === 0) {
    throw new Error('Input vector must be a non-empty array');
  }
  
  const n = weights.length;
  if (inputVector.length !== n) {
    throw new Error(
      `Input vector length (${inputVector.length}) must match number of nodes (${n})`
    );
  }
  
  // Validate input values are between 0 and 1
  for (let i = 0; i < inputVector.length; i++) {
    if (inputVector[i] < 0 || inputVector[i] > 1) {
      throw new Error(
        `Input value at index ${i} must be between 0 and 1, got ${inputVector[i]}`
      );
    }
  }
  
  // Perform matrix-vector multiplication
  const rawOutput = matrixVectorMultiply(weights, inputVector);
  
  // Apply activation function
  const activatedOutput = rawOutput.map(activationFn);
  
  return activatedOutput;
}

/**
 * Creates a one-hot input vector
 * 
 * One-hot encoding: a vector with one element set to 1, rest to 0.
 * Used to represent a single active node.
 * 
 * @param index - Index of the active node
 * @param size - Total number of nodes
 * @returns One-hot vector
 * 
 * @example
 * ```typescript
 * createOneHot(2, 5) // [0, 0, 1, 0, 0]
 * ```
 */
export function createOneHot(index: number, size: number): number[] {
  if (index < 0 || index >= size) {
    throw new Error(`Index ${index} out of bounds for size ${size}`);
  }
  
  const vector = new Array(size).fill(0);
  vector[index] = 1;
  return vector;
}

/**
 * Finds the index of the maximum value in a vector
 * 
 * Returns the index with the highest activation.
 * This is the network's prediction.
 * 
 * @param vector - Output vector
 * @returns Index of maximum value
 * 
 * @example
 * ```typescript
 * argmax([0.1, 0.8, 0.3]) // 1
 * ```
 */
export function argmax(vector: number[]): number {
  if (vector.length === 0) {
    throw new Error('Vector must not be empty');
  }
  
  let maxIndex = 0;
  let maxValue = vector[0];
  
  for (let i = 1; i < vector.length; i++) {
    if (vector[i] > maxValue) {
      maxValue = vector[i];
      maxIndex = i;
    }
  }
  
  return maxIndex;
}

/**
 * Performs recall for a specific node index
 * 
 * Convenience function that:
 * 1. Creates one-hot input
 * 2. Performs forward pass
 * 3. Returns the predicted index and confidence
 * 
 * @param weights - Weight matrix
 * @param inputIndex - Index of input node
 * @returns Object with predicted index and confidence
 * 
 * @example
 * ```typescript
 * const result = recall(weights, 0); // Activate node 0
 * // result = { predictedIndex: 1, confidence: 0.85, allOutputs: [...] }
 * ```
 */
export function recall(
  weights: number[][],
  inputIndex: number
): {
  predictedIndex: number;
  confidence: number;
  allOutputs: number[];
} {
  const n = weights.length;
  const inputVector = createOneHot(inputIndex, n);
  const outputs = forwardPass(weights, inputVector);
  const predictedIndex = argmax(outputs);
  const confidence = outputs[predictedIndex];
  
  return {
    predictedIndex,
    confidence,
    allOutputs: outputs
  };
}

/**
 * Performs recall with softmax normalization
 * 
 * Uses softmax instead of sigmoid, so outputs form
 * a proper probability distribution (sum to 1).
 * 
 * Better for:
 * - Clear winner-take-all behavior
 * - Interpreting as probabilities
 * - Multi-class prediction
 * 
 * @param weights - Weight matrix
 * @param inputIndex - Index of input node
 * @returns Object with predicted index, confidence, and all probabilities
 */
export function recallWithSoftmax(
  weights: number[][],
  inputIndex: number
): {
  predictedIndex: number;
  confidence: number;
  probabilities: number[];
} {
  const n = weights.length;
  const inputVector = createOneHot(inputIndex, n);
  
  // Forward pass with linear activation (before softmax)
  const rawOutput = matrixVectorMultiply(weights, inputVector);
  
  // Apply softmax to get probabilities
  const probabilities = softmax(rawOutput);
  
  const predictedIndex = argmax(probabilities);
  const confidence = probabilities[predictedIndex];
  
  return {
    predictedIndex,
    confidence,
    probabilities
  };
}

/**
 * Computes cosine similarity between two vectors
 * 
 * Measures how similar two activation patterns are.
 * Useful for understanding what the network has learned.
 * 
 * Returns value in [-1, 1]:
 * - 1 = identical direction
 * - 0 = orthogonal
 * - -1 = opposite direction
 * 
 * @param vector1 - First vector
 * @param vector2 - Second vector
 * @returns Cosine similarity
 */
export function cosineSimilarity(
  vector1: number[],
  vector2: number[]
): number {
  if (vector1.length !== vector2.length) {
    throw new Error('Vectors must have same length');
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    norm1 += vector1[i] * vector1[i];
    norm2 += vector2[i] * vector2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }
  
  return dotProduct / (norm1 * norm2);
}

/**
 * Gets the top-k predictions with confidence scores
 * 
 * Returns the k most confident predictions instead of just the top one.
 * Useful for seeing multiple possible answers.
 * 
 * @param weights - Weight matrix
 * @param inputIndex - Input node index
 * @param k - Number of top predictions to return
 * @returns Array of {index, confidence} objects, sorted by confidence
 */
export function recallTopK(
  weights: number[][],
  inputIndex: number,
  k: number = 3
): Array<{ index: number; confidence: number }> {
  const result = recall(weights, inputIndex);
  const outputs = result.allOutputs;
  
  // Create array of {index, value} pairs
  const indexed = outputs.map((value, index) => ({ index, confidence: value }));
  
  // Sort by confidence descending
  indexed.sort((a, b) => b.confidence - a.confidence);
  
  // Return top k
  return indexed.slice(0, Math.min(k, indexed.length));
}
