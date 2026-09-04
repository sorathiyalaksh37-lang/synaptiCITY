/**
 * Memory Decay Implementation
 * 
 * Simulates forgetting over time through weight decay.
 * 
 * The Science:
 * -----------
 * In biological brains, memories fade without reinforcement.
 * This is called forgetting, and it serves important purposes:
 * - Prevents memory overload
 * - Removes outdated information
 * - Reduces interference
 * - Maintains network capacity
 * 
 * In our model, decay is simulated by multiplying weights by (1 - decayRate).
 * Over time, unused connections weaken and eventually disappear.
 * 
 * @module decay
 */

import type { NetworkState } from './teach';

/**
 * Result of applying decay
 */
export interface DecayResult {
  /** State after decay */
  state: NetworkState;
  
  /** Average weight before decay */
  weightsBefore: number;
  
  /** Average weight after decay */
  weightsAfter: number;
  
  /** Total decay applied */
  totalDecay: number;
  
  /** Number of weights below threshold */
  weakenedWeights: number;
}

/**
 * Applies memory decay to all weights
 * 
 * This is the core forgetting mechanism.
 * 
 * Formula: w_new = w_old × (1 - decayRate)
 * 
 * How It Works:
 * ------------
 * 1. Multiply each weight by (1 - decayRate)
 * 2. Weights gradually approach zero
 * 3. Strong connections persist longer
 * 4. Weak connections disappear quickly
 * 
 * Example:
 * --------
 * If weight = 0.8 and decayRate = 0.1:
 * - After 1 decay: 0.8 × 0.9 = 0.72
 * - After 2 decays: 0.72 × 0.9 = 0.648
 * - After 10 decays: ~0.27
 * 
 * Decay Rates:
 * -----------
 * - Low (0.01): Slow forgetting, memories persist
 * - Medium (0.05): Balanced forgetting
 * - High (0.1+): Rapid forgetting, only strong memories survive
 * 
 * @param state - Current network state
 * @param decayRate - Decay rate (0-1, default: uses state.memoryDecay)
 * @param minThreshold - Don't decay below this value (default: 0.001)
 * @returns Updated state with decay applied
 * 
 * @throws Error if decayRate not in valid range
 * 
 * @example
 * ```typescript
 * let state = createInitialState(6, 0.1, 0.05);
 * state = teach(state, 0, 1, 3);
 * 
 * // Simulate time passing
 * state = applyMemoryDecay(state);
 * // Weights are now weaker
 * ```
 */
export function applyMemoryDecay(
  state: NetworkState,
  decayRate?: number,
  minThreshold: number = 0.001
): NetworkState {
  // Use provided decay rate or state's default
  const rate = decayRate !== undefined ? decayRate : state.memoryDecay;
  
  // Validate decay rate
  if (rate < 0 || rate > 1) {
    throw new Error(`Decay rate must be between 0 and 1, got ${rate}`);
  }
  
  // If no decay, return unchanged
  if (rate === 0) {
    return state;
  }
  
  // Validate threshold
  if (minThreshold < 0 || minThreshold > 1) {
    throw new Error(`Minimum threshold must be between 0 and 1, got ${minThreshold}`);
  }
  
  // Apply decay to all weights
  const newWeights = state.weights.map(row =>
    row.map(weight => {
      const decayed = weight * (1 - rate);
      
      // Don't let weights get too small (avoid underflow)
      if (Math.abs(decayed) < minThreshold) {
        return 0;
      }
      
      return decayed;
    })
  );
  
  return {
    ...state,
    weights: newWeights
  };
}

/**
 * Applies decay with detailed metrics
 * 
 * Same as applyMemoryDecay but returns statistics.
 * 
 * @param state - Current state
 * @param decayRate - Decay rate (optional)
 * @param minThreshold - Minimum threshold
 * @returns DecayResult with state and metrics
 * 
 * @example
 * ```typescript
 * const result = applyMemoryDecayWithMetrics(state, 0.1);
 * console.log(`Avg weight before: ${result.weightsBefore.toFixed(3)}`);
 * console.log(`Avg weight after: ${result.weightsAfter.toFixed(3)}`);
 * console.log(`Total decay: ${result.totalDecay.toFixed(3)}`);
 * ```
 */
