/**
 * Type definitions for neural network system
 * 
 * @module network.types
 */

/**
 * Core network state structure
 */
export interface NetworkState {
  /** N x N weight matrix storing connection strengths */
  weights: number[][];
  /** Current activation values for all nodes */
  activations: number[];
  /** Learning rate (η) for Hebbian updates */
  learningRate: number;
  /** Total number of teaching repetitions */
  repetitions: number;
  /** Count of interference events */
  interferenceCount: number;
  /** Memory decay rate (0-1) */
  memoryDecay: number;
  /** History of state changes */
  history: HistoryEntry[];
  /** Timestamp of last update */
  timestamp: number;
}

/**
 * History entry for state tracking
 */
export interface HistoryEntry {
  /** Type of action performed */
  action: 'teach' | 'recall' | 'interference' | 'decay' | 'reset';
  /** Input node index */
  inputIndex?: number;
  /** Output node index */
  outputIndex?: number;
  /** Timestamp of action */
  timestamp: number;
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Result from recall operation
 */
export interface RecallResult {
  /** Index of node with highest activation */
  outputIndex: number;
  /** Confidence score (0-1) */
  confidence: number;
  /** All output activation values */
  allOutputs: number[];
  /** Whether recall was successful */
  success: boolean;
  /** Optional threshold used for success determination */
  threshold?: number;
}

/**
 * Debug data for visualization and monitoring
 */
export interface DebugData {
  /** Full weight matrix */
  weights: number[][];
  /** Current node activations */
  activations: number[];
  /** Learning rate */
  learningRate: number;
  /** Total teaching repetitions */
  repetitions: number;
  /** Interference event count */
  interferenceCount: number;
  /** Memory decay rate */
  memoryDecay: number;
  /** Total weight updates performed */
  totalUpdates: number;
  /** Strongest connection in network */
  strongestConnection: ConnectionInfo;
  /** Weakest connection in network */
  weakestConnection: ConnectionInfo;
  /** Overall network accuracy estimate */
  accuracy: number;
  /** Number of history entries */
  historyLength: number;
  /** Last update timestamp */
  timestamp: number;
  /** Average weight value */
  averageWeight: number;
  /** Standard deviation of weights */
  weightStdDev: number;
}

/**
 * Connection information
 */
export interface ConnectionInfo {
  /** Source node index */
  from: number;
  /** Target node index */
  to: number;
  /** Connection weight value */
  value: number;
}

/**
 * Configuration for network initialization
 */
export interface NetworkConfig {
  /** Number of nodes in network */
  numNodes: number;
  /** Initial learning rate */
  learningRate?: number;
  /** Initial memory decay rate */
  memoryDecay?: number;
  /** Random seed for reproducibility */
  seed?: number;
}

/**
 * Statistics about network state
 */
export interface NetworkStats {
  /** Total number of nodes */
  nodeCount: number;
  /** Number of non-zero connections */
  activeConnections: number;
  /** Average connection strength */
  averageWeight: number;
  /** Maximum weight value */
  maxWeight: number;
  /** Minimum weight value */
  minWeight: number;
  /** Total teaching repetitions */
  totalRepetitions: number;
  /** Total interference events */
  totalInterference: number;
}

/**
 * Options for teaching operation
 */
export interface TeachOptions {
  /** Number of repetitions */
  repetitions?: number;
  /** Custom learning rate for this operation */
  learningRate?: number;
  /** Whether to track in history */
  trackHistory?: boolean;
}

/**
 * Options for recall operation
 */
export interface RecallOptions {
  /** Confidence threshold for success */
  threshold?: number;
  /** Whether to update activations in state */
  updateState?: boolean;
}

/**
 * Options for decay operation
 */
export interface DecayOptions {
  /** Decay rate (overrides state default) */
  rate?: number;
  /** Minimum weight threshold */
  minThreshold?: number;
  /** Whether to apply selective decay */
  selective?: boolean;
}

/**
 * Interference detection result
 */
export interface InterferenceDetection {
  /** Whether interference was detected */
  detected: boolean;
  /** Conflicting associations */
  conflicts: Array<{
    inputIndex: number;
    outputIndex: number;
    weight: number;
  }>;
  /** Interference severity (0-1) */
  severity: number;
}

/**
 * Cache entry for predictions
 */
export interface CacheEntry {
  /** Cached recall result */
  result: RecallResult;
  /** Timestamp when cached */
  timestamp: number;
  /** Time-to-live in milliseconds */
  ttl: number;
}

/**
 * Hook return type for useNeuralNetwork
 */
export interface UseNeuralNetworkReturn {
  /** Current network state */
  state: NetworkState;
  /** Teaching function */
  teach: (inputIndex: number, outputIndex: number, options?: TeachOptions) => void;
  /** Recall function */
  recall: (inputIndex: number, options?: RecallOptions) => RecallResult;
  /** Add interference function */
  addInterference: (inputIndex: number, outputIndex: number) => void;
  /** Reset network function */
  reset: () => void;
  /** Apply decay function */
  applyDecay: (rate?: number) => void;
  /** Get debug data function */
  getDebugData: () => DebugData;
  /** Get network statistics */
  getStats: () => NetworkStats;
  /** Undo last action */
  undo: () => void;
  /** Redo last undone action */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error messages if invalid */
  errors: string[];
}
