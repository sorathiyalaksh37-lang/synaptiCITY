/**
 * Hebbian Learning Rule Implementation
 * 
 * "Neurons that fire together, wire together" - Donald Hebb (1949)
 * 
 * This module implements the core Hebbian learning rule:
 * Δw = η × aᵢ × aⱼ
 * 
 * Where:
 * - Δw = change in weight
 * - η = learning rate (eta)
 * - aᵢ = activation of pre-synaptic neuron
 * - aⱼ = activation of post-synaptic neuron
 * 
 * @module hebbian
 */

/**
 * Clamps a value between min and max bounds
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Validates matrix dimensions
 */
function validateMatrix(weights: number[][], expectedSize: number): void {
  if (!Array.isArray(weights)) {
    throw new Error('Weights must be a 2D array');
  }
  if (weights.length !== expectedSize) {
    throw new Error(
      `Weight matrix must have ${expectedSize} rows, got ${weights.length}`
    );
  }
  for (let i = 0; i < weights.length; i++) {
    if (!Array.isArray(weights[i]) || weights[i].length !== expectedSize) {
      throw new Error(
        `Weight matrix row ${i} must have ${expectedSize} columns`
      );
    }
  }
}

/**
 * Validates index bounds
 */
function validateIndex(
  index: number,
  maxIndex: number,
  name: string
): void {
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
 * Applies the Hebbian learning rule to update connection weights
 * 
 * This is a PURE function - it does not modify the input matrix.
 * 
 * The Hebbian Rule:
 * ---------------
 * When two neurons are active simultaneously, their connection strengthens.
 * 
 * Mathematical Formulation:
 * Δw_ij = η × a_i × a_j
 * 
 * Where:
 * - w_ij is the weight from neuron i to neuron j
 * - η (eta) is the learning rate (how fast learning occurs)
 * - a_i is the activation of the pre-synaptic neuron i
 * - a_j is the activation of the post-synaptic neuron j
 * 
 * Implementation Notes:
 * --------------------
 * - Weights are clamped to [-3.0, 3.0] to prevent explosion
 * - Only the specified connection is updated (directed graph)
 * - Returns a new matrix (functional programming style)
 * 
 * @param weights - Current weight matrix (N x N)
 * @param inputIndex - Index of the input (pre-synaptic) neuron
 * @param outputIndex - Index of the output (post-synaptic) neuron
 * @param learningRate - Learning rate η (typically 0.01 to 0.5)
 * @param inputActivation - Activation of input neuron (default: 1.0)
 * @param outputActivation - Activation of output neuron (default: 1.0)
 * @returns New weight matrix with updated connection
 * 
 * @example
 * ```typescript
 * const weights = [[0, 0.1], [0.2, 0]];
 * const newWeights = hebbianUpdate(weights, 0, 1, 0.1);
 * // weights[0][1] increases by 0.1 * 1.0 * 1.0 = 0.1
 * // newWeights = [[0, 0.2], [0.2, 0]]
 * ```
 */
export function hebbianUpdate(
  weights: number[][],
  inputIndex: number,
  outputIndex: number,
  learningRate: number,
  inputActivation: number = 1.0,
  outputActivation: number = 1.0
): number[][] {
  // Input validation
  const n = weights.length;
  validateMatrix(weights, n);
  validateIndex(inputIndex, n, 'inputIndex');
  validateIndex(outputIndex, n, 'outputIndex');
  
  if (learningRate <= 0 || learningRate > 1) {
    throw new Error(
      `Learning rate must be between 0 and 1, got ${learningRate}`
    );
  }
  
  if (inputActivation < 0 || inputActivation > 1) {
    throw new Error(
      `Input activation must be between 0 and 1, got ${inputActivation}`
    );
  }
  
  if (outputActivation < 0 || outputActivation > 1) {
    throw new Error(
      `Output activation must be between 0 and 1, got ${outputActivation}`
    );
  }
  
  // Deep copy the matrix (pure function - no mutation)
  const newWeights = weights.map(row => [...row]);
  
  // Apply Hebbian learning rule: Δw = η × aᵢ × aⱼ
  const currentWeight = newWeights[inputIndex][outputIndex];
  const delta = learningRate * inputActivation * outputActivation;
  const updatedWeight = currentWeight + delta;
  
  // Clamp to prevent weight explosion
  newWeights[inputIndex][outputIndex] = clamp(updatedWeight, -3.0, 3.0);
  
  return newWeights;
}

/**
 * Applies Hebbian updates for multiple repetitions
 * 
 * Simulates teaching an association multiple times in succession.
 * Each repetition strengthens the connection further.
 * 
 * @param weights - Current weight matrix
 * @param inputIndex - Input neuron index
 * @param outputIndex - Output neuron index
 * @param learningRate - Learning rate η
 * @param repetitions - Number of times to apply the update (default: 1)
 * @param inputActivation - Input activation level (default: 1.0)
 * @param outputActivation - Output activation level (default: 1.0)
 * @returns Updated weight matrix
 * 
 * @example
 * ```typescript
 * // Teach DOG → ANIMAL 5 times
 * const newWeights = hebbianUpdateMultiple(
 *   weights,
 *   dogIndex,
 *   animalIndex,
 *   0.1,
 *   5
 * );
 * ```
 */
export function hebbianUpdateMultiple(
  weights: number[][],
  inputIndex: number,
  outputIndex: number,
  learningRate: number,
  repetitions: number = 1,
  inputActivation: number = 1.0,
  outputActivation: number = 1.0
): number[][] {
  if (!Number.isInteger(repetitions) || repetitions < 1) {
    throw new Error(`Repetitions must be a positive integer, got ${repetitions}`);
  }
  
  let currentWeights = weights;
  
  for (let i = 0; i < repetitions; i++) {
    currentWeights = hebbianUpdate(
      currentWeights,
      inputIndex,
      outputIndex,
      learningRate,
      inputActivation,
      outputActivation
    );
  }
  
  return currentWeights;
}

/**
 * Applies Hebbian learning with decay (forgetting)
 * 
 * Combines Hebbian strengthening with weight decay:
 * - Active connections strengthen (Hebbian rule)
 * - All connections gradually weaken (decay)
 * 
 * This creates a more realistic model where:
 * - Unused memories fade over time
 * - Active memories stay strong
 * - Network capacity is effectively increased
 * 
 * @param weights - Current weight matrix
 * @param inputIndex - Input neuron index
 * @param outputIndex - Output neuron index
 * @param learningRate - Learning rate for strengthening
 * @param decayRate - Decay rate for all weights (0-1, typically 0.01-0.05)
 * @param inputActivation - Input activation level (default: 1.0)
 * @param outputActivation - Output activation level (default: 1.0)
 * @returns Updated weight matrix with learning and decay applied
 */
export function hebbianUpdateWithDecay(
  weights: number[][],
  inputIndex: number,
  outputIndex: number,
  learningRate: number,
  decayRate: number,
  inputActivation: number = 1.0,
  outputActivation: number = 1.0
): number[][] {
  if (decayRate < 0 || decayRate > 1) {
    throw new Error(`Decay rate must be between 0 and 1, got ${decayRate}`);
  }
  
  // First apply global decay to all weights
  const decayedWeights = weights.map(row =>
    row.map(weight => weight * (1 - decayRate))
  );
  
  // Then apply Hebbian strengthening to the specific connection
  return hebbianUpdate(
    decayedWeights,
    inputIndex,
    outputIndex,
    learningRate,
    inputActivation,
    outputActivation
  );
}

/**
 * Calculates the weight change (delta) without applying it
 * 
 * Useful for visualization and debugging:
 * - Shows how much a weight would change
 * - Helps understand learning dynamics
 * - Enables "what-if" analysis
 * 
 * @param learningRate - Learning rate η
 * @param inputActivation - Input neuron activation
 * @param outputActivation - Output neuron activation
 * @returns The delta value (Δw)
 * 
 * @example
 * ```typescript
 * const delta = calculateHebbianDelta(0.1, 1.0, 1.0);
 * // delta = 0.1
 * ```
 */
export function calculateHebbianDelta(
  learningRate: number,
  inputActivation: number = 1.0,
  outputActivation: number = 1.0
): number {
  return learningRate * inputActivation * outputActivation;
}

/**
 * Applies anti-Hebbian learning (weakening)
 * 
 * Instead of strengthening active connections, this WEAKENS them.
 * Useful for:
 * - Implementing interference
 * - Forgetting specific associations
 * - Competitive learning
 * 
 * Formula: Δw = -η × aᵢ × aⱼ (note the negative sign)
 * 
 * @param weights - Current weight matrix
 * @param inputIndex - Input neuron index
 * @param outputIndex - Output neuron index
 * @param learningRate - Learning rate (positive value, will be negated)
 * @param inputActivation - Input activation level (default: 1.0)
 * @param outputActivation - Output activation level (default: 1.0)
 * @returns Updated weight matrix with weakened connection
 */
export function antiHebbianUpdate(
  weights: number[][],
  inputIndex: number,
  outputIndex: number,
  learningRate: number,
  inputActivation: number = 1.0,
  outputActivation: number = 1.0
): number[][] {
  // Use negative learning rate for anti-Hebbian learning
  return hebbianUpdate(
    weights,
    inputIndex,
    outputIndex,
    -Math.abs(learningRate), // Ensure negative
    inputActivation,
    outputActivation
  );
}

/**
 * Normalizes a weight matrix
 * 
 * Rescales all weights so they sum to a target value.
 * Prevents unbounded weight growth while maintaining relative strengths.
 * 
 * @param weights - Weight matrix to normalize
 * @param targetSum - Desired sum of all weights (default: same as current)
 * @returns Normalized weight matrix
 */
export function normalizeWeights(
  weights: number[][],
  targetSum?: number
): number[][] {
  const n = weights.length;
  
  // Calculate current sum
  let currentSum = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      currentSum += Math.abs(weights[i][j]);
    }
  }
  
  if (currentSum === 0) {
    return weights.map(row => [...row]); // No normalization needed
  }
  
  const target = targetSum ?? currentSum;
  const scale = target / currentSum;
  
  return weights.map(row =>
    row.map(weight => clamp(weight * scale, -3.0, 3.0))
  );
}

/**
 * Gets the strength of a connection
 * 
 * Wrapper function for clarity in reading code
 * 
 * @param weights - Weight matrix
 * @param fromIndex - Source neuron
 * @param toIndex - Target neuron
 * @returns Weight value (connection strength)
 */
export function getConnectionStrength(
  weights: number[][],
  fromIndex: number,
  toIndex: number
): number {
  const n = weights.length;
  validateIndex(fromIndex, n, 'fromIndex');
  validateIndex(toIndex, n, 'toIndex');
  return weights[fromIndex][toIndex];
}
