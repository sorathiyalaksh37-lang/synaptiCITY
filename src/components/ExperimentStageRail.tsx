import React from 'react';

export interface ExperimentStage {
  id: number;
  label: string;
  detail: string;
}

interface ExperimentStageRailProps {
  stages: ExperimentStage[];
  activeStage: number;
  completedStages: number[];
  onSelect: (stage: number) => void;
}

export const ExperimentStageRail: React.FC<ExperimentStageRailProps> = ({
  stages,
  activeStage,
  completedStages,
  onSelect,
}) => (
  <nav className="stage-rail" aria-label="Experiment stages">
    <div className="stage-rail-heading">
      <span className="eyebrow">LEARNER JOURNEY</span>
      <span className="stage-count">
        {completedStages.length} / {stages.length} observed
      </span>
    </div>

    <div className="stage-list">
      {stages.map((stage) => {
        const isActive = stage.id === activeStage;
        const isComplete = completedStages.includes(stage.id);

        return (
          <button
            key={stage.id}
            className={`stage-item ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`}
            onClick={() => onSelect(stage.id)}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="stage-number">
              {isComplete ? '✓' : String(stage.id).padStart(2, '0')}
            </span>
            <span className="stage-copy">
              <strong>{stage.label}</strong>
              <small>{stage.detail}</small>
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);