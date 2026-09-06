import React from 'react';

interface GuidedTourProps {
  step: number;
  completedStages: number[];
  onNext: () => void;
  onSkip: () => void;
}

const completionLabels: Record<number, string> = {
  1: '✓ CONNECTION FORMED',
  2: '✓ CONNECTION STRENGTHENED',
  3: '✓ MEMORY RECALLED',
  4: '✓ SECOND PATH FORMED',
  5: '✓ COMPETING PATHS TESTED',
};

const stageCopy = [
  {
    step: 1,
    kicker: 'STAGE 01 / OBSERVE',
    title: 'Make a connection',
    content: 'Choose DOG as the source and ANIMAL as the target. Send a teaching pulse to form the synapse.',
    nextActionPrompt: 'Teach DOG → ANIMAL once to form your first connection.',
    action: 'Move to strengthening',
  },
  {
    step: 2,
    kicker: 'STAGE 02 / REPEAT',
    title: 'Strengthen it',
    content: 'Repeat the co-activation for DOG → ANIMAL. Watch the synapse weight and line thickness increase.',
    nextActionPrompt: 'Teach the same DOG → ANIMAL pair again to strengthen the connection.',
    action: 'Move to recall',
  },
  {
    step: 3,
    kicker: 'STAGE 03 / PREDICT',
    title: 'Test memory',
    content: 'Trigger recall on DOG. The network evaluates outgoing connection strengths to predict the associated word.',
    nextActionPrompt: 'Now recall DOG and see which learned association is retrieved.',
    action: 'Create competition',
  },
  {
    step: 4,
    kicker: 'STAGE 04 / COMPETE',
    title: 'Add a second path',
    content: 'Teach a second association: DOG → PET. You now have two learned paths from DOG (DOG → ANIMAL and DOG → PET).',
    nextActionPrompt: 'Create a second path: teach DOG → PET.',
    action: 'Explore the limitation',
  },
  {
    step: 5,
    kicker: 'STAGE 05 / QUESTION',
    title: 'Test competing paths',
    content: 'Recall DOG again. The network selects whichever learned path has the higher weight. Recall selects the strongest learned path.',
    nextActionPrompt: 'Recall DOG again and compare the competing learned paths.',
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
  const completionText = completionLabels[step] || '✓ COMPLETED';

  return (
    <section className="stage-brief" aria-live="polite">
      <div className="stage-brief-marker">
        <span>{current.kicker}</span>
        <span className={isComplete ? 'brief-complete font-mono font-bold' : 'font-mono'}>
          {isComplete ? completionText : 'READY'}
        </span>
      </div>
      <div className="stage-brief-body">
        <div>
          <h2>{current.title}</h2>
          <p>{current.content}</p>

          <div className="mt-3 p-3 rounded border border-cyan-500/30 bg-slate-950/60 font-mono text-xs text-cyan-300 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">NEXT ACTION →</span>
            <span>{current.nextActionPrompt}</span>
          </div>
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