export function applyMemoryDecayWithMetrics(
  state: NetworkState,
  decayRate?: number,
  minThreshold: number = 0.001
): DecayResult {
  // Calculate weights before
  const weightsBefore = state.weights
    .flat()
    .reduce((sum, w) => sum + Math.abs(w), 0) / (state.weights.length ** 2);
  
  // Apply decay
  const newState = applyMemoryDecay(state, decayRate, minThreshold);
  
  // Calculate weights after
  const weightsAfter = newState.weights
    .flat()
    .reduce((sum, w) => sum + Math.abs(w), 0) / (newState.weights.length ** 2);
  
  // Count weakened weights
  const weakenedWeights = newState.weights
    .flat()
    .filter(w => Math.abs(w) < 0.01).length;
  
  return {
    state: newState,
    weightsBefore,
    weightsAfter,
    totalDecay: weightsBefore - weightsAfter,
    weakenedWeights
  };
}

/**
 * Applies selective decay
 * 
 * Only decays weak connections, preserving strong ones.
 * Simulates selective forgetting of unimportant memories.
 * 
 * @param state - Current state
 * @param decayRate - Decay rate
 * @param strengthThreshold - Only decay weights below this (default: 0.3)
 * @returns Updated state
 * 
 * @example
 * ```typescript
 * // Only forget weak connections
 * state = applySelectiveDecay(state, 0.1, 0.3);
 * // Strong memories (>0.3) unchanged
 * ```
 */
export function applySelectiveDecay(
  state: NetworkState,
  decayRate: number,
  strengthThreshold: number = 0.3
): NetworkState {
  if (decayRate < 0 || decayRate > 1) {
    throw new Error('Decay rate must be between 0 and 1');
  }
  
  const newWeights = state.weights.map(row =>
    row.map(weight => {
      // Only decay weak connections
      if (Math.abs(weight) < strengthThreshold) {
        return weight * (1 - decayRate);
      }
      return weight;
    })
  );
  
  return {
    ...state,
    weights: newWeights
  };
}

/**
 * Applies exponential decay
 * 
 * Decay rate increases with time, simulating accelerated forgetting.
 * 
 * @param state - Current state
 * @param baseDecayRate - Base decay rate
 * @param timeSteps - Number of time steps passed
 * @param accelerationFactor - How fast decay accelerates (default: 1.1)
 * @returns Updated state
 * 
 * @example
 * ```typescript
 * // Decay accelerates over 10 time steps
 * state = applyExponentialDecay(state, 0.05, 10, 1.1);
 * ```
 */
export function applyExponentialDecay(
  state: NetworkState,
  baseDecayRate: number,
  timeSteps: number,
  accelerationFactor: number = 1.1
): NetworkState {
  let currentState = state;
  
  for (let t = 0; t < timeSteps; t++) {
    const effectiveRate = baseDecayRate * Math.pow(accelerationFactor, t);
    const clampedRate = Math.min(effectiveRate, 0.5); // Don't exceed 50% decay
    
    currentState = applyMemoryDecay(currentState, clampedRate);
  }
  
  return currentState;
}

/**
 * Applies activity-dependent decay
 * 
 * Decay rate depends on when each connection was last used.
 * Unused connections decay faster.
 * 
 * This requires tracking usage, so we use a simplified version:
 * stronger connections = more recent usage = less decay
 * 
 * @param state - Current state
 * @param baseDecayRate - Base decay rate
 * @returns Updated state
 * 
 * @example
 * ```typescript
 * // Weak connections decay faster
 * state = applyActivityDependentDecay(state, 0.05);
 * ```
 */
