import React from 'react';

interface GuidedTourProps {
  step: number;
  completedStages: number[];
  onNext: () => void;
  onSkip: () => void;
}

const stageCopy = [
  {
    kicker: 'STAGE 01 / OBSERVE',
    title: 'Make a connection',
    content: 'Choose DOG as the source and ANIMAL as the target. Send one or more teaching pulses and watch the actual edge appear.',
    action: 'Move to strengthening',
  },
  {
    kicker: 'STAGE 02 / REPEAT',
    title: 'Strengthen it',
    content: 'Repeat the same co-activation. The line is not a metaphor: its weight, thickness, and Δw are read from the model.',
    action: 'Move to recall',
  },
  {
    kicker: 'STAGE 03 / PREDICT',
    title: 'Test memory',
    content: 'Recall DOG. The network compares every outgoing score and returns its actual highest-scoring association.',
    action: 'Create competition',
  },
  {
    kicker: 'STAGE 04 / COMPETE',
    title: 'Create competition',
    content: 'Teach DOG → PET. Both paths are kept visible so you can compare their real strengths instead of being handed a scripted result.',
    action: 'Explore the limitation',
  },
  {
    kicker: 'STAGE 05 / QUESTION',
    title: 'Explore the limitation',
    content: 'Strengthen the competing path and recall again. Similar strengths can make the result ambiguous; this toy model does not implement biological forgetting.',
    action: 'Restart experiment',
  },
];

export const GuidedTour: React.FC<GuidedTourProps> = ({
  step,
  completedStages,
  onNext,
  onSkip,
}) => {
  const current = stageCopy[Math.max(0, Math.min(step - 1, stageCopy.length - 1))];
  const isComplete = completedStages.includes(step);

  return (
    <section className="stage-brief">
      <div className="stage-brief-marker">
        <span>{current.kicker}</span>
        <span className={isComplete ? 'brief-complete' : ''}>{isComplete ? 'OBSERVED ✓' : 'READY'}</span>
      </div>
      <div className="stage-brief-body">
        <div>
          <h2>{current.title}</h2>
          <p>{current.content}</p>
        </div>
        <div className="stage-brief-actions">
          <button className="text-button" onClick={onSkip}>Reset view</button>
          <button className="outline-button" onClick={onNext}>
            {step === 5 ? 'Back to stage 01' : current.action} <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};