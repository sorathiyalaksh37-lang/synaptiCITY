/**
 * Network State Management
 * 
 * Complete state management system for the neural network.
 * Handles creation, validation, cloning, and snapshotting of network state.
 * 
 * @module networkState
 */

import type { NetworkState, TeachingEvent } from './teach';

/**
 * Creates an initial network state with random weights
 * 
 * This is the starting point for any neural network simulation.
 * Weights are initialized randomly to break symmetry and enable learning.
 * 
 * @param numNodes - Number of nodes in the network (must be ≥ 2)
 * @param learningRate - Learning rate parameter η (default: 0.1)
 * @param memoryDecay - Memory decay rate (default: 0.0)
 * @returns Fresh NetworkState ready for use
 * 
 * @throws Error if numNodes < 2
 * @throws Error if learningRate not in valid range
 * 
 * @example
 * ```typescript
 * const state = createInitialState(6, 0.1, 0.01);
 * // Ready to teach associations
 * ```
 */
export function createInitialState(
  numNodes: number,
  learningRate: number = 0.1,
  memoryDecay: number = 0.0
): NetworkState {
  if (numNodes < 2) {
    throw new Error('Network must have at least 2 nodes');
  }
  
  if (learningRate <= 0 || learningRate > 1) {
    throw new Error('Learning rate must be between 0 and 1');
  }
  
  if (memoryDecay < 0 || memoryDecay > 1) {
    throw new Error('Memory decay must be between 0 and 1');
  }
  
  // Initialize random weights between -0.5 and 0.5
  const weights: number[][] = [];
  for (let i = 0; i < numNodes; i++) {
    const row: number[] = [];
    for (let j = 0; j < numNodes; j++) {
      row.push((Math.random() - 0.5));
    }
    weights.push(row);
  }
  
  return {
    weights,
    activations: new Array(numNodes).fill(0),
    learningRate,
    repetitions: 0,
    interferenceCount: 0,
    memoryDecay,
    history: []
  };
}

/**
 * Creates a deep clone of network state
 * 
 * Returns a complete copy with no shared references.
 * Safe to modify without affecting the original.
 * 
 * Why Deep Copy?
 * -------------
 * - Preserves immutability
 * - Enables undo/redo
 * - Allows state comparisons
 * - Prevents accidental mutations
 * 
 * @param state - State to clone
 * @returns Deep copy of the state
 * 
 * @example
 * ```typescript
 * const backup = cloneState(currentState);
 * // Modify currentState without affecting backup
 * ```
 */
export function cloneState(state: NetworkState): NetworkState {
  return {
    weights: state.weights.map(row => [...row]),
    activations: [...state.activations],
    learningRate: state.learningRate,
    repetitions: state.repetitions,
    interferenceCount: state.interferenceCount,
    memoryDecay: state.memoryDecay,
    history: state.history.map(event => ({ ...event }))
  };
}

/**
 * Validates network state structure and values
 * 
 * Checks for:
 * - Correct data types
 * - Valid dimensions
 * - Value ranges
 * - Consistency
 * 
 * @param state - State to validate
 * @returns true if valid, false otherwise
 * 
 * @example
 * ```typescript
 * if (validateState(state)) {
 *   console.log('State is valid');
 * } else {
 *   console.error('State is corrupted');
 * }
 * ```
 */
