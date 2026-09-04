/**
 * Teaching Function Implementation
 * 
 * Handles the teaching of associations in the neural network.
 * Coordinates between network state and Hebbian learning.
 * 
 * @module teach
 */

import { hebbianUpdate, hebbianUpdateMultiple } from './hebbian';

/**
 * Network State Interface
 * 
 * Represents the complete state of the neural network including:
 * - Current weights
 * - Activation patterns
 * - Learning parameters
 * - History tracking
 */
export interface NetworkState {
  /** Weight matrix (N × N) */
  weights: number[][];
  
  /** Current activation levels for each node */
  activations: number[];
  
  /** Learning rate parameter η */
  learningRate: number;
  
  /** Total number of teaching repetitions performed */
  repetitions: number;
  
  /** Count of interference events (competing associations) */
  interferenceCount: number;
  
  /** Memory decay rate (0-1) for forgetting */
  memoryDecay: number;
  
  /** History of teaching events */
  history: TeachingEvent[];
}

/**
 * Teaching Event Interface
 * 
 * Records a single teaching event for history tracking
 */
export interface TeachingEvent {
  /** Timestamp of the event */
  timestamp: number;
  
  /** Input node index */
  inputIndex: number;
  
  /** Output node index */
  outputIndex: number;
  
  /** Number of repetitions */
  repetitions: number;
  
  /** Learning rate used */
  learningRate: number;
  
  /** Weight before update */
  weightBefore: number;
  
  /** Weight after update */
  weightAfter: number;
  
  /** Whether this caused interference */
  isInterference: boolean;
}

/**
 * Creates an initial network state
 * 
 * @param numNodes - Number of nodes in the network
 * @param learningRate - Initial learning rate
 * @param memoryDecay - Memory decay rate (default: 0)
 * @returns Initial NetworkState
 */
