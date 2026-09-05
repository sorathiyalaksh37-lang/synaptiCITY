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
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Controls</h2>

      <div>
        <label htmlFor="learning-rate" className="block text-sm font-medium text-gray-300 mb-2">
          Learning Rate (η): {learningRate.toFixed(2)}
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
          className="w-full"
          aria-label="Learning rate parameter"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Slow (0.01)</span>
          <span>Fast (0.5)</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Controls how quickly connections strengthen. Higher = faster learning, but each teaching step changes the connection more strongly.
        </p>
      </div>

      <button
        onClick={onReset}
        disabled={disabled}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        aria-label="Reset network"
      >
        Reset Network
      </button>

      <div className="mt-4 p-4 bg-gray-900 rounded text-sm text-gray-300">
        <p className="font-semibold mb-2">🧠 Hebbian Learning Rule:</p>
        <p className="font-mono text-xs mb-2">Δw = η × aᵢ × aⱼ</p>
        <ul className="text-xs space-y-1">
          <li>• Δw = change in connection weight</li>
          <li>• η = learning rate (eta)</li>
          <li>• aᵢ = activation of neuron i</li>
          <li>• aⱼ = activation of neuron j</li>
        </ul>
      </div>
    </div>
  );
};