export function validateState(state: NetworkState): boolean {
  try {
    // Check required properties exist
    if (!state.weights || !state.activations) {
      return false;
    }
    
    // Check weights is 2D array
    if (!Array.isArray(state.weights)) {
      return false;
    }
    
    const numNodes = state.weights.length;
    
    // Check weights matrix is square
    for (let i = 0; i < numNodes; i++) {
      if (!Array.isArray(state.weights[i]) || state.weights[i].length !== numNodes) {
        return false;
      }
    }
    
    // Check activations length matches
    if (state.activations.length !== numNodes) {
      return false;
    }
    
    // Check learning rate range
    if (typeof state.learningRate !== 'number' ||
        state.learningRate <= 0 ||
        state.learningRate > 1) {
      return false;
    }
    
    // Check activations are between 0 and 1
    for (const activation of state.activations) {
      if (typeof activation !== 'number' ||
          activation < 0 ||
          activation > 1) {
        return false;
      }
    }
    
    // Check counters are non-negative integers
    if (!Number.isInteger(state.repetitions) || state.repetitions < 0) {
      return false;
    }
    
    if (!Number.isInteger(state.interferenceCount) || state.interferenceCount < 0) {
      return false;
    }
    
    // Check memory decay range
    if (typeof state.memoryDecay !== 'number' ||
        state.memoryDecay < 0 ||
        state.memoryDecay > 1) {
      return false;
    }
    
    // Check history is array
    if (!Array.isArray(state.history)) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets a snapshot of current state for debugging
 * 
 * Returns a JSON-serializable object with summary statistics.
 * Useful for logging, debugging, and monitoring.
 * 
 * @param state - State to snapshot
 * @returns Object with state summary
 * 
 * @example
 * ```typescript
 * const snapshot = getStateSnapshot(state);
 * console.log(JSON.stringify(snapshot, null, 2));
 * ```
 */
export function getStateSnapshot(state: NetworkState): {
  numNodes: number;
  learningRate: number;
  repetitions: number;
  interferenceCount: number;
  memoryDecay: number;
  historyLength: number;
  weightStats: {
    min: number;
    max: number;
    mean: number;
    nonZeroCount: number;
  };
  activeNodes: number;
  timestamp: number;
} {
  const numNodes = state.weights.length;
  
  // Calculate weight statistics
  const allWeights = state.weights.flat();
  const min = Math.min(...allWeights);
  const max = Math.max(...allWeights);
  const mean = allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length;
  const nonZeroCount = allWeights.filter(w => Math.abs(w) > 0.01).length;
  
  // Count active nodes
  const activeNodes = state.activations.filter(a => a > 0).length;
  
  return {
    numNodes,
    learningRate: state.learningRate,
    repetitions: state.repetitions,
    interferenceCount: state.interferenceCount,
    memoryDecay: state.memoryDecay,
    historyLength: state.history.length,
    weightStats: {
      min,
      max,
      mean,
      nonZeroCount
    },
    activeNodes,
    timestamp: Date.now()
  };
}

/**
 * Serializes state to JSON string
 * 
 * Converts state to a JSON string for storage or transmission.
 * 
 * @param state - State to serialize
 * @returns JSON string
 * 
 * @example
 * ```typescript
 * const json = serializeState(state);
 * localStorage.setItem('networkState', json);
 * ```
 */
export function serializeState(state: NetworkState): string {
  return JSON.stringify(state);
}

/**
 * Deserializes state from JSON string
 * 
 * Reconstructs a NetworkState from JSON.
 * Validates the structure after parsing.
 * 
 * @param json - JSON string
 * @returns Reconstructed NetworkState
 * @throws Error if JSON is invalid or state is malformed
 * 
 * @example
 * ```typescript
 * const json = localStorage.getItem('networkState');
 * const state = deserializeState(json);
 * ```
 */
export function deserializeState(json: string): NetworkState {
  try {
    const state = JSON.parse(json) as NetworkState;
    
    if (!validateState(state)) {
      throw new Error('Invalid state structure');
    }
    
    return state;
  } catch (error) {
    throw new Error(`Failed to deserialize state: ${error}`);
  }
}

/**
 * Compares two states for equality
 * 
 * Deep comparison of all state properties.
 * 
 * @param state1 - First state
 * @param state2 - Second state
 * @param tolerance - Tolerance for floating point comparison (default: 1e-6)
 * @returns true if states are equal
 * 
 * @example
 * ```typescript
 * if (compareStates(state1, state2)) {
 *   console.log('States are identical');
 * }
 * ```
 */
export function compareStates(
  state1: NetworkState,
  state2: NetworkState,
  tolerance: number = 1e-6
): boolean {
  // Check dimensions
  if (state1.weights.length !== state2.weights.length) {
    return false;
  }
  
  // Compare weights
  for (let i = 0; i < state1.weights.length; i++) {
    for (let j = 0; j < state1.weights[i].length; j++) {
      if (Math.abs(state1.weights[i][j] - state2.weights[i][j]) > tolerance) {
        return false;
      }
    }
  }
  
  // Compare activations
  for (let i = 0; i < state1.activations.length; i++) {
    if (Math.abs(state1.activations[i] - state2.activations[i]) > tolerance) {
      return false;
    }
  }
  
  // Compare scalars
  if (Math.abs(state1.learningRate - state2.learningRate) > tolerance) {
    return false;
  }
  
  if (state1.repetitions !== state2.repetitions) {
    return false;
  }
  
  if (state1.interferenceCount !== state2.interferenceCount) {
    return false;
  }
  
  if (Math.abs(state1.memoryDecay - state2.memoryDecay) > tolerance) {
    return false;
  }
  
  return true;
}

/**
 * Merges two states (for advanced scenarios)
 * 
 * Combines weights and histories from two states.
 * Useful for ensemble learning or state fusion.
 * 
 * @param state1 - First state
 * @param state2 - Second state
 * @param weight1 - Weight for first state (default: 0.5)
 * @returns Merged state
 * 
 * @example
 * ```typescript
 * const merged = mergeStates(stateA, stateB, 0.7);
 * // 70% from stateA, 30% from stateB
 * ```
 */
export function mergeStates(
  state1: NetworkState,
  state2: NetworkState,
  weight1: number = 0.5
): NetworkState {
  if (state1.weights.length !== state2.weights.length) {
    throw new Error('Cannot merge states with different dimensions');
  }
  
  const weight2 = 1 - weight1;
  const numNodes = state1.weights.length;
  
  // Merge weights
  const mergedWeights: number[][] = [];
  for (let i = 0; i < numNodes; i++) {
    const row: number[] = [];
    for (let j = 0; j < numNodes; j++) {
      row.push(
        state1.weights[i][j] * weight1 + state2.weights[i][j] * weight2
      );
    }
    mergedWeights.push(row);
  }
  
  // Merge activations
  const mergedActivations = state1.activations.map((a, i) =>
    a * weight1 + state2.activations[i] * weight2
  );
  
  return {
    weights: mergedWeights,
    activations: mergedActivations,
    learningRate: state1.learningRate * weight1 + state2.learningRate * weight2,
    repetitions: state1.repetitions + state2.repetitions,
    interferenceCount: state1.interferenceCount + state2.interferenceCount,
    memoryDecay: state1.memoryDecay * weight1 + state2.memoryDecay * weight2,
    history: [...state1.history, ...state2.history]
  };
}

/**
 * Resets state to initial random weights
 * 
 * Clears all learning while preserving configuration.
 * 
 * @param state - State to reset
 * @returns Fresh state with same configuration
 * 
 * @example
 * ```typescript
 * const fresh = resetToInitial(state);
 * // All weights randomized, history cleared
 * ```
 */
export function resetToInitial(state: NetworkState): NetworkState {
  const numNodes = state.weights.length;
  return createInitialState(
    numNodes,
    state.learningRate,
    state.memoryDecay
  );
}

/**
 * Gets difference between two states
 * 
 * Calculates how much the states differ.
 * Useful for tracking learning progress.
 * 
 * @param state1 - First state
 * @param state2 - Second state
 * @returns Difference metrics
 * 
 * @example
 * ```typescript
 * const diff = getStateDifference(before, after);
 * console.log(`Average weight change: ${diff.avgWeightChange}`);
 * ```
 */
export function getStateDifference(
  state1: NetworkState,
  state2: NetworkState
): {
  avgWeightChange: number;
  maxWeightChange: number;
  totalWeightChange: number;
  changedWeights: number;
} {
  if (state1.weights.length !== state2.weights.length) {
    throw new Error('States must have same dimensions');
  }
  
  let totalChange = 0;
  let maxChange = 0;
  let changedCount = 0;
  const threshold = 0.001;
  
  for (let i = 0; i < state1.weights.length; i++) {
    for (let j = 0; j < state1.weights[i].length; j++) {
      const change = Math.abs(state1.weights[i][j] - state2.weights[i][j]);
      totalChange += change;
      maxChange = Math.max(maxChange, change);
      
      if (change > threshold) {
        changedCount++;
      }
    }
  }
  
  const totalWeights = state1.weights.length * state1.weights.length;
  const avgChange = totalChange / totalWeights;
  
  return {
    avgWeightChange: avgChange,
    maxWeightChange: maxChange,
    totalWeightChange: totalChange,
    changedWeights: changedCount
  };
}
