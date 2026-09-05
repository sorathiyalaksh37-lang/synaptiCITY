import React, { useState, useEffect } from 'react';

interface RecallInterfaceProps {
  vocabulary: string[];
  onRecall: (inputWord: string) => {
    predicted: string;
    connectionStrength: number;
    allScores: Map<string, number>;
  };
  disabled?: boolean;
  suggestedInput?: string;
}

export const RecallInterface: React.FC<RecallInterfaceProps> = ({
  vocabulary,
  onRecall,
  disabled = false,
  suggestedInput
}) => {
  const [input, setInput] = useState(suggestedInput || '');
  const [result, setResult] = useState<{
    predicted: string;
    connectionStrength: number;
    allScores: Map<string, number>;
  } | null>(null);

  useEffect(() => {
    if (suggestedInput) setInput(suggestedInput);
  }, [suggestedInput]);

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

  const getStrengthColor = (strength: number) => {
    if (strength < 0.2) return 'text-red-400';
    if (strength < 0.5) return 'text-yellow-400';
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
          <div className="mt-4 p-4 bg-gray-900 rounded space-y-4">
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
              <span className="text-gray-400">Connection Strength:</span>
              <span
                className={`font-semibold ${getStrengthColor(
                  result.connectionStrength
                )}`}
              >
                {result.connectionStrength.toFixed(3)}
              </span>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Learned Associations
              </p>

              <div className="space-y-2">
                {Array.from(result.allScores.entries())
                  .filter(([, score]) => score > 0.01)
                  .sort(([, a], [, b]) => b - a)
                  .map(([word, score]) => (
                    <div
                      key={word}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400">
                        {input} → {word}
                      </span>

                      <span
                        className={`font-semibold ${word === result.predicted
                            ? 'text-blue-400'
                            : 'text-gray-300'
                          }`}
                      >
                        {score.toFixed(3)}
                      </span>
                    </div>
                  ))}

                {Array.from(result.allScores.entries()).filter(
                  ([, score]) => score > 0.01
                ).length === 0 && (
                    <p className="text-sm text-gray-500">
                      No strong learned associations yet.
                    </p>
                  )}
              </div>
            </div>

            {(() => {
              const learnedAssociations = Array.from(
                result.allScores.entries()
              )
                .filter(([, score]) => score > 0.01)
                .sort(([, a], [, b]) => b - a);

              const isAmbiguous =
                learnedAssociations.length >= 2 &&
                Math.abs(
                  learnedAssociations[0][1] - learnedAssociations[1][1]
                ) < 0.1;

              if (!isAmbiguous) return null;

              return (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-start gap-2 text-yellow-400">
                    <span className="text-xl">⚠️</span>

                    <div>
                      <p className="font-semibold">Ambiguous Memory</p>

                      <p className="text-sm text-gray-400 mt-1">
                        Multiple learned associations have similar connection
                        strengths, so the network's current prediction is not
                        clearly dominant.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
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