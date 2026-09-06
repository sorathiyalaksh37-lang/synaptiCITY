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
    if (weight < 0.1) return 'bg-slate-900/60 text-slate-500 border-slate-800/60';
    if (weight < 0.3) return 'bg-rose-950/50 text-rose-300 border-rose-900/40';
    if (weight < 0.5) return 'bg-amber-950/50 text-amber-300 border-amber-900/40';
    return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50 font-bold';
  };

  return (
    <section className="debug-panel">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="debug-toggle"
        aria-expanded={isExpanded}
        aria-controls="debug-panel-content"
      >
        <span>
          <span className="panel-kicker">TECHNICAL DETAIL</span>
          <strong>State snapshot</strong>
        </span>
        <span className="debug-chevron">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div id="debug-panel-content" className="debug-content space-y-6 pt-4">
          {/* Weight Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Weight matrix</h3>
            <div className="overflow-x-auto rounded border border-slate-800/80 bg-slate-950/40 p-3">
              <table className="text-xs font-mono border-collapse w-full">
                <thead>
                  <tr>
                    <th className="border border-slate-800/80 px-2.5 py-1.5 bg-slate-900/90 text-slate-400 text-left"></th>
                    {vocabulary.map((word) => (
                      <th key={word} className="border border-slate-800/80 px-2.5 py-1.5 bg-slate-900/90 text-cyan-300 text-center font-semibold">
                        {word}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vocabulary.map((fromWord, i) => (
                    <tr key={fromWord}>
                      <th className="border border-slate-800/80 px-2.5 py-1.5 bg-slate-900/90 text-cyan-300 font-semibold text-left">
                        {fromWord}
                      </th>
                      {vocabulary.map((toWord, j) => (
                        <td
                          key={`${fromWord}-${toWord}`}
                          className={`border px-2.5 py-1.5 text-center transition-colors ${getCellColor(weights[i][j])}`}
                          title={`${fromWord} → ${toWord}: ${weights[i][j].toFixed(3)}`}
                        >
                          <span>
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
          <div className="space-y-2">
            <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Current activations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {vocabulary.map((word, i) => (
                <div
                  key={word}
                  className={`flex items-center justify-between px-3 py-2 rounded border font-mono transition-all ${
                    activations[i] > 0
                      ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200 shadow-[0_0_12px_rgba(112,232,223,0.15)]'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <span className="font-semibold text-xs">{word}</span>
                  <span className="text-xs ml-2 opacity-80">
                    {activations[i].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Legend */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Weight legend</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-slate-950/40 border border-slate-800/80 rounded p-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-900/60 border border-slate-800/60 rounded"></div>
                <span className="text-slate-400">&lt; 0.1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-rose-950/50 border border-rose-900/40 rounded"></div>
                <span className="text-rose-300">0.1-0.3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-950/50 border border-amber-900/40 rounded"></div>
                <span className="text-amber-300">0.3-0.5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-950/60 border border-emerald-800/50 rounded"></div>
                <span className="text-emerald-300">&gt; 0.5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
