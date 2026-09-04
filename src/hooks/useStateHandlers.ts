/**
 * State change handlers for neural network operations
 * 
 * Pure functions that handle all network state transitions
 * with validation, error handling, and history tracking.
 * 
 * @module useStateHandlers
 */

import {
  NetworkState,
  RecallResult,
  TeachOptions,
  RecallOptions,
  DecayOptions,
  HistoryEntry,
} from '../types/network.types';

import {
  teach as teachUtil,
  teachMultiple,
} from '../utils/teach';

import {
  recallFromState,
} from '../utils/recall';

import {
  teachWithInterference,
} from '../utils/interference';

import {
  applyMemoryDecay,
} from '../utils/decay';

import {
  createInitialState,
  cloneState,
  validateState,
} from '../utils/networkState';

/**
 * Validates node index is within bounds
 */
function validateNodeIndex(index: number, numNodes: number, paramName: string): void {
  if (!Number.isInteger(index) || index < 0 || index >= numNodes) {
    throw new Error(
      `${paramName} must be an integer between 0 and ${numNodes - 1}, got ${index}`
    );
  }
}

/**
 * Adds history entry to state
 */
function addHistoryEntry(
  state: NetworkState,
  action: HistoryEntry['action'],
  inputIndex?: number,
  outputIndex?: number,
  metadata?: Record<string, any>
): NetworkState {
  const entry: HistoryEntry = {
    action,
    timestamp: Date.now(),
    ...(inputIndex !== undefined && { inputIndex }),
    ...(outputIndex !== undefined && { outputIndex }),
    ...(metadata && { metadata }),
  };

  return {
    ...state,
    history: [...state.history, entry],
  };
}

/**
 * Handle teaching operation
 * 
 * Strengthens connection between input and output nodes using Hebbian learning.
 * Validates inputs and tracks the operation in history.
 * 
 * @param state - Current network state
 * @param inputIndex - Index of input node
 * @param outputIndex - Index of output node
 * @param options - Teaching options
 * @returns Updated network state
 * 
 * @throws Error if indexes are invalid or out of bounds
 * 
 * @example
 * ```typescript
 * const newState = handleTeach(state, 0, 1); // Teach DOG → ANIMAL
 * const withReps = handleTeach(state, 0, 1, { repetitions: 5 });
 * ```
 */
export function handleTeach(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number,
  options: TeachOptions = {}
): NetworkState {
  // Validate state
  if (!validateState(state)) {
    throw new Error('Invalid network state');
  }

  const numNodes = state.weights.length;

  // Validate indexes
  validateNodeIndex(inputIndex, numNodes, 'inputIndex');
  validateNodeIndex(outputIndex, numNodes, 'outputIndex');

  // Prevent self-connections
  if (inputIndex === outputIndex) {
    throw new Error('Cannot teach a node to associate with itself');
  }

  const {
    repetitions = 1,
    learningRate,
    trackHistory = true,
  } = options;

  // Validate repetitions
  if (repetitions < 1 || !Number.isInteger(repetitions)) {
    throw new Error('Repetitions must be a positive integer');
  }

  // Validate learning rate if provided
  if (learningRate !== undefined) {
    if (learningRate <= 0 || learningRate > 1) {
      throw new Error('Learning rate must be between 0 (exclusive) and 1 (inclusive)');
    }
  }

  // Apply teaching
  let newState: NetworkState;
  
  if (repetitions === 1) {
    newState = teachUtil(state, inputIndex, outputIndex);
  } else {
    newState = teachMultiple(state, inputIndex, outputIndex, repetitions);
  }

  // Override learning rate if provided
  if (learningRate !== undefined) {
    newState = { ...newState, learningRate };
  }

  // Add to history
  if (trackHistory) {
    newState = addHistoryEntry(
      newState,
      'teach',
      inputIndex,
      outputIndex,
      { repetitions, learningRate: learningRate || state.learningRate }
    );
  }

  return newState;
}

