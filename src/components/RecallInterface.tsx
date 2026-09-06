import React from 'react';

export interface RecallSnapshotView {
  input: string;
  predicted: string;
  connectionStrength: number;
  allScores: Map<string, number>;
}

interface RecallInterfaceProps {
  vocabulary: string[];
  input: string;
  result: RecallSnapshotView | null;
  onInputChange: (value: string) => void;
  onRecall: (inputWord: string) => void;
  disabled?: boolean;
}

export const RecallInterface: React.FC<RecallInterfaceProps> = ({
  vocabulary,
  input,
  result,
  onInputChange,
  onRecall,
  disabled = false,
}) => {
  const scores = result
    ? Array.from(result.allScores.entries()).sort(([, first], [, second]) => second - first)
    : [];
  const margin = scores.length > 1 ? Math.abs(scores[0][1] - scores[1][1]) : null;
  const ambiguous = margin !== null && margin < 0.1;

  return (
    <section className="recall-panel">
      <div className="panel-heading-row">
        <div>
          <span className="panel-kicker panel-kicker-green">ACTION / RECALL</span>
          <h2>Ask the network.</h2>
        </div>
        <span className="action-index">02</span>
      </div>
      <p className="panel-intro">Activate one cue and see which connection currently wins.</p>

      <div className="recall-picker">
        <span className="choice-label">CUE NODE</span>
        <select value={input} onChange={(event) => onInputChange(event.target.value)} disabled={disabled}>
          {vocabulary.map((word) => <option key={word}>{word}</option>)}
        </select>
        <button className="secondary-action" onClick={() => onRecall(input)} disabled={disabled || !input}>
          RECALL <span>↗</span>
        </button>
      </div>

      {result ? (
        <div className="recall-result">
          <div className="result-main">
            <span className="choice-label">CURRENT PREDICTION</span>
            <strong>{result.predicted || 'NO OUTPUT'}</strong>
            <span className={`result-state ${ambiguous ? 'is-ambiguous' : ''}`}>
              {ambiguous ? 'AMBIGUOUS MARGIN' : 'HIGHEST LIVE SCORE'}
            </span>
          </div>
          <div className="confidence-block">
            <span className="choice-label">CONFIDENCE</span>
            <strong className="mono">{result.connectionStrength.toFixed(3)}</strong>
          </div>
          <div className="score-list">
            {scores.filter(([, score]) => score > 0.01).map(([word, score], index) => (
              <div className={`score-row ${index === 0 ? 'is-leading' : ''}`} key={word}>
                <span>{result.input} → {word}</span>
                <span className="mono">{score.toFixed(3)}</span>
              </div>
            ))}
            {scores.filter(([, score]) => score > 0.01).length === 0 && (
              <p className="empty-note">No strong learned associations yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="awaiting-result">
          <span className="awaiting-glyph">?</span>
          <p>Recall is waiting for a cue. The answer will be the model’s, not a scripted example.</p>
        </div>
      )}
    </section>
  );
};