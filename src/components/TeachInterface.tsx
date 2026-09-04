import React, { useState } from 'react';
import type { Association } from '../types';

interface TeachInterfaceProps {
  vocabulary: string[];
  onTeach: (association: Association, repetitions: number) => void;
  disabled?: boolean;
}

export const TeachInterface: React.FC<TeachInterfaceProps> = ({
  vocabulary,
  onTeach,
  disabled = false
}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [repetitions, setRepetitions] = useState(3);

  const handleTeach = () => {
    if (input && output && input !== output) {
      onTeach({ input: input.toUpperCase(), output: output.toUpperCase() }, repetitions);
      // Keep the values for repeated teaching
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      handleTeach();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Teach an Association</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="input-word" className="block text-sm font-medium text-gray-300 mb-2">
            Input Word
          </label>
          <select
            id="input-word"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            aria-label="Select input word"
          >
            <option value="">Select...</option>
            {vocabulary.map(word => (
              <option key={word} value={word}>{word}</option>
            ))}
          </select>
        </div>

        <div className="text-center text-2xl text-gray-400">→</div>

        <div>
          <label htmlFor="output-word" className="block text-sm font-medium text-gray-300 mb-2">
            Output Word
          </label>
          <select
            id="output-word"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            aria-label="Select output word"
          >
            <option value="">Select...</option>
            {vocabulary.filter(w => w !== input).map(word => (
              <option key={word} value={word}>{word}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="repetitions" className="block text-sm font-medium text-gray-300 mb-2">
            Repetitions: {repetitions}
          </label>
          <input
            id="repetitions"
            type="range"
            min="1"
            max="10"
            value={repetitions}
            onChange={(e) => setRepetitions(Number(e.target.value))}
            disabled={disabled}
            className="w-full"
            aria-label="Number of repetitions"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        <button
          onClick={handleTeach}
          disabled={disabled || !input || !output || input === output}
          onKeyPress={handleKeyPress}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          aria-label="Teach association"
        >
          Teach Association
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-900 rounded text-sm text-gray-300">
        <p className="font-semibold mb-2">💡 How it works:</p>
        <p>
          Each time you teach an association, the connection between these two words strengthens.
          More repetitions = stronger memory. Watch the line thickness and color change!
        </p>
      </div>
    </div>
  );
};
