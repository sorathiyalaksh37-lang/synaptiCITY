import React, { useState, useEffect, useRef } from 'react';
import { MultiLayerNetwork } from '../lib/MultiLayerNetwork';
import type { Layer, LayerConnection } from '../lib/MultiLayerNetwork';

export const MultiLayerVisualizer: React.FC = () => {
  const [network, setNetwork] = useState<MultiLayerNetwork>(() => new MultiLayerNetwork([4, 6, 3]));
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [error, setError] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setLayers(network.getLayers());
    drawNetwork();
  }, [network, epoch]);

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const layers = network.getLayers();
    const connections = network.getConnections();

    // Calculate layer positions
    const layerSpacing = width / (layers.length + 1);
    const layerPositions = layers.map((layer, idx) => ({
      x: layerSpacing * (idx + 1),
      y: height / 2,
      layer,
    }));

    // Draw connections first (so they appear behind neurons)
    connections.forEach((connection) => {
      const fromPos = layerPositions.find(lp => lp.layer.id === connection.from);
      const toPos = layerPositions.find(lp => lp.layer.id === connection.to);
      
      if (!fromPos || !toPos) return;

      const fromLayer = fromPos.layer;
      const toLayer = toPos.layer;
      
      const fromNeuronSpacing = height / (fromLayer.size + 1);
      const toNeuronSpacing = height / (toLayer.size + 1);

      // Draw each weight connection
      for (let i = 0; i < fromLayer.size; i++) {
        for (let j = 0; j < toLayer.size; j++) {
          const weight = connection.weights[i][j];
          const fromY = fromNeuronSpacing * (i + 1);
          const toY = toNeuronSpacing * (j + 1);

          // Color based on weight strength
          const intensity = Math.abs(weight);
          const color = weight > 0 
            ? `rgba(56, 189, 248, ${Math.min(intensity, 1)})` 
            : `rgba(239, 68, 68, ${Math.min(intensity, 1)})`;

          ctx.strokeStyle = color;
          ctx.lineWidth = Math.abs(weight) * 3;
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromY);
          ctx.lineTo(toPos.x, toY);
          ctx.stroke();
        }
      }
    });

    // Draw neurons
    layerPositions.forEach(({ x, y, layer }) => {
      const neuronSpacing = height / (layer.size + 1);
      
      layer.activations.forEach((activation, idx) => {
        const ny = neuronSpacing * (idx + 1);
        
        // Draw neuron circle
        const radius = 20;
        const brightness = activation;
        
        ctx.fillStyle = `rgba(56, 189, 248, ${0.2 + brightness * 0.8})`;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(x, ny, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw activation value
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activation.toFixed(2), x, ny);
      });

      // Draw layer label
      ctx.fillStyle = '#38bdf8';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(layer.name, x, 30);
      ctx.fillText(`(${layer.size})`, x, 50);
    });
  };

  const trainXOR = async () => {
    setIsTraining(true);
    setEpoch(0);

    // XOR training data
    const trainingData = [
      { input: [0, 0], target: [0] },
      { input: [0, 1], target: [1] },
      { input: [1, 0], target: [1] },
      { input: [1, 1], target: [0] },
    ];

    // Create network with appropriate architecture for XOR
    const xorNetwork = new MultiLayerNetwork([2, 4, 1]);
    setNetwork(xorNetwork);

    let currentEpoch = 0;
    const maxEpochs = 1000;

    const train = () => {
      if (currentEpoch >= maxEpochs) {
        setIsTraining(false);
        return;
      }

      // Train on one random sample
      const sample = trainingData[currentEpoch % trainingData.length];
      const err = xorNetwork.train(sample.input, sample.target);
      
      setEpoch(currentEpoch);
      setError(err);
      setLayers([...xorNetwork.getLayers()]);
      
      currentEpoch++;
      
      if (currentEpoch < maxEpochs) {
        setTimeout(train, 10);
      } else {
        setIsTraining(false);
      }
    };

    train();
  };

  const testForward = () => {
    // Test with random input
    const inputLayer = layers[0];
    const randomInput = Array(inputLayer.size).fill(0).map(() => Math.random());
    network.forward(randomInput);
    setLayers([...network.getLayers()]);
  };

  const resetNetwork = () => {
    network.reset();
    setLayers([...network.getLayers()]);
    setEpoch(0);
    setError(0);
  };

  return (
    <div className="multilayer-visualizer">
      <div className="visualizer-header">
        <h3>🧠 Multi-Layer Neural Network</h3>
        <p className="subtitle">
          Feedforward network with backpropagation training
        </p>
      </div>

      <div className="visualizer-content">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="network-canvas"
        />

        <div className="controls">
          <button
            onClick={trainXOR}
            disabled={isTraining}
            className="btn-primary"
          >
            {isTraining ? '⏳ Training...' : '🎯 Train XOR Problem'}
          </button>
          <button onClick={testForward} className="btn-secondary">
            ▶️ Forward Pass
          </button>
          <button onClick={resetNetwork} className="btn-secondary">
            🔄 Reset Network
          </button>
        </div>

        <div className="network-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Architecture:</span>
              <span className="info-value">
                {layers.map(l => l.size).join(' → ')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Epoch:</span>
              <span className="info-value">{epoch}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Error:</span>
              <span className="info-value">{error.toFixed(6)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Learning Rate:</span>
              <span className="info-value">{network.getLearningRate()}</span>
            </div>
          </div>
        </div>

        <div className="legend">
          <h4>Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color positive"></div>
              <span>Positive weights (excitatory)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color negative"></div>
              <span>Negative weights (inhibitory)</span>
            </div>
            <div className="legend-item">
              <div className="legend-neuron"></div>
              <span>Neuron (brightness = activation)</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .multilayer-visualizer {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .visualizer-header h3 {
          color: #38bdf8;
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .network-canvas {
          width: 100%;
          max-width: 800px;
          height: 400px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          display: block;
          margin: 0 auto 20px;
        }

        .controls {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.5);
          color: #38bdf8;
        }

        .btn-primary:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(100, 116, 139, 0.2);
          border: 1px solid rgba(100, 116, 139, 0.3);
          color: #94a3b8;
        }

        .btn-secondary:hover {
          background: rgba(100, 116, 139, 0.3);
        }

        .network-info {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          color: #94a3b8;
          font-size: 12px;
        }

        .info-value {
          color: #38bdf8;
          font-size: 16px;
          font-weight: 600;
          font-family: monospace;
        }

        .legend {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 16px;
        }

        .legend h4 {
          color: #e2e8f0;
          margin: 0 0 12px 0;
          font-size: 16px;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 14px;
        }

        .legend-color {
          width: 40px;
          height: 4px;
          border-radius: 2px;
        }

        .legend-color.positive {
          background: rgba(56, 189, 248, 0.8);
        }

        .legend-color.negative {
          background: rgba(239, 68, 68, 0.8);
        }

        .legend-neuron {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.6);
          border: 2px solid #38bdf8;
        }

        @media (max-width: 768px) {
          .network-canvas {
            height: 300px;
          }

          .controls {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
