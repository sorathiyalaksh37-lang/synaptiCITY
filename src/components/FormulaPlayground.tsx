import React, { useState } from 'react';

interface Formula {
  id: string;
  name: string;
  latex: string;
  description: string;
  variables: Array<{
    symbol: string;
    name: string;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
  }>;
  calculate: (vars: Record<string, number>) => number;
}

const FORMULAS: Formula[] = [
  {
    id: 'hebbian',
    name: 'Hebbian Learning',
    latex: 'Δw = η × aᵢ × aⱼ',
    description: 'Change in weight equals learning rate times pre-synaptic and post-synaptic activations',
    variables: [
      { symbol: 'η', name: 'Learning Rate', defaultValue: 0.1, min: 0, max: 1, step: 0.01 },
      { symbol: 'aᵢ', name: 'Pre-synaptic Activation', defaultValue: 1, min: 0, max: 1, step: 0.1 },
      { symbol: 'aⱼ', name: 'Post-synaptic Activation', defaultValue: 1, min: 0, max: 1, step: 0.1 },
    ],
    calculate: (vars) => vars['η'] * vars['aᵢ'] * vars['aⱼ'],
  },
  {
    id: 'stdp-potentiation',
    name: 'STDP Potentiation',
    latex: 'Δw = A₊ × exp(-Δt/τ₊)',
    description: 'Weight change when pre-synaptic spike occurs before post-synaptic',
    variables: [
      { symbol: 'A₊', name: 'Potentiation Amplitude', defaultValue: 0.01, min: 0, max: 0.1, step: 0.001 },
      { symbol: 'Δt', name: 'Time Difference (ms)', defaultValue: 10, min: 0, max: 100, step: 1 },
      { symbol: 'τ₊', name: 'Time Constant', defaultValue: 20, min: 1, max: 100, step: 1 },
    ],
    calculate: (vars) => vars['A₊'] * Math.exp(-vars['Δt'] / vars['τ₊']),
  },
  {
    id: 'bcm',
    name: 'BCM Rule',
    latex: 'Δw = η × aⱼ × aᵢ × (aⱼ - θ)',
    description: 'Bienenstock-Cooper-Munro learning with sliding modification threshold',
    variables: [
      { symbol: 'η', name: 'Learning Rate', defaultValue: 0.1, min: 0, max: 1, step: 0.01 },
      { symbol: 'aᵢ', name: 'Pre-synaptic Activation', defaultValue: 1, min: 0, max: 1, step: 0.1 },
      { symbol: 'aⱼ', name: 'Post-synaptic Activation', defaultValue: 0.8, min: 0, max: 1, step: 0.1 },
      { symbol: 'θ', name: 'Threshold', defaultValue: 0.5, min: 0, max: 1, step: 0.1 },
    ],
    calculate: (vars) => vars['η'] * vars['aⱼ'] * vars['aᵢ'] * (vars['aⱼ'] - vars['θ']),
  },
  {
    id: 'weight-decay',
    name: 'Weight Decay',
    latex: 'w_new = w × (1 - λ)',
    description: 'Exponential decay of synaptic weights over time',
    variables: [
      { symbol: 'w', name: 'Current Weight', defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
      { symbol: 'λ', name: 'Decay Rate', defaultValue: 0.02, min: 0, max: 0.5, step: 0.01 },
    ],
    calculate: (vars) => vars['w'] * (1 - vars['λ']),
  },
];

export const FormulaPlayground: React.FC = () => {
  const [selectedFormula, setSelectedFormula] = useState<Formula>(FORMULAS[0]);
  const [variables, setVariables] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    FORMULAS[0].variables.forEach((v) => {
      initial[v.symbol] = v.defaultValue;
    });
    return initial;
  });

  const handleFormulaChange = (formula: Formula) => {
    setSelectedFormula(formula);
    const newVars: Record<string, number> = {};
    formula.variables.forEach((v) => {
      newVars[v.symbol] = v.defaultValue;
    });
    setVariables(newVars);
  };

  const handleVariableChange = (symbol: string, value: number) => {
    setVariables((prev) => ({ ...prev, [symbol]: value }));
  };

  const result = selectedFormula.calculate(variables);

  return (
    <div className="formula-playground">
      <div className="playground-header">
        <h4>Formula Playground</h4>
        <p className="playground-subtitle">
          Experiment with learning formulas. Adjust variables and see results in real-time.
        </p>
      </div>

      <div className="formula-selector">
        {FORMULAS.map((formula) => (
          <button
            key={formula.id}
            className={`formula-option ${selectedFormula.id === formula.id ? 'is-active' : ''}`}
            onClick={() => handleFormulaChange(formula)}
          >
            {formula.name}
          </button>
        ))}
      </div>

      <div className="formula-display">
        <div className="formula-card">
          <code className="formula-latex">{selectedFormula.latex}</code>
          <p className="formula-desc">{selectedFormula.description}</p>
        </div>
      </div>

      <div className="variables-panel">
        <h5>Variables</h5>
        <div className="variables-grid">
          {selectedFormula.variables.map((variable) => (
            <div key={variable.symbol} className="variable-control">
              <div className="variable-header">
                <label className="variable-label">
                  <code className="variable-symbol">{variable.symbol}</code>
                  <span className="variable-name">{variable.name}</span>
                </label>
                <span className="variable-value">
                  {variables[variable.symbol]?.toFixed(variable.step < 0.01 ? 3 : 2)}
                </span>
              </div>
              <input
                type="range"
                min={variable.min}
                max={variable.max}
                step={variable.step}
                value={variables[variable.symbol] || variable.defaultValue}
                onChange={(e) => handleVariableChange(variable.symbol, parseFloat(e.target.value))}
                className="variable-slider"
              />
              <div className="slider-bounds">
                <span>{variable.min}</span>
                <span>{variable.max}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="result-panel">
        <div className="result-label">Result</div>
        <div className="result-value">
          <span className="result-symbol">Δw =</span>
          <span className={`result-number ${result > 0 ? 'positive' : result < 0 ? 'negative' : 'zero'}`}>
            {result.toFixed(4)}
          </span>
        </div>
        <div className="result-interpretation">
          {result > 0 && '✓ Weight increases (strengthening)'}
          {result < 0 && '✗ Weight decreases (weakening)'}
          {result === 0 && '○ No change'}
        </div>
      </div>

      <div className="playground-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10V7M7 4.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>
          Adjust sliders to see how different parameters affect learning.
          Positive values strengthen connections, negative values weaken them.
        </span>
      </div>
    </div>
  );
};