/**
 * Handle recall operation
 * 
 * Predicts output node from input node activation.
 * Returns detailed recall result with confidence score.
 * 
 * @param state - Current network state
 * @param inputIndex - Index of input node
 * @param options - Recall options
 * @returns Recall result with prediction and confidence
 * 
 * @throws Error if input index is invalid
 * 
 * @example
 * ```typescript
 * const result = handleRecall(state, 0); // Recall from node 0
 * console.log(result.outputIndex, result.confidence);
 * 
 * const withThreshold = handleRecall(state, 0, { threshold: 0.7 });
 * console.log(withThreshold.success); // true if confidence >= 0.7
 * ```
 */
export function handleRecall(
  state: NetworkState,
  inputIndex: number,
  options: RecallOptions = {}
): RecallResult {
  // Validate state
  if (!validateState(state)) {
    throw new Error('Invalid network state');
  }

  const numNodes = state.weights.length;

  // Validate index
  validateNodeIndex(inputIndex, numNodes, 'inputIndex');

  const { threshold = 0.5 } = options;

  // Validate threshold
  if (threshold < 0 || threshold > 1) {
    throw new Error('Threshold must be between 0 and 1');
  }

  // Perform recall
  const result = recallFromState(state, inputIndex, threshold);

  return result;
}

/**
 * Handle interference operation
 * 
 * Teaches a competing association that interferes with existing memories.
 * This demonstrates catastrophic interference in neural networks.
 * 
 * @param state - Current network state
 * @param inputIndex - Index of input node
 * @param outputIndex - Index of output node (competing with existing)
 * @returns Updated network state with interference applied
 * 
 * @throws Error if indexes are invalid
 * 
 * @example
 * ```typescript
 * let state = handleTeach(state, 0, 1); // DOG → ANIMAL
 * state = handleInterference(state, 0, 2); // DOG → PET (interferes)
 * // Both associations now weakened
 * ```
 */
export function handleInterference(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number
): NetworkState {
  // Validate state
  if (!validateState(state)) {
    throw new Error('Invalid network state');
  }

  const numNodes = state.weights.length;

  // Validate indexes
  validateNodeIndex(inputIndex, numNodes, 'inputIndex');
  validateNodeIndex(outputIndex, numNodes, 'outputIndex');

  // Prevent self-connections
  if (inputIndex === outputIndex) {
    throw new Error('Cannot create interference with self-connection');
  }

  // Apply interference
  let newState = teachWithInterference(state, inputIndex, outputIndex);

  // Add to history
  newState = addHistoryEntry(
    newState,
    'interference',
    inputIndex,
    outputIndex,
    { interferenceCount: newState.interferenceCount }
  );

  return newState;
}

/**
 * Handle network reset operation
 * 
 * Creates a fresh network state with random weights.
 * All learning history is cleared.
 * 
 * @param numNodes - Number of nodes in the network
 * @param learningRate - Initial learning rate (default: 0.1)
 * @param memoryDecay - Initial decay rate (default: 0.01)
 * @returns Fresh network state
 * 
 * @throws Error if numNodes is invalid
 * 
 * @example
 * ```typescript
 * const newState = handleReset(6); // 6-node network
 * const custom = handleReset(10, 0.15, 0.02); // Custom parameters
 * ```
 */
export function handleReset(
  numNodes: number,
  learningRate: number = 0.1,
  memoryDecay: number = 0.01
): NetworkState {
  // Validate numNodes
  if (!Number.isInteger(numNodes) || numNodes < 2) {
    throw new Error('numNodes must be an integer >= 2');
  }

  // Validate learningRate
  if (learningRate <= 0 || learningRate > 1) {
    throw new Error('learningRate must be between 0 (exclusive) and 1 (inclusive)');
  }

  // Validate memoryDecay
  if (memoryDecay < 0 || memoryDecay > 1) {
    throw new Error('memoryDecay must be between 0 and 1');
  }

  // Create fresh state
  let newState = createInitialState(numNodes);
  newState = {
    ...newState,
    learningRate,
    memoryDecay,
  };

  // Add reset to history
  newState = addHistoryEntry(newState, 'reset', undefined, undefined, {
    numNodes,
    learningRate,
    memoryDecay,
  });

  return newState;
}

