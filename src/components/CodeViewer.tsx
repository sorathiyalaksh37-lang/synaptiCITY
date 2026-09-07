import React, { useState } from 'react';

interface CodeExample {
  id: string;
  language: string;
  title: string;
  description: string;
  code: string;
}

const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 'hebbian-python',
    language: 'python',
    title: 'Hebbian Learning (Python)',
    description: 'Simple implementation of Hebbian learning rule',
    code: `import numpy as np

class HebbianNetwork:
    def __init__(self, size, learning_rate=0.1):
        self.size = size
        self.learning_rate = learning_rate
        self.weights = np.zeros((size, size))
    
    def teach(self, input_idx, output_idx):
        """Strengthen connection between neurons"""
        # Δw = η × aᵢ × aⱼ
        delta_w = self.learning_rate * 1.0 * 1.0
        self.weights[input_idx][output_idx] += delta_w
        
        # Clip to [0, 1]
        self.weights[input_idx][output_idx] = min(
            1.0, self.weights[input_idx][output_idx]
        )
    
    def recall(self, input_idx):
        """Find strongest connection"""
        connections = self.weights[input_idx]
        return np.argmax(connections)

# Example usage
network = HebbianNetwork(size=6, learning_rate=0.1)

# Teach: DOG (0) → ANIMAL (1)
network.teach(0, 1)

# Recall
prediction = network.recall(0)
print(f"DOG activates neuron: {prediction}")`,
  },
  {
    id: 'hebbian-js',
    language: 'javascript',
    title: 'Hebbian Learning (JavaScript)',
    description: 'TypeScript implementation with class-based approach',
    code: `class NeuralNetwork {
  private weights: number[][];
  private learningRate: number;

  constructor(size: number, learningRate: number = 0.1) {
    this.learningRate = learningRate;
    this.weights = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));
  }

  teach(inputIdx: number, outputIdx: number): void {
    // Hebbian rule: Δw = η × aᵢ × aⱼ
    const deltaW = this.learningRate * 1.0 * 1.0;
    this.weights[inputIdx][outputIdx] += deltaW;
    
    // Clip to [0, 1]
    this.weights[inputIdx][outputIdx] = Math.min(
      1.0,
      this.weights[inputIdx][outputIdx]
    );
  }

  recall(inputIdx: number): number {
    const connections = this.weights[inputIdx];
    return connections.indexOf(Math.max(...connections));
  }
}

// Example
const network = new NeuralNetwork(6, 0.1);
network.teach(0, 1); // DOG → ANIMAL
const prediction = network.recall(0);
console.log(\`Predicted: \${prediction}\`);`,
  },
  {
    id: 'stdp',
    language: 'python',
    title: 'STDP Implementation',
    description: 'Spike-timing-dependent plasticity with exponential windows',
    code: `import numpy as np

def stdp_update(weight, time_delta, tau_plus=20, tau_minus=20):
    """
    STDP learning rule
    
    Args:
        weight: Current synaptic weight
        time_delta: tPost - tPre (milliseconds)
        tau_plus: Time constant for potentiation
        tau_minus: Time constant for depression
    
    Returns:
        Updated weight
    """
    A_plus = 0.01  # Potentiation amplitude
    A_minus = 0.01  # Depression amplitude
    
    if time_delta > 0:
        # Pre before post → strengthen
        delta_w = A_plus * np.exp(-time_delta / tau_plus)
    elif time_delta < 0:
        # Post before pre → weaken
        delta_w = -A_minus * np.exp(time_delta / tau_minus)
    else:
        delta_w = 0
    
    new_weight = weight + delta_w
    return np.clip(new_weight, 0, 1)

# Example
current_weight = 0.5
dt = 10  # Pre spike 10ms before post
new_weight = stdp_update(current_weight, dt)
print(f"Weight: {current_weight:.4f} → {new_weight:.4f}")`,
  },
];

export const CodeViewer: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<CodeExample>(CODE_EXAMPLES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedExample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="code-viewer">
      <div className="code-header">
        <h4>Code Examples</h4>
        <p className="code-subtitle">
          Implementation examples in Python and JavaScript
        </p>
      </div>

      <div className="code-tabs">
        {CODE_EXAMPLES.map((example) => (
          <button
            key={example.id}
            className={`code-tab ${selectedExample.id === example.id ? 'is-active' : ''}`}
            onClick={() => setSelectedExample(example)}
          >
            <span className="tab-language">{example.language}</span>
            <span className="tab-title">{example.title}</span>
          </button>
        ))}
      </div>

      <div className="code-content">
        <div className="code-toolbar">
          <span className="code-description">{selectedExample.description}</span>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7L5 10L12 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect
                    x="4"
                    y="4"
                    width="8"
                    height="8"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2 10V3C2 2.44772 2.44772 2 3 2H10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        <pre className="code-block">
          <code className={`language-${selectedExample.language}`}>
            {selectedExample.code}
          </code>
        </pre>
      </div>

      <div className="code-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10V7M7 4.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>
          These examples demonstrate the core algorithms used in synaptiCITY.
          Adapt them for your own projects or learning experiments.
        </span>
      </div>
    </div>
  );
};
