import React from 'react';

interface CompetingMemoryPanelProps {
  input: string;
  firstOutput: string;
  secondOutput: string;
  firstWeight: number;
  secondWeight: number;
  predicted: string | null;
  margin: number | null;
  hasRecall: boolean;
}

export const CompetingMemoryPanel: React.FC<CompetingMemoryPanelProps> = ({
  input,
  firstOutput,
  secondOutput,
  firstWeight,
  secondWeight,
  predicted,
  margin,
  hasRecall,
}) => {
  const isAmbiguous = margin !== null && margin < 0.1;

  return (
    <section className="competition-panel">
      <div className="panel-kicker panel-kicker-amber">
        <span className="status-dot" />
        COMPETING MEMORY
      </div>
      <div className="competition-heading">
        <div>
          <h2>One cue. Two associations.</h2>
          <p>Strengthen the second path and watch the actual margin change.</p>
        </div>
        <span className="competition-mark">↙ ↘</span>
      </div>

      <div className="competition-graph">
        <div className="competition-source">
          <span className="node-token node-token-source">{input}</span>
        </div>
        <div className="competition-branches">
          <div className="competition-branch">
            <span className="branch-line branch-line-blue" />
            <div className="branch-copy">
              <span>{firstOutput}</span>
              <strong>{firstWeight.toFixed(3)}</strong>
            </div>
          </div>
          <div className="competition-branch">
            <span className="branch-line branch-line-violet" />
            <div className="branch-copy">
              <span>{secondOutput}</span>
              <strong>{secondWeight.toFixed(3)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="comparison-footer">
        <div>
          <span className="why-label">CURRENT RECALL</span>
          <strong className="recall-result">{hasRecall ? predicted || 'No clear output' : 'Not tested yet'}</strong>
        </div>
        <div className="margin-readout">
          <span className="why-label">MARGIN</span>
          <strong>{margin === null ? '—' : margin.toFixed(3)}</strong>
        </div>
      </div>

      <div className={`competition-note ${isAmbiguous ? 'is-ambiguous' : ''}`}>
        <span>{isAmbiguous ? '!' : 'i'}</span>
        <p>
          {isAmbiguous
            ? 'The strengths are close, so recall is genuinely ambiguous. The model still chooses its actual highest-scoring output.'
            : 'Both connections can coexist in this toy model. Similar strengths create competition; this model does not implement biological forgetting.'}
        </p>
      </div>
    </section>
  );
};