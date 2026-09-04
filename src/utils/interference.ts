/**
 * Interference Logic Implementation
 * 
 * Handles interference between competing associations.
 * 
 * The Problem:
 * -----------
 * When you teach two associations with the same input but different outputs
 * (e.g., DOG → ANIMAL, then DOG → PET), they compete for the same connection.
 * This causes interference—both associations weaken.
 * 
 * This is a fundamental limitation of neural memory systems and demonstrates
 * why sophisticated architectures like BDH-CQ are needed for real applications.
 * 
 * @module interference
 */

import { teach, type NetworkState } from './teach';
import { recallFromState } from './recall';
import { hebbianUpdate } from './hebbian';

/**
 * Result of interference analysis
 */
export interface InterferenceResult {
  /** Whether interference was detected */
  hasInterference: boolean;
  
  /** Competing connections found */
  competingConnections: Array<{
    input: number;
    output: number;
    strength: number;
  }>;
  
  /** Strength of new association */
  newAssociationStrength: number;
  
  /** Maximum competing strength */
  maxCompetingStrength: number;
  
  /** Number of competing associations */
  competitionCount: number;
}

/**
 * Detects interference for a potential new association
 * 
 * Analyzes whether teaching input → output would interfere
 * with existing associations.
 * 
 * Interference occurs when:
 * - The input node already has strong connections to other outputs
 * - Teaching the new association would compete with existing ones
 * 
 * @param state - Current network state
 * @param inputIndex - Input node index
 * @param outputIndex - Output node index  
 * @param threshold - Strength threshold to consider "competing" (default: 0.2)
 * @returns InterferenceResult with analysis
 * 
 * @example
 * ```typescript
 * // After teaching DOG → ANIMAL
 * const analysis = detectInterferenceDetailed(state, 0, 2);
 * if (analysis.hasInterference) {
 *   console.log(`Warning: ${analysis.competitionCount} competing associations`);
 * }
 * ```
 */
export function detectInterferenceDetailed(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number,
  threshold: number = 0.2
): InterferenceResult {
  const { weights } = state;
  const numNodes = weights.length;
  
  // Validate indices
  if (inputIndex < 0 || inputIndex >= numNodes) {
    throw new Error(`Input index ${inputIndex} out of bounds`);
  }
  if (outputIndex < 0 || outputIndex >= numNodes) {
    throw new Error(`Output index ${outputIndex} out of bounds`);
  }
  
  const competingConnections: Array<{
    input: number;
    output: number;
    strength: number;
  }> = [];
  
  // Check all connections from the input node
  for (let j = 0; j < numNodes; j++) {
    if (j === outputIndex) continue; // Skip the target output
    
    const strength = weights[inputIndex][j];
    if (Math.abs(strength) > threshold) {
      competingConnections.push({
        input: inputIndex,
        output: j,
        strength
      });
    }
  }
  
  const newAssociationStrength = weights[inputIndex][outputIndex];
  const maxCompetingStrength = competingConnections.length > 0
    ? Math.max(...competingConnections.map(c => Math.abs(c.strength)))
    : 0;
  
  return {
    hasInterference: competingConnections.length > 0,
    competingConnections,
    newAssociationStrength,
    maxCompetingStrength,
    competitionCount: competingConnections.length
  };
}

/**
 * Teaches an association with interference handling
 * 
 * This function:
 * 1. Detects if interference will occur
 * 2. Teaches the new association
 * 3. Applies additional decay to competing connections
 * 4. Tracks interference count
 * 
 * The Science:
 * -----------
 * When associations compete, the network must "choose" which to strengthen.
 * The most recent teaching wins, but both associations weaken over time.
 * This models real neural interference in biological brains.
 * 
 * @param state - Current network state
 * @param inputIndex - Input node index
 * @param outputIndex - Output node index
 * @param repetitions - Number of repetitions (default: 1)
 * @param interferenceDecay - Additional decay for competing (default: 0.1)
 * @returns Updated state with interference applied
 * 
 * @example
 * ```typescript
 * let state = createInitialState(6, 0.1);
 * 
 * // Teach DOG → ANIMAL
 * state = teach(state, 0, 1, 5);
 * 
 * // Teach competing: DOG → PET (causes interference)
 * state = teachWithInterference(state, 0, 2, 5);
 * 
 * // Both associations are now weaker
 * ```
 */
