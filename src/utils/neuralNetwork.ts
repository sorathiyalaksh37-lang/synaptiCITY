/**
 * Neural Network Core
 * 
 * Manages the fundamental structure of the neural network including:
 * - Weight matrix initialization and management
 * - Learning rate configuration
 * - Network state management
 * 
 * @module neuralNetwork
 */

/**
 * Clamps a value between min and max bounds
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Neural Network Class
 * 
 * Core class that manages the neural network structure and state.
 * Does not implement learning logic - that's handled by separate utility functions.
 */
export class NeuralNetwork {
  private weights: number[][];
  private numNodes: number;
  private learningRate: number;
  
  /**
   * Creates a new Neural Network
   * 
   * @param numNodes - Number of nodes in the network (default: 6)
   * @param learningRate - Learning rate parameter η (default: 0.1)
   */
  constructor(numNodes: number = 6, learningRate: number = 0.1) {
    if (numNodes < 2) {
      throw new Error('Neural network must have at least 2 nodes');
    }
    if (learningRate <= 0 || learningRate > 1) {
      throw new Error('Learning rate must be between 0 and 1');
    }
    
    this.numNodes = numNodes;
    this.learningRate = clamp(learningRate, 0.01, 1.0);
    this.weights = this.initializeWeights();
  }
  
  /**
   * Initializes the weight matrix with random values
   * 
   * Creates an N x N matrix where N is the number of nodes.
   * Weights are initialized randomly between -0.5 and 0.5 to:
   * - Break symmetry (different initial conditions)
   * - Start with small values (prevent early saturation)
   * - Allow both excitatory and inhibitory connections
   * 
   * @returns N x N weight matrix
   */
  private initializeWeights(): number[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < this.numNodes; i++) {
      const row: number[] = [];
      for (let j = 0; j < this.numNodes; j++) {
        // Random value between -0.5 and 0.5
        const randomWeight = (Math.random() - 0.5);
        row.push(randomWeight);
      }
      matrix.push(row);
    }
    
