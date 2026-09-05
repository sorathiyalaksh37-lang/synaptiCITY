import React, { useState } from 'react';

interface RecallInterfaceProps {
  vocabulary: string[];
  onRecall: (inputWord: string) => {
    predicted: string;
    confidence: number;
  };
  disabled?: boolean;
}

export const RecallInterface: React.FC<RecallInterfaceProps> = ({
  vocabulary,
  onRecall,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    predicted: string;
    confidence: number;
  } | null>(null);

  const handleRecall = () => {
    if (input) {
      const recallResult = onRecall(input.toUpperCase());
      setResult(recallResult);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      handleRecall();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 0.2) return 'text-red-400';
    if (confidence < 0.5) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Test Recall</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="recall-input"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Input Word
          </label>

          <select
            id="recall-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setResult(null);
            }}
            disabled={disabled}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            aria-label="Select word to recall"
          >
            <option value="">Select...</option>

            {vocabulary.map(word => (
              <option key={word} value={word}>
                {word}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRecall}
          disabled={disabled || !input}
          onKeyPress={handleKeyPress}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          aria-label="Test recall"
        >
          What does it recall?
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-900 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Input:</span>
              <span className="text-white font-semibold">{input}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Prediction:</span>
              <span
                className={`font-semibold ${result.predicted ? 'text-blue-400' : 'text-gray-500'
                  }`}
              >
                {result.predicted || 'Nothing'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Confidence:</span>
              <span
                className={`font-semibold ${getConfidenceColor(
                  result.confidence
                )}`}
              >
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>

            {result.confidence >= 0.45 &&
              result.confidence <= 0.55 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-start gap-2 text-yellow-400">
                    <span className="text-xl">⚠️</span>

                    <div>
                      <p className="font-semibold">Ambiguous Memory</p>

                      <p className="text-sm text-gray-400 mt-1">
                        Multiple learned associations have similar strengths,
                        so the network's current prediction is not clearly
                        dominant.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-900 rounded text-sm text-gray-300">
        <p className="font-semibold mb-2">💡 Testing Memory:</p>

        <p>
          The network compares the learned connection strengths from the input
          word and selects its strongest association. When several connections
          have similar strengths, recall can become ambiguous.
        </p>
      </div>
    </div>
  );
};