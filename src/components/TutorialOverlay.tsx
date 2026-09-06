import React, { useState, useEffect } from 'react';

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to synaptiCITY!',
    content: 'An interactive simulation showing how neural connections create memory through Hebbian learning.',
    position: 'bottom',
  },
  {
    id: 2,
    title: 'The Neural Network',
    content: 'These nodes represent words. Connections between them show learned associations. Thicker lines = stronger connections.',
    target: '.neural-grid',
    position: 'right',
  },
  {
    id: 3,
    title: 'Teaching the Network',
    content: 'Select two words and click "Teach" to strengthen their connection. This implements the Hebbian rule: Δw = η × aᵢ × aⱼ',
    target: '.teach-panel',
    position: 'left',
  },
  {
    id: 4,
    title: 'Testing Recall',
    content: 'After teaching, test if the network can recall associations. It will predict the most strongly connected word.',
    target: '.recall-panel',
    position: 'left',
  },
  {
    id: 5,
    title: 'Competing Memories',
    content: 'Teach multiple associations from one word (e.g., DOG → ANIMAL and DOG → PET) to see how memories compete.',
    target: '.competition-panel',
    position: 'top',
  },
  {
    id: 6,
    title: 'Ready to Explore!',
    content: 'Click "Start the Ride" to begin the guided experiment, or explore freely. Have fun learning!',
    position: 'bottom',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('synapticity_tutorial_completed');
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    localStorage.setItem('synapticity_tutorial_completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-backdrop" onClick={handleSkip} />
      
      <div className="tutorial-spotlight">
        <div className="tutorial-card">
          <div className="tutorial-header">
            <span className="tutorial-step">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </span>
            <button
              className="tutorial-close"
              onClick={handleSkip}
              aria-label="Close tutorial"
            >
              ✕
            </button>
          </div>

          <div className="tutorial-content">
            <h3 className="tutorial-title">{step.title}</h3>
            <p className="tutorial-text">{step.content}</p>
          </div>

          <div className="tutorial-progress">
            <div
              className="tutorial-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="tutorial-actions">
            <button
              className="tutorial-btn tutorial-btn-secondary"
              onClick={handleSkip}
            >
              Skip Tutorial
            </button>
            
            <div className="tutorial-nav">
              {currentStep > 0 && (
                <button
                  className="tutorial-btn tutorial-btn-ghost"
                  onClick={handlePrevious}
                >
                  ← Previous
                </button>
              )}
              
              <button
                className="tutorial-btn tutorial-btn-primary"
                onClick={handleNext}
              >
                {currentStep < TUTORIAL_STEPS.length - 1 ? 'Next →' : 'Get Started!'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
