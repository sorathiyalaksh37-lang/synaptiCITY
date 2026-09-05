/**
 * Simple Neural Network with Hebbian Learning
 * 
 * Implements synaptic plasticity through Hebbian update rule:
 * Δw = η × aᵢ × aⱼ
 * 
 * Where:
 * - Δw = change in weight
 * - η = learning rate
 * - aᵢ = activation of pre-synaptic neuron
 * - aⱼ = activation of post-synaptic neuron
 */

export class NeuralNetwork {
  private vocabulary: Map<string, number>;
  private reverseVocabulary: Map<number, string>;
  private weights: number[][];
  private activations: number[];
  private learningRate: number;
  private vocabSize: number;

  constructor(vocabulary: string[], learningRate: number = 0.1) {
    this.learningRate = learningRate;
    this.vocabSize = vocabulary.length;
    
    // Create vocabulary mappings
    this.vocabulary = new Map();
    this.reverseVocabulary = new Map();
    vocabulary.forEach((word, index) => {
      this.vocabulary.set(word, index);
      this.reverseVocabulary.set(index, word);
    });

    // Initialize weight matrix with small random values
    this.weights = Array(this.vocabSize).fill(0).map(() =>
      Array(this.vocabSize).fill(0).map(() => Math.random() * 0.01)
    );

    // Initialize activations
    this.activations = Array(this.vocabSize).fill(0);
  }

  /**
   * Get the index of a word in the vocabulary
   */
  private getIndex(word: string): number {
    const index = this.vocabulary.get(word.toUpperCase());
    if (index === undefined) {
      throw new Error(`Word "${word}" not in vocabulary`);
    }
    return index;
  }

  /**
   * Get the word at a given index
   */
  private getWord(index: number): string {
    const word = this.reverseVocabulary.get(index);
    if (word === undefined) {
      throw new Error(`Index ${index} not in vocabulary`);
    }
    return word;
  }

  /**
   * Set activation for a specific word
   */
  private activate(word: string, value: number = 1.0): void {
    const index = this.getIndex(word);
    this.activations[index] = value;
  }

  /**
   * Clear all activations
   */
  private clearActivations(): void {
    this.activations.fill(0);
  }

  /**
   * Hebbian learning rule: Δw = η × aᵢ × aⱼ
   * Strengthens connections between co-active neurons
   */
  private hebbianUpdate(inputWord: string, outputWord: string): void {
    const i = this.getIndex(inputWord);
    const j = this.getIndex(outputWord);

    // Get activations
    const ai = this.activations[i];
    const aj = this.activations[j];

    // Update weight using Hebbian rule
    const deltaW = this.learningRate * ai * aj;
    this.weights[i][j] += deltaW;

    // Clamp weights to reasonable range
    this.weights[i][j] = Math.max(0, Math.min(1, this.weights[i][j]));
  }

  /**
   * Teach the network an association through repetition.
   * Returns weight-change data so the UI can display a live feedback panel.
   */
  teach(
    inputWord: string,
    outputWord: string,
    repetitions: number = 1
  ): { previousWeight: number; newWeight: number; deltaWeight: number } {
    const i = this.getIndex(inputWord);
    const j = this.getIndex(outputWord);
    const previousWeight = this.weights[i][j];

    for (let rep = 0; rep < repetitions; rep++) {
      this.clearActivations();

      // Activate input and output simultaneously ("fire together")
      this.activate(inputWord, 1.0);
      this.activate(outputWord, 1.0);

      // Apply Hebbian update ("wire together")
      this.hebbianUpdate(inputWord, outputWord);
    }

    const newWeight = this.weights[i][j];
    const deltaWeight = newWeight - previousWeight;

    return { previousWeight, newWeight, deltaWeight };
  }

  /**
   * Recall: Given an input word, predict the output word
   * Returns the word with the highest connection strength
   */
  recall(inputWord: string): { word: string; confidence: number; allScores: Map<string, number> } {
    this.clearActivations();
    this.activate(inputWord, 1.0);

    const inputIndex = this.getIndex(inputWord);
    const scores = new Map<string, number>();

    // Calculate scores for all possible outputs
    let maxScore = -Infinity;
    let maxIndex = -1;

    for (let j = 0; j < this.vocabSize; j++) {
      if (j === inputIndex) continue; // Skip self-connections

      const score = this.weights[inputIndex][j];
      const word = this.getWord(j);
      scores.set(word, score);

      if (score > maxScore) {
        maxScore = score;
        maxIndex = j;
      }
    }

    const predictedWord = maxIndex >= 0 ? this.getWord(maxIndex) : '';
    const confidence = maxScore;

    return {
      word: predictedWord,
      confidence,
      allScores: scores
    };
  }

  /**
   * Get the current weight matrix
   */
  getWeights(): number[][] {
    return this.weights.map(row => [...row]);
  }

  /**
   * Get specific weight between two words
   */
  getWeight(fromWord: string, toWord: string): number {
    const i = this.getIndex(fromWord);
    const j = this.getIndex(toWord);
    return this.weights[i][j];
  }

  /**
   * Get current activations
   */
  getActivations(): number[] {
    return [...this.activations];
  }

  /**
   * Set learning rate
   */
  setLearningRate(rate: number): void {
    this.learningRate = Math.max(0, Math.min(1, rate));
  }

  /**
   * Get learning rate
   */
  getLearningRate(): number {
    return this.learningRate;
  }

  /**
   * Get vocabulary
   */
  getVocabulary(): string[] {
    return Array.from(this.vocabulary.keys());
  }

  /**
   * Reset the network (clear all weights)
   */
  reset(): void {
    this.weights = Array(this.vocabSize).fill(0).map(() =>
      Array(this.vocabSize).fill(0).map(() => Math.random() * 0.01)
    );
    this.clearActivations();
  }
}
