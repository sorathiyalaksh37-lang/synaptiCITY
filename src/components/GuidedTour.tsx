import React from 'react';

interface GuidedTourProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ step, onNext, onSkip }) => {
  if (step === 0 || step > 4) return null;

  const steps = [
    {
      title: "Welcome to synaptiCITY",
      content: "Below is a resting neural network. Notice that all connections are thin and grey. The network hasn't learned any strong associations yet.",
      action: "Next: Teach an association"
    },
    {
      title: "Neurons that fire together, wire together",
      content: "Let's teach the network that a DOG is an ANIMAL. We've pre-filled the teaching panel below. Click 'Teach Association' to send 3 learning pulses through the network, then click Next.",
      action: "Next: Test the memory"
    },
    {
      title: "Testing the Memory",
      content: "Now let's see what the network recalls when it sees the word DOG. We've pre-filled the recall panel. Click 'What does it recall?' to test the prediction, then click Next.",
      action: "Next: Create Interference"
    },
    {
      title: "Memory Interference",
      content: "What happens if we teach it another association for DOG? Change the teaching panel to DOG → PET, teach it 3 times, and then test recall again. Notice how the previous memory competes with the new one!",
      action: "Finish Tour"
    }
  ];

  const currentInfo = steps[step - 1];

  return (
    <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 border border-blue-400/40 rounded-lg p-6 shadow-lg mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
        <div 
          className="h-full bg-blue-400 transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <span className="text-blue-300 text-sm font-bold tracking-wider uppercase mb-1 block">
            Step {step} of 4
          </span>
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentInfo.title}
          </h2>
          <p className="text-gray-200 text-lg max-w-3xl">
            {currentInfo.content}
          </p>
        </div>
        <button 
          onClick={onSkip}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Skip Tour
        </button>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded shadow-lg transition-colors"
        >
          {currentInfo.action}
        </button>
      </div>
    </div>
  );
};
