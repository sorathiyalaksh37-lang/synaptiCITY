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
        const highestCompletedStage = completedStages.length > 0 ? Math.max(...completedStages) : 0;
        const isLocked = stage.id > highestCompletedStage + 1;

        return (
          <button
            key={stage.id}
            className={`stage-item ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => onSelect(stage.id)}
            aria-current={isActive ? 'step' : undefined}
            disabled={isLocked}
            aria-disabled={isLocked}
          >
            <span className="stage-number">
              {isLocked ? '🔒' : (isComplete ? '✓' : String(stage.id).padStart(2, '0'))}
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