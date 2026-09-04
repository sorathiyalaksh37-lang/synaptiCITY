import React from 'react';

export const BDHModule: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">
        Connection to Real AI: BDH & BDH-CQ
      </h2>

      {/* Introduction */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-blue-400">
          From Toy Model to Real Architecture
        </h3>
        <p className="text-gray-300">
          What you just experienced—memory emerging from connection strength changes—isn't just
          a teaching tool. It's the same mechanism powering cutting-edge AI systems like{' '}
          <strong className="text-white">Dragon Hatchling (BDH)</strong> and{' '}
          <strong className="text-white">BDH-CQ</strong>.
        </p>
      </div>

      {/* BDH Section */}
      <div className="bg-gray-900 rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-semibold text-green-400">
          Dragon Hatchling (BDH)
        </h3>
        <p className="text-gray-300 text-sm">
          BDH reformulates attention as <strong>synaptic memory</strong> through Hebbian-style writes,
          enabling models to learn from context without massive key-value caches.
        </p>
        
        <div className="bg-gray-800 p-4 rounded font-mono text-sm text-gray-300 overflow-x-auto">
          <div className="mb-2 text-blue-300">// Core recurrent update</div>
          <div>h<sub>t</sub> = f(W · x<sub>t</sub> + U · h<sub>t-1</sub>)</div>
          <div className="mt-3 text-gray-400">Where:</div>
          <ul className="mt-1 ml-4 space-y-1 text-xs">
            <li>• h<sub>t</sub> = hidden state at time t</li>
            <li>• W, U = learned weight matrices</li>
            <li>• x<sub>t</sub> = input at time t</li>
            <li>• f = non-linear activation function</li>
          </ul>
        </div>

        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Key Innovation:</strong></p>
          <ul className="ml-4 space-y-1">
            <li>• Attention mechanism as synaptic memory</li>
            <li>• Recurrent state updates instead of large caches</li>
            <li>• Efficient in-context learning</li>
          </ul>
        </div>
      </div>

      {/* BDH-CQ Section */}
      <div className="bg-gray-900 rounded-lg p-5 space-y-3">
        <h3 className="text-lg font-semibold text-purple-400">
          BDH-CQ (Contextual Memory + Reasoning)
        </h3>
        <p className="text-gray-300 text-sm">
          BDH-CQ extends the synaptic memory mechanism with <strong>latent reasoning</strong>—learning
          from demonstrations without requiring chain-of-thought explanations.
        </p>
        
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Capabilities:</strong></p>
          <ul className="ml-4 space-y-1">
            <li>• Learning from demonstrations (contextual memory)</li>
            <li>• Reasoning without verbal chain-of-thought</li>
            <li>• Proven on ARC-AGI benchmark</li>
            <li>• Scales from 1B to 600B parameters</li>
          </ul>
        </div>

        <div className="bg-blue-900/30 border-l-4 border-blue-400 p-3 text-sm text-gray-300">
          <p className="font-semibold text-blue-300">Published Evidence:</p>
          <p className="mt-1">
            BDH and BDH-CQ have published results on benchmarks including ARC-AGI and Sudoku.
            These results come from the original research teams, not our toy simulation.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-3">
          Toy Model vs. Real System
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 px-3 py-2 text-left text-white">Aspect</th>
                <th className="border border-gray-600 px-3 py-2 text-left text-white">Our Toy Model</th>
                <th className="border border-gray-600 px-3 py-2 text-left text-white">BDH/BDH-CQ</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr>
                <td className="border border-gray-600 px-3 py-2 font-semibold">Scale</td>
                <td className="border border-gray-600 px-3 py-2">6-word vocabulary</td>
                <td className="border border-gray-600 px-3 py-2">1B-600B parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-3 py-2 font-semibold">Learning Rule</td>
                <td className="border border-gray-600 px-3 py-2">Hebbian: Δw = η × aᵢ × aⱼ</td>
                <td className="border border-gray-600 px-3 py-2">Hebbian-inspired with backprop</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-3 py-2 font-semibold">Memory</td>
                <td className="border border-gray-600 px-3 py-2">Visible weight matrix</td>
                <td className="border border-gray-600 px-3 py-2">Hidden synaptic state</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-3 py-2 font-semibold">Interference</td>
                <td className="border border-gray-600 px-3 py-2">Demonstrated directly</td>
                <td className="border border-gray-600 px-3 py-2">Managed through architecture</td>
              </tr>
              <tr>
                <td className="border border-gray-600 px-3 py-2 font-semibold">Purpose</td>
                <td className="border border-gray-600 px-3 py-2">Educational visualization</td>
                <td className="border border-gray-600 px-3 py-2">Production AI reasoning</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources */}
      <div className="bg-gray-900 rounded-lg p-5 space-y-2">
        <h3 className="text-lg font-semibold text-white">Primary Sources</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>
            • <strong>Dragon Hatchling (2025):</strong> BDH architecture and equations
          </li>
          <li>
            • <strong>BDH-CQ Technical Report (2026):</strong> Contextual memory and reasoning
          </li>
          <li>
            • <strong>The Equations of Reasoning:</strong> Microscopic graph dynamics
          </li>
          <li>
            • <strong>From Attention to Synapses:</strong> Theoretical derivation of BDH
          </li>
        </ul>
      </div>

      {/* Important Distinction */}
      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 text-sm text-gray-300">
        <p className="font-semibold text-yellow-300 mb-2">⚠️ Important Distinction</p>
        <p>
          Our toy model demonstrates <strong>one mechanism</strong> used in real systems. It is NOT
          a reimplementation of BDH or BDH-CQ. Published benchmark results (ARC-AGI, Sudoku) come
          from the original research papers, not our simulation.
        </p>
      </div>
    </div>
  );
};
