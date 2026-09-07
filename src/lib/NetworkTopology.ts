/**
 * Network topology configurations for different connection patterns
 */

export type TopologyType = 'fully-connected' | 'sparse' | 'modular' | 'ring' | 'small-world';

export interface TopologyConfig {
  type: TopologyType;
  // Sparse topology
  connectionProbability?: number;
  // Modular topology
  moduleCount?: number;
  interModuleConnection?: number;
  // Small-world topology
  rewireProbability?: number;
  neighborsPerNode?: number;
}

export class NetworkTopology {
  /**
   * Generate fully connected topology (all-to-all except self)
   */
  static fullyConnected(nodeCount: number): boolean[][] {
    const connections: boolean[][] = [];
    for (let i = 0; i < nodeCount; i++) {
      connections[i] = [];
      for (let j = 0; j < nodeCount; j++) {
        connections[i][j] = i !== j;
      }
    }
    return connections;
  }

  /**
   * Generate sparse random topology
   */
  static sparse(nodeCount: number, probability: number = 0.3): boolean[][] {
    const connections: boolean[][] = [];
    for (let i = 0; i < nodeCount; i++) {
      connections[i] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) {
          connections[i][j] = false;
        } else {
          connections[i][j] = Math.random() < probability;
        }
      }
    }
    return connections;
  }

  /**
   * Generate modular topology (clustered communities)
   */
  static modular(
    nodeCount: number,
    moduleCount: number = 3,
    interModuleProb: number = 0.1
  ): boolean[][] {
    const connections: boolean[][] = Array(nodeCount)
      .fill(null)
      .map(() => Array(nodeCount).fill(false));

    const nodesPerModule = Math.floor(nodeCount / moduleCount);

    for (let i = 0; i < nodeCount; i++) {
      const moduleI = Math.floor(i / nodesPerModule);

      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;

        const moduleJ = Math.floor(j / nodesPerModule);

        if (moduleI === moduleJ) {
          // Within module: fully connected
          connections[i][j] = true;
        } else {
          // Between modules: sparse connections
          connections[i][j] = Math.random() < interModuleProb;
        }
      }
    }

    return connections;
  }

  /**
   * Generate ring topology (each node connects to neighbors)
   */
  static ring(nodeCount: number, neighborsPerSide: number = 2): boolean[][] {
    const connections: boolean[][] = Array(nodeCount)
      .fill(null)
      .map(() => Array(nodeCount).fill(false));

    for (let i = 0; i < nodeCount; i++) {
      for (let offset = 1; offset <= neighborsPerSide; offset++) {
        const leftNeighbor = (i - offset + nodeCount) % nodeCount;
        const rightNeighbor = (i + offset) % nodeCount;
        connections[i][leftNeighbor] = true;
        connections[i][rightNeighbor] = true;
      }
    }

    return connections;
  }

  /**
   * Generate small-world topology (Watts-Strogatz model)
   */
  static smallWorld(
    nodeCount: number,
    neighborsPerNode: number = 4,
    rewireProbability: number = 0.1
  ): boolean[][] {
    // Start with ring lattice
    const connections = NetworkTopology.ring(nodeCount, Math.floor(neighborsPerNode / 2));

    // Rewire edges with probability
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (connections[i][j] && Math.random() < rewireProbability) {
          // Disconnect
          connections[i][j] = false;
          connections[j][i] = false;

          // Reconnect to random node
          let newTarget = Math.floor(Math.random() * nodeCount);
          while (newTarget === i || connections[i][newTarget]) {
            newTarget = Math.floor(Math.random() * nodeCount);
          }
          connections[i][newTarget] = true;
          connections[newTarget][i] = true;
        }
      }
    }

    return connections;
  }

  /**
   * Count total connections in topology
   */
  static countConnections(topology: boolean[][]): number {
    let count = 0;
    for (let i = 0; i < topology.length; i++) {
      for (let j = 0; j < topology[i].length; j++) {
        if (topology[i][j]) count++;
      }
    }
    return count;
  }

  /**
   * Get connection density (ratio of actual to possible connections)
   */
  static getDensity(topology: boolean[][]): number {
    const n = topology.length;
    const possibleConnections = n * (n - 1); // Exclude self-connections
    const actualConnections = NetworkTopology.countConnections(topology);
    return actualConnections / possibleConnections;
  }

  /**
   * Apply topology to weight matrix (mask out non-connected pairs)
   */
  static applyToWeights(weights: number[][], topology: boolean[][]): number[][] {
    const masked = weights.map((row) => [...row]);
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights[i].length; j++) {
        if (!topology[i][j]) {
          masked[i][j] = 0;
        }
      }
    }
    return masked;
  }
}