/**
 * Handle memory decay operation
 * 
 * Simulates forgetting by reducing all connection weights.
 * Models the natural decay of synaptic connections over time.
 * 
 * @param state - Current network state
 * @param options - Decay options
 * @returns Updated network state with decayed weights
 * 
 * @throws Error if decay rate is invalid
 * 
 * @example
 * ```typescript
 * const decayed = handleDecay(state); // Use state's decay rate
 * const custom = handleDecay(state, { rate: 0.05 }); // Custom rate
 * const selective = handleDecay(state, { selective: true, minThreshold: 0.1 });
 * ```
 */
export function handleDecay(
  state: NetworkState,
  options: DecayOptions = {}
): NetworkState {
  // Validate state
  if (!validateState(state)) {
    throw new Error('Invalid network state');
  }

  const {
    rate,
    minThreshold = 0.01,
    selective = false,
  } = options;

  const decayRate = rate !== undefined ? rate : state.memoryDecay;

  // Validate decay rate
  if (decayRate < 0 || decayRate > 1) {
    throw new Error('Decay rate must be between 0 and 1');
  }

  // Validate minThreshold
  if (minThreshold < 0 || minThreshold > 1) {
    throw new Error('minThreshold must be between 0 and 1');
  }

  // Apply decay
  let newState = applyMemoryDecay(state, decayRate);

  // Apply minimum threshold (zero out very small weights)
  const cleanedWeights = newState.weights.map(row =>
    row.map(w => Math.abs(w) < minThreshold ? 0 : w)
  );

  newState = {
    ...newState,
    weights: cleanedWeights,
  };

  // Add to history
  newState = addHistoryEntry(newState, 'decay', undefined, undefined, {
    decayRate,
    minThreshold,
    selective,
  });

  return newState;
}

/**
 * Batch teach multiple associations
 * 
 * Efficiently teaches multiple input-output pairs.
 * Useful for initializing networks with known associations.
 * 
 * @param state - Current network state
 * @param associations - Array of [input, output] pairs
 * @param repetitions - Number of repetitions per association
 * @returns Updated network state
 * 
 * @example
 * ```typescript
 * const associations = [[0, 1], [2, 3], [4, 5]];
 * const trained = handleBatchTeach(state, associations, 3);
 * ```
 */
export function handleBatchTeach(
  state: NetworkState,
  associations: Array<[number, number]>,
  repetitions: number = 1
): NetworkState {
  let currentState = state;

  for (const [inputIndex, outputIndex] of associations) {
    currentState = handleTeach(
      currentState,
      inputIndex,
      outputIndex,
      { repetitions, trackHistory: false }
    );
  }

  // Add single history entry for batch
  currentState = addHistoryEntry(
    currentState,
    'teach',
    undefined,
    undefined,
    { batch: true, associations: associations.length, repetitions }
  );

  return currentState;
}

/**
 * Update network parameters
 * 
 * Safely updates learning rate and decay rate.
 * 
 * @param state - Current network state
 * @param learningRate - New learning rate (optional)
 * @param memoryDecay - New decay rate (optional)
 * @returns Updated network state
 * 
 * @example
 * ```typescript
 * const updated = handleUpdateParameters(state, 0.15, 0.02);
 * const justLR = handleUpdateParameters(state, 0.2);
 * ```
 */
export function handleUpdateParameters(
  state: NetworkState,
  learningRate?: number,
  memoryDecay?: number
): NetworkState {
  const newState = { ...state };

  if (learningRate !== undefined) {
    if (learningRate <= 0 || learningRate > 1) {
      throw new Error('learningRate must be between 0 (exclusive) and 1 (inclusive)');
    }
    newState.learningRate = learningRate;
  }

  if (memoryDecay !== undefined) {
    if (memoryDecay < 0 || memoryDecay > 1) {
      throw new Error('memoryDecay must be between 0 and 1');
    }
    newState.memoryDecay = memoryDecay;
  }

  return newState;
}

/**
 * Get state snapshot without modifying state
 * 
 * Creates a deep clone of the state for inspection.
 * 
 * @param state - Network state to clone
 * @returns Cloned state
 */
export function handleGetSnapshot(state: NetworkState): NetworkState {
  return cloneState(state);
}
