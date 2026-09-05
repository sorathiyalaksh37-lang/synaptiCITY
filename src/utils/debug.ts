/**
 * Debug utilities for network visualization and monitoring
 * 
 * Provides comprehensive debug data extraction including statistics,
 * connection analysis, and performance metrics.
 * 
 * @module debug
 */

import type { NetworkState, DebugData, ConnectionInfo } from '../types/network.types';

/**
 * Calculates standard deviation of an array of numbers
 */
function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squareDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(variance);
}

/**
 * Finds the strongest (maximum weight) connection in the network
 */
function findStrongestConnection(weights: number[][]): ConnectionInfo {
  let maxWeight = -Infinity;
  let maxFrom = 0;
  let maxTo = 0;

  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights[i].length; j++) {
      if (weights[i][j] > maxWeight) {
        maxWeight = weights[i][j];
        maxFrom = i;
        maxTo = j;
      }
    }
  }

  return {
    from: maxFrom,
    to: maxTo,
    value: maxWeight,
  };
}

/**
 * Finds the weakest (minimum weight) connection in the network
 * Note: Looks for the most negative weight, not smallest absolute value
 */
function findWeakestConnection(weights: number[][]): ConnectionInfo {
  let minWeight = Infinity;
  let minFrom = 0;
  let minTo = 0;

  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights[i].length; j++) {
      if (weights[i][j] < minWeight) {
        minWeight = weights[i][j];
        minFrom = i;
        minTo = j;
      }
    }
  }

  return {
    from: minFrom,
    to: minTo,
    value: minWeight,
  };
}

/**
 * Calculates average weight value across all connections
 */
function calculateAverageWeight(weights: number[][]): number {
  let sum = 0;
  let count = 0;

  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights[i].length; j++) {
      sum += weights[i][j];
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

/**
 * Estimates network accuracy based on connection strengths
 * 
 * Uses heuristic: stronger average connections = higher accuracy
 * Real accuracy requires testing against known associations
 */
function estimateAccuracy(state: NetworkState): number {
  const weights = state.weights;
  const numNodes = weights.length;
  
  // Count positive (learned) connections
  let positiveConnections = 0;
  let totalConnections = 0;

  for (let i = 0; i < numNodes; i++) {
    for (let j = 0; j < numNodes; j++) {
      if (i !== j) { // Exclude self-connections
        totalConnections++;
        if (weights[i][j] > 0.1) { // Threshold for "learned"
          positiveConnections++;
        }
      }
    }
  }

  // Base accuracy on ratio of learned connections
  const baseAccuracy = totalConnections > 0
    ? positiveConnections / totalConnections
    : 0;

  // Adjust for repetitions (more repetitions = more confident)
  const repetitionFactor = Math.min(state.repetitions / 10, 1);

  // Adjust for interference (more interference = lower accuracy)
  const interferencePenalty = Math.max(0, 1 - (state.interferenceCount * 0.1));

  // Combined accuracy estimate
  const accuracy = baseAccuracy * (0.5 + repetitionFactor * 0.5) * interferencePenalty;

  return Math.min(Math.max(accuracy, 0), 1); // Clamp to [0, 1]
}

/**
 * Counts total number of weight updates from history
 */
function countTotalUpdates(state: NetworkState): number {
  return state.history.filter(
    entry => entry.action === 'teach' || entry.action === 'interference'
  ).length;
}

/**
 * Get comprehensive debug data for network visualization
 * 
 * Extracts all relevant information for debugging and monitoring,
 * including statistics, connection analysis, and performance metrics.
 * 
 * @param state - Current network state
 * @returns Complete debug data object
 * 
 * @example
 * ```typescript
 * const debugData = getDebugData(state);
 * console.log('Strongest:', debugData.strongestConnection);
 * console.log('Average weight:', debugData.averageWeight);
 * console.log('Accuracy:', debugData.accuracy);
 * ```
 */
export function getDebugData(state: NetworkState): DebugData {
  const weights = state.weights;
  const numNodes = weights.length;

  // Flatten weights for statistics
  const allWeights: number[] = [];
  for (let i = 0; i < numNodes; i++) {
    for (let j = 0; j < numNodes; j++) {
      allWeights.push(weights[i][j]);
    }
  }

  // Calculate statistics
  const averageWeight = calculateAverageWeight(weights);
  const weightStdDev = calculateStdDev(allWeights);
  const strongestConnection = findStrongestConnection(weights);
  const weakestConnection = findWeakestConnection(weights);
  const totalUpdates = countTotalUpdates(state);
  const accuracy = estimateAccuracy(state);

  return {
    weights: weights.map(row => [...row]), // Deep copy
    activations: [...state.activations],
    learningRate: state.learningRate,
    repetitions: state.repetitions,
    interferenceCount: state.interferenceCount,
    memoryDecay: state.memoryDecay,
    totalUpdates,
    strongestConnection,
    weakestConnection,
    accuracy,
    historyLength: state.history.length,
    timestamp: state.timestamp,
    averageWeight,
    weightStdDev,
  };
}

/**
 * Get formatted debug summary as string
 * 
 * Returns human-readable debug information.
 * 
 * @param state - Network state
 * @returns Formatted debug string
 * 
 * @example
 * ```typescript
 * const summary = getDebugSummary(state);
 * console.log(summary);
 * // Output:
 * // Network Debug Summary
 * // Nodes: 6
 * // Learning Rate: 0.1
 * // ...
 * ```
 */
export function getDebugSummary(state: NetworkState): string {
  const debug = getDebugData(state);
  
  return `
Network Debug Summary
=====================
Nodes: ${state.weights.length}
Learning Rate: ${debug.learningRate.toFixed(3)}
Memory Decay: ${debug.memoryDecay.toFixed(3)}
Repetitions: ${debug.repetitions}
Interference Events: ${debug.interferenceCount}
Total Updates: ${debug.totalUpdates}

Weight Statistics
-----------------
Average: ${debug.averageWeight.toFixed(4)}
Std Dev: ${debug.weightStdDev.toFixed(4)}
Strongest: ${debug.strongestConnection.from} → ${debug.strongestConnection.to} (${debug.strongestConnection.value.toFixed(4)})
Weakest: ${debug.weakestConnection.from} → ${debug.weakestConnection.to} (${debug.weakestConnection.value.toFixed(4)})

Performance
-----------
Estimated Accuracy: ${(debug.accuracy * 100).toFixed(1)}%
History Length: ${debug.historyLength}
Last Update: ${new Date(debug.timestamp).toLocaleString()}
  `.trim();
}

/**
 * Get connection matrix in formatted string
 * 
 * Returns weight matrix as formatted table string.
 * 
 * @param state - Network state
 * @param precision - Decimal precision (default: 2)
 * @returns Formatted matrix string
 * 
 * @example
 * ```typescript
 * const matrix = getConnectionMatrix(state, 3);
 * console.log(matrix);
 * //      0      1      2
 * // 0  0.000  0.150  0.000
 * // 1  0.000  0.000  0.200
 * // 2  0.100  0.000  0.000
 * ```
 */
export function getConnectionMatrix(
  state: NetworkState,
  precision: number = 2
): string {
  const weights = state.weights;
  const n = weights.length;
  
  // Header row
  let result = '     ';
  for (let j = 0; j < n; j++) {
    result += j.toString().padStart(7, ' ') + ' ';
  }
  result += '\n';
  
  // Data rows
  for (let i = 0; i < n; i++) {
    result += i.toString().padStart(2, ' ') + '  ';
    for (let j = 0; j < n; j++) {
      const value = weights[i][j].toFixed(precision);
      result += value.padStart(7, ' ') + ' ';
    }
    result += '\n';
  }
  
  return result;
}

/**
 * Export debug data as JSON string
 * 
 * Serializes debug data for export or logging.
 * 
 * @param state - Network state
 * @param pretty - Whether to pretty-print JSON (default: true)
 * @returns JSON string
 */
export function exportDebugJSON(
  state: NetworkState,
  pretty: boolean = true
): string {
  const debug = getDebugData(state);
  return pretty
    ? JSON.stringify(debug, null, 2)
    : JSON.stringify(debug);
}

/**
 * Get active connections (non-zero weights)
 * 
 * Returns list of all connections with non-zero weights.
 * 
 * @param state - Network state
 * @param threshold - Minimum absolute weight to consider active (default: 0.01)
 * @returns Array of active connections
 * 
 * @example
 * ```typescript
 * const active = getActiveConnections(state, 0.1);
 * active.forEach(conn => {
 *   console.log(`${conn.from} → ${conn.to}: ${conn.value}`);
 * });
 * ```
 */
export function getActiveConnections(
  state: NetworkState,
  threshold: number = 0.01
): ConnectionInfo[] {
  const connections: ConnectionInfo[] = [];
  const weights = state.weights;

  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights[i].length; j++) {
      if (Math.abs(weights[i][j]) >= threshold) {
        connections.push({
          from: i,
          to: j,
          value: weights[i][j],
        });
      }
    }
  }

  return connections.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}