    return matrix;
  }
  
  /**
   * Gets the current weight matrix
   * 
   * Returns a deep copy to prevent external modification
   * 
   * @returns Copy of the weight matrix
   */
  getWeights(): number[][] {
    return this.weights.map(row => [...row]);
  }
  
  /**
   * Sets the weight matrix
   * 
   * Validates dimensions and clamps values to prevent:
   * - Weight explosion (values too large)
   * - Numerical instability
   * 
   * @param weights - New weight matrix (must be N x N)
   * @throws Error if dimensions don't match
   */
  setWeights(weights: number[][]): void {
    // Validate dimensions
    if (weights.length !== this.numNodes) {
      throw new Error(
        `Weight matrix must have ${this.numNodes} rows, got ${weights.length}`
      );
    }
    
    for (let i = 0; i < weights.length; i++) {
      if (weights[i].length !== this.numNodes) {
        throw new Error(
          `Weight matrix row ${i} must have ${this.numNodes} columns, got ${weights[i].length}`
        );
      }
    }
    
    // Deep copy with clamping
    this.weights = weights.map(row =>
      row.map(weight => clamp(weight, -3.0, 3.0))
    );
  }
  
  /**
   * Gets the number of nodes in the network
   * 
   * @returns Number of nodes
   */
  getNodeCount(): number {
    return this.numNodes;
  }
  
  /**
   * Sets the learning rate
   * 
   * The learning rate (η) controls how quickly connections strengthen:
   * - Low (0.01-0.05): Slow, stable learning
   * - Medium (0.1-0.2): Balanced
   * - High (0.3-0.5): Fast learning, more interference
   * 
   * @param rate - New learning rate (clamped to 0.01-1.0)
   */
  setLearningRate(rate: number): void {
    if (rate <= 0) {
      throw new Error('Learning rate must be positive');
    }
    this.learningRate = clamp(rate, 0.01, 1.0);
  }
  
  /**
   * Gets the current learning rate
   * 
   * @returns Current learning rate value
   */
  getLearningRate(): number {
    return this.learningRate;
  }
  
  /**
   * Resets the network to initial state
   * 
   * Reinitializes weights with new random values.
   * Useful for:
   * - Starting fresh experiments
   * - Clearing learned associations
   * - Testing reproducibility
   */
  reset(): void {
    this.weights = this.initializeWeights();
  }
  
  /**
   * Gets a specific weight value
   * 
   * @param fromIndex - Source node index
   * @param toIndex - Target node index
   * @returns Weight value at [fromIndex][toIndex]
   * @throws Error if indices are out of bounds
   */
  getWeight(fromIndex: number, toIndex: number): number {
    this.validateIndex(fromIndex, 'fromIndex');
    this.validateIndex(toIndex, 'toIndex');
    return this.weights[fromIndex][toIndex];
  }
  
  /**
   * Sets a specific weight value
   * 
   * @param fromIndex - Source node index
   * @param toIndex - Target node index
   * @param value - New weight value (will be clamped to [-3.0, 3.0])
   * @throws Error if indices are out of bounds
   */
  setWeight(fromIndex: number, toIndex: number, value: number): void {
    this.validateIndex(fromIndex, 'fromIndex');
    this.validateIndex(toIndex, 'toIndex');
    this.weights[fromIndex][toIndex] = clamp(value, -3.0, 3.0);
  }
  
  /**
   * Validates that an index is within bounds
   * 
   * @param index - Index to validate
   * @param name - Name of the index (for error messages)
   * @throws Error if index is out of bounds
   */
  private validateIndex(index: number, name: string): void {
    if (!Number.isInteger(index)) {
      throw new Error(`${name} must be an integer, got ${index}`);
    }
    if (index < 0 || index >= this.numNodes) {
      throw new Error(
        `${name} must be between 0 and ${this.numNodes - 1}, got ${index}`
      );
    }
  }
  
  /**
   * Gets the size of the weight matrix
   * 
   * @returns Object with dimensions { rows, cols }
   */
  getWeightMatrixSize(): { rows: number; cols: number } {
    return {
      rows: this.numNodes,
      cols: this.numNodes
    };
  }
  
  /**
   * Checks if the weight matrix is symmetric
   * 
   * Useful for debugging and understanding network structure.
   * In Hebbian learning without normalization, the matrix
   * is typically NOT symmetric.
   * 
   * @returns True if weights[i][j] === weights[j][i] for all i, j
   */
  isSymmetric(): boolean {
    for (let i = 0; i < this.numNodes; i++) {
      for (let j = i + 1; j < this.numNodes; j++) {
        if (this.weights[i][j] !== this.weights[j][i]) {
          return false;
        }
      }
    }
    return true;
  }
  
  /**
   * Gets statistics about the weight distribution
   * 
   * Useful for understanding network state and debugging
   * 
   * @returns Object with min, max, mean, and std statistics
   */
  getWeightStats(): { min: number; max: number; mean: number; std: number } {
    const allWeights: number[] = [];
    
    for (let i = 0; i < this.numNodes; i++) {
      for (let j = 0; j < this.numNodes; j++) {
        allWeights.push(this.weights[i][j]);
      }
    }
    
    const min = Math.min(...allWeights);
    const max = Math.max(...allWeights);
    const mean = allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length;
    
    const variance = allWeights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / allWeights.length;
    const std = Math.sqrt(variance);
    
    return { min, max, mean, std };
  }
  
  /**
   * Exports the network state as a JSON-serializable object
   * 
   * Useful for:
   * - Saving network state
   * - Sharing configurations
   * - Debugging
   * 
   * @returns Serializable network state
   */
  exportState(): {
    weights: number[][];
    numNodes: number;
    learningRate: number;
  } {
    return {
      weights: this.getWeights(),
      numNodes: this.numNodes,
      learningRate: this.learningRate
    };
  }
  
  /**
   * Imports a network state from a JSON object
   * 
   * @param state - Previously exported state
   * @throws Error if state is invalid
   */
  importState(state: {
    weights: number[][];
    numNodes: number;
    learningRate: number;
  }): void {
    if (state.numNodes !== this.numNodes) {
      throw new Error(
        `Cannot import state with ${state.numNodes} nodes into network with ${this.numNodes} nodes`
      );
    }
    
    this.setWeights(state.weights);
    this.setLearningRate(state.learningRate);
  }
}

/**
 * Creates a new neural network with default settings
 * 
 * Factory function for convenience
 * 
 * @param numNodes - Number of nodes (default: 6)
 * @param learningRate - Learning rate (default: 0.1)
 * @returns New NeuralNetwork instance
 */
export function createNeuralNetwork(
  numNodes: number = 6,
  learningRate: number = 0.1
): NeuralNetwork {
  return new NeuralNetwork(numNodes, learningRate);
}

/**
 * Utility function to clamp weights matrix
 * 
 * @param weights - Weight matrix to clamp
 * @param min - Minimum value (default: -3.0)
 * @param max - Maximum value (default: 3.0)
 * @returns Clamped weight matrix
 */
export function clampWeights(
  weights: number[][],
  min: number = -3.0,
  max: number = 3.0
): number[][] {
  return weights.map(row =>
    row.map(weight => clamp(weight, min, max))
  );
}