export function teachWithInterference(
  state: NetworkState,
  inputIndex: number,
  outputIndex: number,
  repetitions: number = 1,
  interferenceDecay: number = 0.1
): NetworkState {
  // Detect interference before teaching
  const interferenceAnalysis = detectInterferenceDetailed(
    state,
    inputIndex,
    outputIndex,
    0.2
  );
  
  // Teach the new association normally
  let newState = teach(state, inputIndex, outputIndex, repetitions);
  
  // If interference detected, apply additional decay to competing connections
  if (interferenceAnalysis.hasInterference) {
    let { weights } = newState;
    
    for (const competing of interferenceAnalysis.competingConnections) {
      // Reduce competing connection strength
      const currentStrength = weights[competing.input][competing.output];
      const decayedStrength = currentStrength * (1 - interferenceDecay);
      
      // Create new weights array with decay applied
      weights = weights.map((row, i) => 
        i === competing.input
          ? row.map((w, j) => 
              j === competing.output ? decayedStrength : w
            )
          : [...row]
      );
    }
    
    newState = {
      ...newState,
      weights,
      interferenceCount: newState.interferenceCount + 1
    };
  }
  
  return newState;
}

/**
 * Measures interference effect on existing associations
 * 
 * Tests how much interference has affected previously learned associations.
 * 
 * @param originalState - State before interference
 * @param currentState - State after interference
 * @param associations - Associations to test
 * @returns Interference metrics
 * 
 * @example
 * ```typescript
 * const effect = measureInterferenceEffect(
 *   stateBefore,
 *   stateAfter,
 *   [{ input: 0, output: 1 }]
 * );
 * console.log(`Strength decreased by ${effect.averageStrengthLoss.toFixed(2)}`);
 * ```
 */
export function measureInterferenceEffect(
  originalState: NetworkState,
  currentState: NetworkState,
  associations: Array<{ input: number; output: number }>
): {
  averageStrengthLoss: number;
  maxStrengthLoss: number;
  affectedAssociations: number;
  details: Array<{
    input: number;
    output: number;
    originalStrength: number;
    currentStrength: number;
    loss: number;
  }>;
} {
  const details = associations.map(assoc => {
    const originalStrength = originalState.weights[assoc.input][assoc.output];
    const currentStrength = currentState.weights[assoc.input][assoc.output];
    const loss = originalStrength - currentStrength;
    
    return {
      input: assoc.input,
      output: assoc.output,
      originalStrength,
      currentStrength,
      loss
    };
  });
  
  const losses = details.map(d => d.loss);
  const averageStrengthLoss = losses.reduce((sum, l) => sum + l, 0) / losses.length;
  const maxStrengthLoss = Math.max(...losses);
  const affectedAssociations = details.filter(d => d.loss > 0.01).length;
  
  return {
    averageStrengthLoss,
    maxStrengthLoss,
    affectedAssociations,
    details
  };
}

/**
 * Simulates catastrophic interference
 * 
 * Demonstrates what happens when many competing associations
 * are taught to the same input node.
 * 
 * This is an educational function showing the limitations of
 * simple Hebbian learning.
 * 
 * @param state - Initial state
 * @param inputIndex - Input node to overload
 * @param outputIndices - Multiple competing outputs
 * @param repetitionsEach - Repetitions for each association
 * @returns Final state showing catastrophic interference
 * 
 * @example
 * ```typescript
 * // Teach DOG → ANIMAL, DOG → PET, DOG → MAMMAL all at once
 * const catastrophic = simulateCatastrophicInterference(
 *   state,
 *   0,           // DOG
 *   [1, 2, 3],   // ANIMAL, PET, MAMMAL
 *   3
 * );
 * 
 * // Network is now confused - none work well
 * ```
 */
export function simulateCatastrophicInterference(
  state: NetworkState,
  inputIndex: number,
  outputIndices: number[],
  repetitionsEach: number = 3
): NetworkState {
  let currentState = state;
  
  for (const outputIndex of outputIndices) {
    currentState = teachWithInterference(
      currentState,
      inputIndex,
      outputIndex,
      repetitionsEach,
      0.15 // Higher decay for dramatic effect
    );
  }
  
  return currentState;
}

