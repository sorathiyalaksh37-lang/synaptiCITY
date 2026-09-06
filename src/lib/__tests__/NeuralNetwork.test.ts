import { describe, it, expect } from 'vitest';
import { NeuralNetwork } from '../NeuralNetwork';

describe('NeuralNetwork', () => {
  const VOCABULARY = ['DOG', 'ANIMAL', 'PET', 'CAT', 'BIRD', 'FISH'];

  it('strengthens connections via Hebbian learning on teach()', () => {
    const nn = new NeuralNetwork(VOCABULARY, 0.1);
    const initialWeight = nn.getWeight('DOG', 'ANIMAL');
    const result = nn.teach('DOG', 'ANIMAL', 3);

    expect(result.newWeight).toBeGreaterThan(initialWeight);
    expect(result.deltaWeight).toBeGreaterThan(0);
    expect(nn.getWeight('DOG', 'ANIMAL')).toBeCloseTo(initialWeight + 0.3, 2);
  });

  it('recalls the strongest connected concept', () => {
    const nn = new NeuralNetwork(VOCABULARY, 0.1);
    nn.teach('DOG', 'ANIMAL', 3);

    const recallResult = nn.recall('DOG');
    expect(recallResult.word).toBe('ANIMAL');
    expect(recallResult.confidence).toBeGreaterThan(0.3);
  });

  it('applies connection decay to non-target weights during teach()', () => {
    const nn = new NeuralNetwork(VOCABULARY, 0.1);
    nn.teach('DOG', 'ANIMAL', 5);
    const weightBeforePetTeaches = nn.getWeight('DOG', 'ANIMAL');

    nn.teach('DOG', 'PET', 5);
    const weightAfterPetTeaches = nn.getWeight('DOG', 'ANIMAL');

    expect(weightAfterPetTeaches).toBeLessThan(weightBeforePetTeaches);
  });
});