/**
 * Get connection strength between two specific nodes
 * 
 * @param state - Network state
 * @param fromIndex - Source node index
 * @param toIndex - Target node index
 * @returns Connection weight value
 */
export function getConnectionStrength(
  state: NetworkState,
  fromIndex: number,
  toIndex: number
): number {
  const numNodes = state.weights.length;
  
  if (fromIndex < 0 || fromIndex >= numNodes) {
    throw new Error(`fromIndex ${fromIndex} out of bounds [0, ${numNodes - 1}]`);
  }
  
  if (toIndex < 0 || toIndex >= numNodes) {
    throw new Error(`toIndex ${toIndex} out of bounds [0, ${numNodes - 1}]`);
  }
  
  return state.weights[fromIndex][toIndex];
}

/**
 * Compare two network states
 * 
 * Returns difference metrics between two states.
 * 
 * @param state1 - First state
 * @param state2 - Second state
 * @returns Comparison metrics
 */
export function compareStates(
  state1: NetworkState,
  state2: NetworkState
): {
  weightDifference: number;
  changedConnections: number;
  maxChange: number;
} {
  if (state1.weights.length !== state2.weights.length) {
    throw new Error('States have different network sizes');
  }

  let totalDifference = 0;
  let changedConnections = 0;
  let maxChange = 0;
  const n = state1.weights.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const diff = Math.abs(state1.weights[i][j] - state2.weights[i][j]);
      totalDifference += diff;
      
      if (diff > 0.001) { // Threshold for "changed"
        changedConnections++;
      }
      
      if (diff > maxChange) {
        maxChange = diff;
      }
    }
  }

  return {
    weightDifference: totalDifference,
    changedConnections,
    maxChange,
  };
}