export function createInitialState(
  numNodes: number,
  learningRate: number = 0.1,
  memoryDecay: number = 0
): NetworkState {
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
 * Validates indices are within bounds
 */
function validateIndices(
  inputIndex: number,
  outputIndex: number,
  numNodes: number
): void {
  if (!Number.isInteger(inputIndex) || !Number.isInteger(outputIndex)) {
    throw new Error('Indices must be integers');
  }
  
  if (inputIndex < 0 || inputIndex >= numNodes) {
    throw new Error(
      `Input index ${inputIndex} out of bounds [0, ${numNodes - 1}]`
    );
  }
  
  if (outputIndex < 0 || outputIndex >= numNodes) {
    throw new Error(
      `Output index ${outputIndex} out of bounds [0, ${numNodes - 1}]`
    );
  }
  
  if (inputIndex === outputIndex) {
    throw new Error('Input and output indices cannot be the same');
  }
}

/**
 * Checks if teaching will cause interference
 * 
 * Interference occurs when:
 * - The input node already has strong connections to other nodes
 * - Teaching a new association would conflict with existing ones
 * 
 * @param state - Current network state
 * @param inputIndex - Input node index
 * @param outputIndex - Output node index
 * @param threshold - Weight threshold to consider "strong" (default: 0.3)
 * @returns True if interference is detected
 */
export function detectInterference(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number,
  threshold: number = 0.3
): boolean {
  const { weights } = state;
  const numNodes = weights.length;
  
  // Check if input node has other strong connections
  for (let j = 0; j < numNodes; j++) {
    if (j === outputIndex) continue;
    
    const weight = weights[inputIndex][j];
    if (Math.abs(weight) > threshold) {
      return true; // Found competing association
    }
  }
  
  return false;
}

/**
 * Teaches an association in the neural network
 * 
 * This function:
 * 1. Validates inputs
 * 2. Detects interference
 * 3. Updates activations
 * 4. Applies Hebbian learning
 * 5. Records history
 * 6. Updates state
 * 
 * The Science:
 * -----------
 * Teaching strengthens the synaptic connection between two nodes.
 * Each repetition adds more strength to the connection.
 * This is how memory forms in the network.
 * 
 * Example:
 * --------
 * Teaching DOG → ANIMAL:
 * - Activates both DOG and ANIMAL nodes
 * - Applies Hebbian rule to strengthen connection
 * - Connection weight increases
 * - Future recall of DOG will activate ANIMAL
 * 
 * @param state - Current network state
 * @param inputIndex - Index of input node
 * @param outputIndex - Index of output node
 * @param repetitions - Number of times to strengthen (default: 1)
 * @returns Updated network state
 * 
 * @example
 * ```typescript
 * let state = createInitialState(6);
 * state = teach(state, 0, 1); // Teach node 0 → node 1
 * // Weight at [0][1] has increased
 * ```
 */
export function teach(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number,
  repetitions: number = 1
): NetworkState {
  const numNodes = state.weights.length;
  
  // Validate inputs
  validateIndices(inputIndex, outputIndex, numNodes);
  
  if (!Number.isInteger(repetitions) || repetitions < 1) {
    throw new Error('Repetitions must be a positive integer');
  }
  
  // Detect interference
  const isInterference = detectInterference(state, inputIndex, outputIndex);
  
  // Record weight before update
  const weightBefore = state.weights[inputIndex][outputIndex];
  
  // Update activations (both input and output are active)
  const newActivations = [...state.activations];
  newActivations[inputIndex] = 1.0;
  newActivations[outputIndex] = 1.0;
  
  // Apply Hebbian learning with repetitions
  const newWeights = hebbianUpdateMultiple(
    state.weights,
    inputIndex,
    outputIndex,
    state.learningRate,
    repetitions
  );
  
  // Record weight after update
  const weightAfter = newWeights[inputIndex][outputIndex];
  
  // Create teaching event
  const event: TeachingEvent = {
    timestamp: Date.now(),
    inputIndex,
    outputIndex,
    repetitions,
    learningRate: state.learningRate,
    weightBefore,
    weightAfter,
    isInterference
  };
  
  // Return updated state
  return {
    ...state,
    weights: newWeights,
    activations: newActivations,
    repetitions: state.repetitions + repetitions,
    interferenceCount: state.interferenceCount + (isInterference ? 1 : 0),
    history: [...state.history, event]
  };
}

/**
 * Teaches multiple associations in sequence
 * 
 * Convenience function for teaching several associations at once
 * 
 * @param state - Initial network state
 * @param associations - Array of {input, output, repetitions} objects
 * @returns Updated network state
 * 
 * @example
 * ```typescript
 * const state = teachMultiple(initialState, [
 *   { input: 0, output: 1, repetitions: 3 }, // DOG → ANIMAL
 *   { input: 2, output: 1, repetitions: 3 }, // CAT → ANIMAL
 * ]);
 * ```
 */
export function teachMultiple(
  state: NetworkState,
  associations: Array<{
    input: number;
    output: number;
    repetitions?: number;
  }>
): NetworkState {
  let currentState = state;
  
  for (const assoc of associations) {
    currentState = teach(
      currentState,
      assoc.input,
      assoc.output,
      assoc.repetitions ?? 1
    );
  }
  
  return currentState;
}

/**
 * Clears all activations
 * 
 * Resets all node activations to 0.
 * Useful between teaching and recall operations.
 * 
 * @param state - Current state
 * @returns State with cleared activations
 */
export function clearActivations(state: NetworkState): NetworkState {
  return {
    ...state,
    activations: new Array(state.activations.length).fill(0)
  };
}

/**
 * Sets learning rate
 * 
 * Updates the learning rate parameter
 * 
 * @param state - Current state
 * @param learningRate - New learning rate
 * @returns State with updated learning rate
 */
export function setLearningRate(
  state: NetworkState,
  learningRate: number
): NetworkState {
  if (learningRate <= 0 || learningRate > 1) {
    throw new Error('Learning rate must be between 0 and 1');
  }
  
  return {
    ...state,
    learningRate
  };
}

/**
 * Resets the network state
 * 
 * Reinitializes weights, clears history, but keeps configuration
 * 
 * @param state - Current state
 * @returns Fresh state with same configuration
 */
export function resetState(state: NetworkState): NetworkState {
  const numNodes = state.weights.length;
  return createInitialState(numNodes, state.learningRate, state.memoryDecay);
}

/**
 * Gets statistics about the current state
 * 
 * Provides useful information for debugging and visualization
 * 
 * @param state - Current state
 * @returns Statistics object
 */
export function getStateStats(state: NetworkState): {
  totalTeachings: number;
  interferenceRate: number;
  averageWeight: number;
  maxWeight: number;
  minWeight: number;
  activeNodes: number;
  historyLength: number;
} {
  const { weights, activations, repetitions, interferenceCount, history } = state;
  
  // Calculate weight statistics
  const allWeights = weights.flat();
  const averageWeight = allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length;
  const maxWeight = Math.max(...allWeights);
  const minWeight = Math.min(...allWeights);
  
  // Count active nodes
  const activeNodes = activations.filter(a => a > 0).length;
  
  // Calculate interference rate
  const interferenceRate = repetitions > 0 ? interferenceCount / repetitions : 0;
  
  return {
    totalTeachings: repetitions,
    interferenceRate,
    averageWeight,
    maxWeight,
    minWeight,
    activeNodes,
    historyLength: history.length
  };
}

/**
 * Exports state to JSON
 * 
 * Creates a JSON-serializable representation of the state
 * 
 * @param state - Current state
 * @returns JSON-serializable object
 */
export function exportState(state: NetworkState): object {
  return JSON.parse(JSON.stringify(state));
}

/**
 * Imports state from JSON
 * 
 * Reconstructs a NetworkState from serialized data
 * 
 * @param json - Serialized state
 * @returns NetworkState object
 */
export function importState(json: any): NetworkState {
  // Validate required fields
  if (!json.weights || !Array.isArray(json.weights)) {
    throw new Error('Invalid state: missing or invalid weights');
  }
  if (!json.activations || !Array.isArray(json.activations)) {
    throw new Error('Invalid state: missing or invalid activations');
  }
  
  return {
    weights: json.weights,
    activations: json.activations,
    learningRate: json.learningRate ?? 0.1,
    repetitions: json.repetitions ?? 0,
    interferenceCount: json.interferenceCount ?? 0,
    memoryDecay: json.memoryDecay ?? 0,
    history: json.history ?? []
  };
}
