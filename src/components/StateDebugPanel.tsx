import React, { useState } from 'react';

interface StateDebugPanelProps {
  weights: number[][];
  vocabulary: string[];
  activations: number[];
}

export const StateDebugPanel: React.FC<StateDebugPanelProps> = ({
  weights,
  vocabulary,
  activations
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCellColor = (weight: number): string => {
    if (weight < 0.1) return 'bg-gray-800';
    if (weight < 0.3) return 'bg-red-900';
    if (weight < 0.5) return 'bg-orange-900';
    return 'bg-green-900';
  };

  return (
    <section className="debug-panel">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="debug-toggle"
        aria-expanded={isExpanded}
        aria-controls="debug-panel-content"
      >
        <span><span className="panel-kicker">TECHNICAL DETAIL</span><strong>State snapshot</strong></span>
        <span className="debug-chevron">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div id="debug-panel-content" className="debug-content">
          {/* Weight Matrix */}
          <div>
            <h3>Weight matrix</h3>
            <div className="overflow-x-auto">
              <table className="text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-600 px-2 py-1 bg-gray-700"></th>
                    {vocabulary.map((word) => (
                      <th key={word} className="border border-gray-600 px-2 py-1 bg-gray-700 text-white">
                        {word}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vocabulary.map((fromWord, i) => (
                    <tr key={fromWord}>
                      <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-white">
                        {fromWord}
                      </th>
                      {vocabulary.map((toWord, j) => (
                        <td
                          key={`${fromWord}-${toWord}`}
                          className={`border border-gray-600 px-2 py-1 text-center ${getCellColor(weights[i][j])}`}
                          title={`${fromWord} → ${toWord}: ${weights[i][j].toFixed(3)}`}
                        >
                          <span className="text-white">
                            {weights[i][j].toFixed(2)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activations */}
          <div>
            <h3>Current activations</h3>
            <div className="activation-grid">
              {vocabulary.map((word, i) => (
                <div
                  key={word}
                    className={`activation-cell ${
                    activations[i] > 0 ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span className="text-white font-medium">{word}</span>
                  <span className="text-gray-300 ml-2 text-sm">
                    {activations[i].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Legend */}
          <div>
            <h3>Weight legend</h3>
            <div className="debug-legend">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded"></div>
                <span className="text-gray-300">&lt; 0.1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-900 border border-gray-600 rounded"></div>
                <span className="text-gray-300">0.1-0.3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-900 border border-gray-600 rounded"></div>
                <span className="text-gray-300">0.3-0.5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-900 border border-gray-600 rounded"></div>
                <span className="text-gray-300">&gt; 0.5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
