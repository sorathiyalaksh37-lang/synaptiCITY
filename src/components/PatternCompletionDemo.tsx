import React, { useState } from 'react';

interface Pattern {
  id: string;
  name: string;
  full: string;
  partial: string;
  description: string;
}

const PATTERNS: Pattern[] = [
  {
    id: 'dog-animal',
    name: 'Animal Recognition',
    full: 'DOG → ANIMAL',
    partial: 'D?G → ?',
    description: 'Network recalls ANIMAL from partial cue D?G',
  },
  {
    id: 'sequential',
    name: 'Sequential Memory',
    full: 'CAT → PET → HOME',
    partial: 'CAT → ? → ?',
    description: 'Network completes the learned sequence',
  },
  {
    id: 'distributed',
    name: 'Distributed Pattern',
    full: 'BIRD + SKY + FLY',
    partial: 'BIRD + ? + ?',
    description: 'Multiple associations fire together',
  },
];

interface PatternCompletionDemoProps {
  vocabulary: string[];
  onTestPattern: (input: string, expectedOutput: string) => void;
}

export const PatternCompletionDemo: React.FC<PatternCompletionDemoProps> = ({
  vocabulary,
  onTestPattern,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');

  const handleTestPattern = (pattern: Pattern) => {
    setSelectedPattern(pattern);
    // Extract the first word from the partial pattern
    const inputWord = pattern.partial.split('→')[0].trim().replace('?', '');
    const outputWord = pattern.full.split('→')[1]?.trim() || vocabulary[1];
    onTestPattern(inputWord, outputWord);
  };

  const handleCustomTest = () => {
    if (customInput && customOutput) {
      onTestPattern(customInput, customOutput);
    }
  };

  return (
    <div className="pattern-completion-demo">
      <div className="demo-header">
        <h4>Pattern Completion</h4>
        <p className="demo-subtitle">
          Test how the network completes partial patterns based on learned associations
        </p>
      </div>

      <div className="pattern-grid">
        {PATTERNS.map((pattern) => (
          <button
            key={pattern.id}
            className={`pattern-card ${selectedPattern?.id === pattern.id ? 'is-selected' : ''}`}
            onClick={() => handleTestPattern(pattern)}
          >
            <div className="pattern-visual">
              <span className="pattern-full">{pattern.full}</span>
              <svg className="pattern-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4L10 16M10 16L6 12M10 16L14 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="pattern-partial">{pattern.partial}</span>
            </div>
            <div className="pattern-info">
              <span className="pattern-name">{pattern.name}</span>
              <span className="pattern-description">{pattern.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="custom-pattern">
        <h5>Custom Test</h5>
        <div className="custom-inputs">
          <select
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="custom-select"
          >
            <option value="">Select input...</option>
            {vocabulary.map((word) => (
              <option key={word} value={word}>
                {word}
              </option>
            ))}
          </select>

          <span className="arrow">→</span>

          <select
            value={customOutput}
            onChange={(e) => setCustomOutput(e.target.value)}
            className="custom-select"
          >
            <option value="">Expected output...</option>
            {vocabulary.map((word) => (
              <option key={word} value={word}>
                {word}
              </option>
            ))}
          </select>

          <button
            className="custom-test-btn"
            onClick={handleCustomTest}
            disabled={!customInput || !customOutput}
          >
            Test
          </button>
        </div>
      </div>

      <div className="demo-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7 10V7M7 4.5V4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>
          Pattern completion works best after teaching multiple associations.
          The network recalls based on strongest connections.
        </span>
      </div>
    </div>
  );
};
