import React from 'react';

export interface ConnectionFeedback {
  input: string;
  output: string;
  previousWeight: number;
  newWeight: number;
  deltaWeight: number;
  repetitions: number;
}

interface ConnectionInspectorProps {
  feedback: ConnectionFeedback | null;
  learningRate: number;
  selectedInput: string;
  selectedOutput: string;
  currentWeight: number;
  saturation: boolean;
}

export const ConnectionInspector: React.FC<ConnectionInspectorProps> = ({
  feedback,
  learningRate,
  selectedInput,
  selectedOutput,
  currentWeight,
  saturation,
}) => {
  const displayed = feedback ?? {
    input: selectedInput,
    output: selectedOutput,
    previousWeight: currentWeight,
    newWeight: currentWeight,
    deltaWeight: 0,
    repetitions: 0,
  };
  const hasResult = Boolean(feedback);

  return (
    <section className={`inspector-panel ${hasResult ? 'has-result' : ''}`}>
      <div className="panel-kicker">
        <span className="status-dot" />
        SYNAPSE READOUT
      </div>
      <div className="inspector-title-row">
        <div>
          <h2>{hasResult ? 'Connection strengthened' : 'Selected connection'}</h2>
          <p className="mono connection-path">
            {displayed.input} <span>→</span> {displayed.output}
          </p>
        </div>
        {saturation && <span className="status-tag">SATURATED</span>}
      </div>

      <div className="readout-grid">
        <div className="readout-cell">
          <span>BEFORE</span>
          <strong>{displayed.previousWeight.toFixed(3)}</strong>
        </div>
        <div className="readout-cell readout-cell-emphasis">
          <span>AFTER</span>
          <strong>{displayed.newWeight.toFixed(3)}</strong>
        </div>
        <div className="readout-cell">
          <span>Δw</span>
          <strong className={displayed.deltaWeight > 0 ? 'value-positive' : ''}>
            {displayed.deltaWeight >= 0 ? '+' : ''}
            {displayed.deltaWeight.toFixed(3)}
          </strong>
        </div>
      </div>

      <div className="strength-meter" aria-label={`Connection strength ${displayed.newWeight.toFixed(3)}`}>
        <div
          className="strength-meter-fill"
          style={{ width: `${Math.min(displayed.newWeight * 100, 100)}%` }}
        />
      </div>

      <div className="inspector-explanation">
        <span className="why-label">{hasResult ? 'WHY IT CHANGED' : 'NEXT UPDATE'}</span>
        <p>
          {hasResult
            ? `Repeated co-activation added ${Math.abs(displayed.deltaWeight).toFixed(3)} to this connection across ${displayed.repetitions} pulse${displayed.repetitions === 1 ? '' : 's'}.`
            : `With η = ${learningRate.toFixed(2)}, teaching this pair will use the live model state to update the connection.`}
        </p>
      </div>

      <details className="technical-detail">
        <summary>Technical detail</summary>
        <p className="mono">Δw = η × aᵢ × aⱼ</p>
        <p>
          The model activates both selected nodes during teaching. The displayed values come from
          the current network, including its clamp at 1.000.
        </p>
      </details>
    </section>
  );
};