export function applyActivityDependentDecay(
  state: NetworkState,
  baseDecayRate: number
): NetworkState {
  const newWeights = state.weights.map(row =>
    row.map(weight => {
      // Stronger connections decay slower
      const strength = Math.abs(weight);
      const activityFactor = 1 - strength; // Inverse: weak = more decay
      const effectiveRate = baseDecayRate * (1 + activityFactor);
      
      return weight * (1 - Math.min(effectiveRate, 0.5));
    })
  );
  
  return {
    ...state,
    weights: newWeights
  };
}

/**
 * Simulates time passing with periodic decay
 * 
 * Applies decay at regular intervals, simulating natural forgetting.
 * 
 * @param state - Initial state
 * @param timeSteps - Number of time steps
 * @param decayInterval - Apply decay every N steps (default: 1)
 * @param decayRate - Decay rate per application
 * @returns Final state after time simulation
 * 
 * @example
 * ```typescript
 * // Simulate 100 time steps, decay every 10 steps
 * const future = simulateTimePassing(state, 100, 10, 0.05);
 * ```
 */
export function simulateTimePassing(
  state: NetworkState,
  timeSteps: number,
  decayInterval: number = 1,
  decayRate?: number
): NetworkState {
  let currentState = state;
  
  for (let t = 0; t < timeSteps; t++) {
    if (t % decayInterval === 0) {
      currentState = applyMemoryDecay(currentState, decayRate);
    }
  }
  
  return currentState;
}

/**
 * Gets decay statistics for current state
 * 
 * Analyzes how much decay would affect the network.
 * 
 * @param state - Current state
 * @param decayRate - Rate to analyze (optional)
 * @returns Statistics object
 * 
 * @example
 * ```typescript
 * const stats = getDecayStatistics(state, 0.1);
 * console.log(`${stats.weightsAtRisk} weights would decay`);
 * ```
 */
export function getDecayStatistics(
  state: NetworkState,
  decayRate?: number
): {
  currentAverageWeight: number;
  projectedAverageWeight: number;
  weightsAtRisk: number;
  strongWeights: number;
  decayImpact: number;
} {
  const rate = decayRate !== undefined ? decayRate : state.memoryDecay;
  
  const allWeights = state.weights.flat();
  const currentAvg = allWeights.reduce((sum, w) => sum + Math.abs(w), 0) / allWeights.length;
  const projectedAvg = currentAvg * (1 - rate);
  
  const weightsAtRisk = allWeights.filter(w => {
    const decayed = Math.abs(w) * (1 - rate);
    return decayed < 0.01 && Math.abs(w) >= 0.01;
  }).length;
  
  const strongWeights = allWeights.filter(w => Math.abs(w) > 0.5).length;
  const decayImpact = (weightsAtRisk / allWeights.length) * 100;
  
  return {
    currentAverageWeight: currentAvg,
    projectedAverageWeight: projectedAvg,
    weightsAtRisk,
    strongWeights,
    decayImpact
  };
}

/**
 * Prevents decay for specific connections
 * 
 * "Protects" certain associations from forgetting.
 * Useful for preserving important memories.
 * 
 * @param state - Current state
 * @param protectedConnections - Connections to preserve
 * @param decayRate - Decay rate for unprotected
 * @returns Updated state with selective preservation
 * 
 * @example
 * ```typescript
 * // Protect DOG → ANIMAL from decay
 * state = preventDecayFor(state, [{ input: 0, output: 1 }], 0.1);
 * ```
 */
export function preventDecayFor(
  state: NetworkState,
  protectedConnections: Array<{ input: number; output: number }>,
  decayRate: number
): NetworkState {
  const protected Set = new Set(
    protectedConnections.map(c => `${c.input}-${c.output}`)
  );
  
  const newWeights = state.weights.map((row, i) =>
    row.map((weight, j) => {
      const key = `${i}-${j}`;
      if (protectedSet.has(key)) {
        return weight; // No decay
      }
      return weight * (1 - decayRate);
    })
  );
  
  return {
    ...state,
    weights: newWeights
  };
}
