import React, { useState } from 'react';
import { NeuralNetwork } from './lib/NeuralNetwork';
import { NeuralGrid } from './components/NeuralGrid';
import { TeachInterface } from './components/TeachInterface';
import { RecallInterface } from './components/RecallInterface';
import { ControlPanel } from './components/ControlPanel';
import { StateDebugPanel } from './components/StateDebugPanel';
import { BDHModule } from './components/BDHModule';
import { SixtySecondTest } from './components/SixtySecondTest';
import type { Node, Connection, Association } from './types';

// Initial vocabulary
const VOCABULARY = ['DOG', 'ANIMAL', 'PET', 'CAT', 'BIRD', 'FISH'];

function App() {
  const [network] = useState(() => new NeuralNetwork(VOCABULARY, 0.1));
  const [, setUpdateTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'simulation' | 'bdh' | 'test'>(
    'simulation'
  );
  const [highlightedConnection, setHighlightedConnection] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [learningFeedback, setLearningFeedback] = useState<{
    input: string;
    output: string;
    previousWeight: number;
    newWeight: number;
    deltaWeight: number;
  } | null>(null);

  // Force re-render when network state changes
  const forceUpdate = () => setUpdateTrigger(prev => prev + 1);

  // Generate node positions in a circular layout
  const generateNodes = (): Node[] => {
    const centerX = 300;
    const centerY = 200;
    const radius = 120;

    return VOCABULARY.map((word, index) => {
      const angle =
        (index / VOCABULARY.length) * 2 * Math.PI - Math.PI / 2;

      return {
        id: word,
        label: word,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        activation: network.getActivations()[index],
      };
    });
  };

  // Generate connections from the latest weight matrix
  const generateConnections = (): Connection[] => {
    const weights = network.getWeights();
    const connections: Connection[] = [];

    for (let i = 0; i < VOCABULARY.length; i++) {
      for (let j = 0; j < VOCABULARY.length; j++) {
        if (i !== j && weights[i][j] > 0.01) {
          connections.push({
            from: VOCABULARY[i],
            to: VOCABULARY[j],
            weight: weights[i][j],
          });
        }
      }
    }

    return connections;
  };

  // Always derive visualization data from the current network state.
  const nodes = generateNodes();
  const connections = generateConnections();

  const handleTeach = (
    association: Association,
    repetitions: number
  ) => {
    const result = network.teach(
      association.input,
      association.output,
      repetitions
    );

    setLearningFeedback({
      input: association.input,
      output: association.output,
      previousWeight: result.previousWeight,
      newWeight: result.newWeight,
      deltaWeight: result.deltaWeight,
    });

    setHighlightedConnection({
      from: association.input,
      to: association.output,
    });

    setTimeout(() => {
      setHighlightedConnection(null);
    }, 2000);

    forceUpdate();
  };

  const handleRecall = (inputWord: string) => {
    const result = network.recall(inputWord);

    if (result.word) {
      setHighlightedConnection({
        from: inputWord,
        to: result.word,
      });

      setTimeout(() => {
        setHighlightedConnection(null);
      }, 2000);
    }

    return {
      predicted: result.word,
      connectionStrength: result.confidence,
      allScores: result.allScores,
    };
  };

  const handleLearningRateChange = (rate: number) => {
    network.setLearningRate(rate);
    forceUpdate();
  };

  const handleReset = () => {
    network.reset();
    setLearningFeedback(null);
    setHighlightedConnection(null);
    forceUpdate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                synaptiCITY
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                When Connections Become Memory
              </p>
            </div>

            <div className="flex gap-2">
              {/* Simulation Tab */}
              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'simulation'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Simulation
              </button>

              {/* BDH Tab */}
              <button
                onClick={() => setActiveTab('bdh')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'bdh'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                BDH/BDH-CQ
              </button>

              {/* Test Tab */}
              <button
                onClick={() => setActiveTab('test')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'test'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Simulation Tab */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">
                🧠 What if memory isn't a place, but a change?
              </h2>

              <p className="text-gray-300">
                In this simulation, you'll discover how{' '}
                <strong>synaptic plasticity</strong>—the strengthening
                of connections between neurons—creates memory. No
                storage cells, no databases. Just connections that learn.
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Visualization */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Neural Network
                  </h3>

                  <div className="h-96">
                    <NeuralGrid
                      nodes={nodes}
                      connections={connections}
                      highlightedConnection={highlightedConnection}
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <TeachInterface
                  vocabulary={VOCABULARY}
                  onTeach={handleTeach}
                />

                <ControlPanel
                  learningRate={network.getLearningRate()}
                  onLearningRateChange={handleLearningRateChange}
                  onReset={handleReset}
                />

                {learningFeedback && (
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-300 mb-2">
                      🧠 Connection Updated
                    </h3>

                    <p className="text-sm text-gray-300">
                      {learningFeedback.input} → {learningFeedback.output}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-900 rounded p-2">
                        <span className="text-gray-400">Before</span>
                        <p className="font-semibold text-white">
                          {learningFeedback.previousWeight.toFixed(3)}
                        </p>
                      </div>

                      <div className="bg-gray-900 rounded p-2">
                        <span className="text-gray-400">After</span>
                        <p className="font-semibold text-white">
                          {learningFeedback.newWeight.toFixed(3)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">Change: </span>
                      <span className="font-semibold text-green-400">
                        +{learningFeedback.deltaWeight.toFixed(3)}
                      </span>
                    </div>

                    {learningFeedback.newWeight >= 0.999 && (
                      <p className="mt-2 text-xs text-yellow-300">
                        🔒 Connection has reached maximum strength.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Recall */}
              <div className="space-y-6">
                <RecallInterface
                  vocabulary={VOCABULARY}
                  onRecall={handleRecall}
                />
              </div>

              {/* Debug Panel */}
              <div className="lg:col-span-2">
                <StateDebugPanel
                  weights={network.getWeights()}
                  vocabulary={VOCABULARY}
                  activations={network.getActivations()}
                />
              </div>
            </div>

            {/* Competing Memories Demo */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-yellow-300">
                🔬 Try This: Competing Memories
              </h3>

              <ol className="space-y-2 text-gray-300">
                <li>
                  1. Teach DOG → ANIMAL (repeat 5 times)
                </li>
                <li>
                  2. Test recall: DOG → ? (should predict ANIMAL)
                </li>
                <li>
                  3. Now teach DOG → PET (repeat 5 times)
                </li>
                <li>
                  4. Test recall again: DOG → ? (compare the learned associations)
                </li>
              </ol>

              <p className="mt-3 text-sm text-gray-400">
                When multiple associations become strong, they can coexist in the
                network. If their strengths become similar, recall can become
                <strong> ambiguous</strong> because the network must choose between
                competing learned associations.
              </p>
            </div>
          </div>
        )}

        {/* BDH/BDH-CQ Tab */}
        {activeTab === 'bdh' && <BDHModule />}

        {/* Test Tab */}
        {activeTab === 'test' && <SixtySecondTest />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>
            Built for educational purposes. Not a reimplementation of
            BDH/BDH-CQ.
          </p>

          <p className="mt-2">
            ⭐⭐⭐⭐⭐ A uniquely interactive approach to understanding
            synaptic plasticity
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;