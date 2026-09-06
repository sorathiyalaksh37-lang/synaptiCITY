import React from 'react';

interface ControlPanelProps {
  learningRate: number;
  onLearningRateChange: (rate: number) => void;
  onReset: () => void;
  disabled?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  learningRate,
  onLearningRateChange,
  onReset,
  disabled = false
}) => {
  return (
    <section className="control-panel">
      <div className="panel-heading-row">
        <div>
          <span className="panel-kicker">INSTRUMENT / PARAMETER</span>
          <h2>Learning rate</h2>
        </div>
        <span className="mono parameter-value">η {learningRate.toFixed(2)}</span>
      </div>

      <div>
        <label htmlFor="learning-rate" className="range-label">
          <span>How quickly the synapse changes</span>
        </label>
        <input
          id="learning-rate"
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
          value={learningRate}
          onChange={(e) => onLearningRateChange(Number(e.target.value))}
          disabled={disabled}
           className="instrument-range"
          aria-label="Learning rate parameter"
        />
        <div className="range-scale">
          <span>slow / 0.01</span>
          <span>fast / 0.50</span>
        </div>
        <p className="control-explanation">
          Controls how quickly connections strengthen. Higher = faster learning, but each teaching step changes the connection more strongly.
        </p>
      </div>

      <button
        onClick={onReset}
        disabled={disabled}
        className="reset-action"
        aria-label="Reset network"
      >
        <span>Reset experiment</span><span>↺</span>
      </button>

      <details className="technical-detail">
        <summary>Read the rule</summary>
        <p className="mono">Δw = η × aᵢ × aⱼ</p>
        <p>η is the learning rate. aᵢ and aⱼ are the live activations of the selected nodes.</p>
      </details>
    </section>
  );
};
