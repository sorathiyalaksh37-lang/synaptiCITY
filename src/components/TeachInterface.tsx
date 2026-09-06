import React from 'react';
import type { Association } from '../types';

interface TeachInterfaceProps {
  vocabulary: string[];
  input: string;
  output: string;
  selectionFocus: 'input' | 'output';
  repetitions: number;
  currentWeight: number;
  learningRate: number;
  onInputChange: (value: string) => void;
  onOutputChange: (value: string) => void;
  onFocusSelection: (focus: 'input' | 'output') => void;
  onRepetitionsChange: (value: number) => void;
  onTeach: (association: Association, repetitions: number) => void;
  disabled?: boolean;
}

export const TeachInterface: React.FC<TeachInterfaceProps> = ({
  vocabulary,
  input,
  output,
  selectionFocus,
  repetitions,
  currentWeight,
  learningRate,
  onInputChange,
  onOutputChange,
  onFocusSelection,
  onRepetitionsChange,
  onTeach,
  disabled = false,
}) => {
  const projectedWeight = Math.min(1, currentWeight + learningRate * repetitions);
  const projectedDelta = projectedWeight - currentWeight;

  return (
    <section className="teach-panel">
      <div className="panel-heading-row">
        <div>
          <span className="panel-kicker">ACTION / TEACH</span>
          <h2>Fire together.</h2>
        </div>
        <span className="action-index">01</span>
      </div>
      <p className="panel-intro">Select two nodes to create or strengthen a directed association.</p>

      <div className="association-picker">
        <button
          className={`node-choice ${selectionFocus === 'input' ? 'is-focused' : ''}`}
          onClick={() => onFocusSelection('input')}
          disabled={disabled}
        >
          <span className="choice-label">SOURCE</span>
          <strong>{input}</strong>
          <small>pre-synaptic</small>
        </button>
        <span className="association-arrow">→</span>
        <button
          className={`node-choice node-choice-target ${selectionFocus === 'output' ? 'is-focused' : ''}`}
          onClick={() => onFocusSelection('output')}
          disabled={disabled}
        >
          <span className="choice-label">TARGET</span>
          <strong>{output}</strong>
          <small>post-synaptic</small>
        </button>
      </div>

      <div className="select-row">
        <label>
          <span>Source node</span>
          <select value={input} onChange={(event) => onInputChange(event.target.value)} disabled={disabled}>
            {vocabulary.map((word) => <option key={word}>{word}</option>)}
          </select>
        </label>
        <label>
          <span>Target node</span>
          <select value={output} onChange={(event) => onOutputChange(event.target.value)} disabled={disabled}>
            {vocabulary.filter((word) => word !== input).map((word) => <option key={word}>{word}</option>)}
          </select>
        </label>
      </div>

      <div className="repetition-control">
        <div className="range-label">
          <span>Teaching pulses</span>
          <strong className="mono">{repetitions.toString().padStart(2, '0')}</strong>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={repetitions}
          onChange={(event) => onRepetitionsChange(Number(event.target.value))}
          disabled={disabled}
          aria-label="Teaching pulses"
        />
        <div className="range-scale"><span>01</span><span>10</span></div>
      </div>

      <div className="preview-readout">
        <span>PROJECTED Δw</span>
        <strong className="mono">+{projectedDelta.toFixed(3)}</strong>
        <small>{currentWeight.toFixed(3)} → {projectedWeight.toFixed(3)} at η = {learningRate.toFixed(2)}</small>
      </div>

      <button
        className="primary-action"
        onClick={() => onTeach({ input, output }, repetitions)}
        disabled={disabled || !input || !output || input === output}
      >
        <span>{disabled ? 'COMPUTATION IN PROGRESS' : 'TEACH ASSOCIATION'}</span>
        <span>↗</span>
      </button>
    </section>
  );
};