/**
 * Different learning rules for neural networks
 */

export type LearningRuleType = 'hebbian' | 'stdp' | 'bcm' | 'oja';

export interface LearningRuleConfig {
  type: LearningRuleType;
  learningRate: number;
  // STDP parameters
  tauPlus?: number;  // Time constant for potentiation
  tauMinus?: number; // Time constant for depression
  aPlus?: number;    // Amplitude for potentiation
  aMinus?: number;   // Amplitude for depression
  // BCM parameters
  theta?: number;    // Modification threshold
  tauTheta?: number; // Time constant for threshold
  // Oja's rule parameters
  beta?: number;     // Decay parameter
}

export class LearningRules {
  /**
   * Classic Hebbian learning: Δw = η × aᵢ × aⱼ
   */
  static hebbian(
    currentWeight: number,
    activationI: number,
    activationJ: number,
    learningRate: number
  ): number {
    const deltaWeight = learningRate * activationI * activationJ;
    return Math.min(1, currentWeight + deltaWeight);
  }

  /**
   * Spike-Timing-Dependent Plasticity (STDP)
   * If pre-synaptic spike before post-synaptic: potentiation
   * If post-synaptic before pre-synaptic: depression
   */
  static stdp(
    currentWeight: number,
    timeDelta: number, // tPost - tPre (in ms)
    config: LearningRuleConfig
  ): number {
    const tauPlus = config.tauPlus || 20;
    const tauMinus = config.tauMinus || 20;
    const aPlus = config.aPlus || 0.01;
    const aMinus = config.aMinus || 0.01;

    let deltaWeight = 0;

    if (timeDelta > 0) {
      // Post after pre → potentiation
      deltaWeight = aPlus * Math.exp(-timeDelta / tauPlus);
    } else if (timeDelta < 0) {
      // Pre after post → depression
      deltaWeight = -aMinus * Math.exp(timeDelta / tauMinus);
    }

    const newWeight = currentWeight + deltaWeight;
    return Math.max(0, Math.min(1, newWeight));
  }

  /**
   * Bienenstock-Cooper-Munro (BCM) Rule
   * Δw = η × aⱼ × aᵢ × (aⱼ - θ)
   * where θ is a sliding threshold
   */
  static bcm(
    currentWeight: number,
    activationI: number,
    activationJ: number,
    theta: number,
    learningRate: number
  ): number {
    const deltaWeight = learningRate * activationJ * activationI * (activationJ - theta);
    const newWeight = currentWeight + deltaWeight;
    return Math.max(0, Math.min(1, newWeight));
  }

  /**
   * Update BCM threshold based on average post-synaptic activity
   */
  static updateBCMTheta(
    currentTheta: number,
    postActivation: number,
    tauTheta: number = 100
  ): number {
    const alpha = 1 / tauTheta;
    return currentTheta + alpha * (postActivation * postActivation - currentTheta);
  }

  /**
   * Oja's Rule (normalized Hebbian learning)
   * Δw = η × aⱼ × (aᵢ - β × aⱼ × w)
   */
  static oja(
    currentWeight: number,
    activationI: number,
    activationJ: number,
    learningRate: number,
    beta: number = 1
  ): number {
    const deltaWeight = learningRate * activationJ * (activationI - beta * activationJ * currentWeight);
    const newWeight = currentWeight + deltaWeight;
    return Math.max(0, Math.min(1, newWeight));
  }

  /**
   * Apply forgetting/decay to weight
   * Simulates synaptic decay over time
   */
  static applyForgetting(
    currentWeight: number,
    decayRate: number = 0.02,
    minWeight: number = 0.001
  ): number {
    const newWeight = currentWeight * (1 - decayRate);
    return newWeight < minWeight ? 0 : newWeight;
  }

  /**
   * Apply weight normalization to maintain total synaptic strength
   */
  static normalizeWeights(weights: number[], targetSum: number = 1): number[] {
    const sum = weights.reduce((a, b) => a + b, 0);
    if (sum === 0) return weights;
    return weights.map((w) => (w / sum) * targetSum);
  }
}
