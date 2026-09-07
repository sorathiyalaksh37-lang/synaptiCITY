import React from 'react';
import type { LearningRuleType } from '../lib/LearningRules';
import { EnhancedTooltip } from './EnhancedTooltip';

interface LearningRuleSelectorProps {
  currentRule: LearningRuleType;
  onRuleChange: (rule: LearningRuleType) => void;
  forgettingEnabled: boolean;
  forgettingRate: number;
  onForgettingToggle: () => void;
  onForgettingRateChange: (rate: number) => void;
}

const RULES: Array<{
  id: LearningRuleType;
  name: string;
  formula: string;
  description: string;
}> = [
  {
    id: 'hebbian',
    name: 'Hebbian',
    formula: 'Δw = η × aᵢ × aⱼ',
    description: 'Cells that fire together, wire together. Simple and classic.',
  },
  {
    id: 'stdp',
    name: 'STDP',
    formula: 'Δw = A± × exp(-Δt/τ±)',
    description: 'Spike-timing dependent. Timing matters: pre→post strengthens, post→pre weakens.',
  },
  {
    id: 'bcm',
    name: 'BCM',
    formula: 'Δw = η × aⱼ × aᵢ × (aⱼ - θ)',
    description: 'Self-regulating with sliding threshold. Prevents runaway growth.',
  },
  {
    id: 'oja',
    name: "Oja's Rule",
    formula: 'Δw = η × aⱼ × (aᵢ - β × aⱼ × w)',
    description: 'Normalized Hebbian. Keeps total synaptic strength bounded.',
  },
];

export const LearningRuleSelector: React.FC<LearningRuleSelectorProps> = ({
  currentRule,
  onRuleChange,
  forgettingEnabled,
  forgettingRate,
  onForgettingToggle,
  onForgettingRateChange,
}) => {
  return (
    <div className="learning-rule-selector">
      <div className="selector-header">
        <h4>Learning Rule</h4>
        <EnhancedTooltip
          content={
            <div>
              <strong>Learning rules</strong> define how connections strengthen.
              <br />
              Try different rules to see how they affect learning dynamics.
            </div>
          }
        >
          <span className="info-icon">?</span>
        </EnhancedTooltip>
      </div>

      <div className="rule-options">
        {RULES.map((rule) => (
          <button
            key={rule.id}
            className={`rule-option ${currentRule === rule.id ? 'is-active' : ''}`}
            onClick={() => onRuleChange(rule.id)}
          >
            <div className="rule-header">
              <span className="rule-name">{rule.name}</span>
              {currentRule === rule.id && <span className="rule-badge">ACTIVE</span>}
            </div>
            <code className="rule-formula">{rule.formula}</code>
            <p className="rule-description">{rule.description}</p>
          </button>
        ))}
      </div>

      <div className="forgetting-section">
        <div className="forgetting-header">
          <label className="forgetting-label">
            <input
              type="checkbox"
              checked={forgettingEnabled}
              onChange={onForgettingToggle}
              className="forgetting-checkbox"
            />
            <span>Enable Forgetting</span>
          </label>
          <EnhancedTooltip
            content={
              <div>
                <strong>Synaptic decay</strong> simulates memory fading.
                <br />
                Unused connections gradually weaken over time.
              </div>
            }
          >
            <span className="info-icon">?</span>
          </EnhancedTooltip>
        </div>

        {forgettingEnabled && (
          <div className="forgetting-controls">
            <label className="slider-label">
              Decay Rate: {(forgettingRate * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.01"
              max="0.10"
              step="0.01"
              value={forgettingRate}
              onChange={(e) => onForgettingRateChange(parseFloat(e.target.value))}
              className="forgetting-slider"
            />
            <div className="slider-markers">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
