/**
 * Multi-layer Neural Network
 * Supports input → hidden → output layer architecture
 */

export interface Layer {
  id: string;
  name: string;
  size: number;
  activations: number[];
  type: 'input' | 'hidden' | 'output';
}

export interface LayerConnection {
  from: string; // layer id
  to: string; // layer id
  weights: number[][]; // [from_size][to_size]
}

export class MultiLayerNetwork {
  private layers: Map<string, Layer>;
  private connections: Map<string, LayerConnection>;
  private learningRate: number;

  constructor(layerSizes: number[], learningRate = 0.1) {
    this.layers = new Map();
    this.connections = new Map();
    this.learningRate = learningRate;

    // Create layers
    layerSizes.forEach((size, idx) => {
      const type = idx === 0 ? 'input' : idx === layerSizes.length - 1 ? 'output' : 'hidden';
      const layer: Layer = {
        id: `layer-${idx}`,
        name: type === 'input' ? 'Input' : type === 'output' ? 'Output' : `Hidden ${idx}`,
        size,
        activations: new Array(size).fill(0),
        type,
      };
      this.layers.set(layer.id, layer);
    });

    // Create connections between consecutive layers
    const layerIds = Array.from(this.layers.keys());
    for (let i = 0; i < layerIds.length - 1; i++) {
      const fromLayer = this.layers.get(layerIds[i])!;
      const toLayer = this.layers.get(layerIds[i + 1])!;
      
      const connectionId = `${fromLayer.id}-${toLayer.id}`;
      const weights = this.initializeWeights(fromLayer.size, toLayer.size);
      
      this.connections.set(connectionId, {
        from: fromLayer.id,
        to: toLayer.id,
        weights,
      });
    }
  }

  /**
   * Initialize weights with small random values (Xavier initialization)
   */
  private initializeWeights(inputSize: number, outputSize: number): number[][] {
    const weights: number[][] = [];
    const scale = Math.sqrt(2.0 / (inputSize + outputSize));
    
    for (let i = 0; i < inputSize; i++) {
      weights[i] = [];
      for (let j = 0; j < outputSize; j++) {
        weights[i][j] = (Math.random() * 2 - 1) * scale;
      }
    }
    
    return weights;
  }

  /**
   * Sigmoid activation function
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Sigmoid derivative (for backpropagation)
   */
  private sigmoidDerivative(x: number): number {
    const s = this.sigmoid(x);
    return s * (1 - s);
  }

  /**
   * ReLU activation function
   */
  private relu(x: number): number {
    return Math.max(0, x);
  }

  /**
   * ReLU derivative
   */
  private reluDerivative(x: number): number {
    return x > 0 ? 1 : 0;
  }

  /**
   * Forward pass through the network
   */
  forward(input: number[], activationFn: 'sigmoid' | 'relu' = 'sigmoid'): number[] {
    const layerIds = Array.from(this.layers.keys());
    
    // Set input layer activations
    const inputLayer = this.layers.get(layerIds[0])!;
    if (input.length !== inputLayer.size) {
      throw new Error(`Input size mismatch: expected ${inputLayer.size}, got ${input.length}`);
    }
    inputLayer.activations = [...input];

    // Forward propagate through each layer
    for (let i = 0; i < layerIds.length - 1; i++) {
      const fromId = layerIds[i];
      const toId = layerIds[i + 1];
      const connectionId = `${fromId}-${toId}`;
      
      const connection = this.connections.get(connectionId)!;
      const fromLayer = this.layers.get(fromId)!;
      const toLayer = this.layers.get(toId)!;

      // Compute weighted sum for each neuron in next layer
      for (let j = 0; j < toLayer.size; j++) {
        let sum = 0;
        for (let k = 0; k < fromLayer.size; k++) {
          sum += fromLayer.activations[k] * connection.weights[k][j];
        }
        
        // Apply activation function
        if (activationFn === 'sigmoid') {
          toLayer.activations[j] = this.sigmoid(sum);
        } else {
          toLayer.activations[j] = this.relu(sum);
        }
      }
    }

    // Return output layer activations
    const outputLayer = this.layers.get(layerIds[layerIds.length - 1])!;
    return [...outputLayer.activations];
  }

  /**
   * Backpropagation training
   */
  train(input: number[], target: number[], activationFn: 'sigmoid' | 'relu' = 'sigmoid'): number {
    // Forward pass
    this.forward(input, activationFn);

    const layerIds = Array.from(this.layers.keys());
    const errors = new Map<string, number[]>();

    // Calculate output error
    const outputId = layerIds[layerIds.length - 1];
    const outputLayer = this.layers.get(outputId)!;
    const outputError: number[] = [];
    
    let totalError = 0;
    for (let i = 0; i < outputLayer.size; i++) {
      const error = target[i] - outputLayer.activations[i];
      outputError[i] = error;
      totalError += error * error;
    }
    errors.set(outputId, outputError);

    // Backpropagate errors
    for (let i = layerIds.length - 2; i >= 0; i--) {
      const fromId = layerIds[i];
      const toId = layerIds[i + 1];
      const connectionId = `${fromId}-${toId}`;
      
      const connection = this.connections.get(connectionId)!;
      const fromLayer = this.layers.get(fromId)!;
      const toLayer = this.layers.get(toId)!;
      const toError = errors.get(toId)!;

      // Calculate error for previous layer
      const fromError: number[] = new Array(fromLayer.size).fill(0);
      
      for (let j = 0; j < fromLayer.size; j++) {
        for (let k = 0; k < toLayer.size; k++) {
          fromError[j] += toError[k] * connection.weights[j][k];
        }
      }
      
      errors.set(fromId, fromError);

      // Update weights
      for (let j = 0; j < fromLayer.size; j++) {
        for (let k = 0; k < toLayer.size; k++) {
          const gradient = toError[k] * fromLayer.activations[j];
          connection.weights[j][k] += this.learningRate * gradient;
        }
      }
    }

    return totalError / outputLayer.size; // Mean squared error
  }

  /**
   * Get all layers
   */
  getLayers(): Layer[] {
    return Array.from(this.layers.values());
  }

  /**
   * Get all connections
   */
  getConnections(): LayerConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Get layer by id
   */
  getLayer(id: string): Layer | undefined {
    return this.layers.get(id);
  }

  /**
   * Set learning rate
   */
  setLearningRate(rate: number): void {
    this.learningRate = rate;
  }

  /**
   * Get learning rate
   */
  getLearningRate(): number {
    return this.learningRate;
  }

  /**
   * Reset network (randomize weights)
   */
  reset(): void {
    this.connections.forEach((connection) => {
      const fromLayer = this.layers.get(connection.from)!;
      const toLayer = this.layers.get(connection.to)!;
      connection.weights = this.initializeWeights(fromLayer.size, toLayer.size);
    });

    this.layers.forEach((layer) => {
      layer.activations = new Array(layer.size).fill(0);
    });
  }

  /**
   * Export network state
   */
  export(): any {
    return {
      layers: Array.from(this.layers.entries()),
      connections: Array.from(this.connections.entries()),
      learningRate: this.learningRate,
    };
  }

  /**
   * Import network state
   */
  import(state: any): void {
    this.layers = new Map(state.layers);
    this.connections = new Map(state.connections);
    this.learningRate = state.learningRate;
  }
}