/**
 * Applies interference decay to all competing connections
 * 
 * General decay applied proportionally based on competition strength.
 * 
 * @param state - Current state
 * @param decayFactor - Decay factor (0-1)
 * @returns State with interference decay applied
 */
export function applyInterferenceDecay(
  state: NetworkState,
  decayFactor: number = 0.05
): NetworkState {
  if (decayFactor < 0 || decayFactor > 1) {
    throw new Error('Decay factor must be between 0 and 1');
  }
  
  const { weights } = state;
  const numNodes = weights.length;
  
  // For each node, find if it has multiple strong outputs
  const newWeights = weights.map((row, i) => {
    // Count strong connections from this input
    const strongConnections = row.filter(w => Math.abs(w) > 0.2).length;
    
    if (strongConnections <= 1) {
      return [...row]; // No competition, no decay
    }
    
    // Apply decay proportional to competition level
    const competitionDecay = decayFactor * (strongConnections - 1);
    return row.map(w => w * (1 - competitionDecay));
  });
  
  return {
    ...state,
    weights: newWeights
  };
}

/**
 * Gets interference statistics for the network
 * 
 * Analyzes overall interference patterns across the network.
 * 
 * @param state - Current network state
 * @param threshold - Threshold for "strong" connection
 * @returns Statistics object
 */
export function getInterferenceStatistics(
  state: NetworkState,
  threshold: number = 0.2
): {
  totalInterferenceCount: number;
  averageCompetingConnectionsPerNode: number;
  mostConflictedNode: number;
  maxCompetitionsOnSingleNode: number;
  overloadedNodes: number[];
} {
  const { weights, interferenceCount } = state;
  const numNodes = weights.length;
  
  const competitionCounts: number[] = [];
  
  for (let i = 0; i < numNodes; i++) {
    const strongConnections = weights[i].filter(
      w => Math.abs(w) > threshold
    ).length;
    competitionCounts.push(Math.max(0, strongConnections - 1));
  }
  
  const maxCompetitions = Math.max(...competitionCounts);
  const mostConflictedNode = competitionCounts.indexOf(maxCompetitions);
  const averageCompeting = competitionCounts.reduce((a, b) => a + b, 0) / numNodes;
  const overloadedNodes = competitionCounts
    .map((count, index) => ({ count, index }))
    .filter(item => item.count > 1)
    .map(item => item.index);
  
  return {
    totalInterferenceCount: interferenceCount,
    averageCompetingConnectionsPerNode: averageCompeting,
    mostConflictedNode,
    maxCompetitionsOnSingleNode: maxCompetitions,
    overloadedNodes
  };
}

/**
 * Resolves interference by strengthening the strongest association
 * 
 * When multiple associations compete, this function identifies
 * the strongest and suppresses the others.
 * 
 * This is a simple resolution strategy (winner-take-all).
 * Real systems use more sophisticated approaches.
 * 
 * @param state - Current state with interference
 * @param inputIndex - Input node to resolve
 * @param suppressionFactor - How much to suppress losers (default: 0.5)
 * @returns State with interference resolved
 */
export function resolveInterference(
  state: NetworkState,
  inputIndex: number,
  suppressionFactor: number = 0.5
): NetworkState {
  const { weights } = state;
  const numNodes = weights.length;
  
  if (inputIndex < 0 || inputIndex >= numNodes) {
    throw new Error(`Input index ${inputIndex} out of bounds`);
  }
  
  // Find strongest connection from this input
  let maxStrength = -Infinity;
  let winnerIndex = -1;
  
  for (let j = 0; j < numNodes; j++) {
    if (weights[inputIndex][j] > maxStrength) {
      maxStrength = weights[inputIndex][j];
      winnerIndex = j;
    }
  }
  
  if (winnerIndex === -1) {
    return state; // No connections to resolve
  }
  
  // Suppress all other connections
  const newWeights = weights.map((row, i) => {
    if (i !== inputIndex) return [...row];
    
    return row.map((w, j) => {
      if (j === winnerIndex) return w; // Keep winner
      return w * suppressionFactor;   // Suppress others
    });
  });
  
  return {
    ...state,
    weights: newWeights
  };
}
