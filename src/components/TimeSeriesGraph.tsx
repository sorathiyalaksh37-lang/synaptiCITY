import React, { useRef, useEffect } from 'react';

export interface WeightSnapshot {
  timestamp: number;
  weights: Map<string, number>; // key: "FROM->TO", value: weight
}

interface TimeSeriesGraphProps {
  history: WeightSnapshot[];
  selectedConnections: string[];
  height?: number;
}

export const TimeSeriesGraph: React.FC<TimeSeriesGraphProps> = ({
  history,
  selectedConnections,
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = 'rgba(16, 19, 28, 0.8)';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (graphHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + graphWidth, y);
      ctx.stroke();

      // Y-axis labels
      const value = 1 - i * 0.2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 10, y + 4);
    }

    // Vertical grid lines
    const timeSteps = Math.min(10, history.length);
    for (let i = 0; i <= timeSteps; i++) {
      const x = padding.left + (graphWidth / timeSteps) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + graphHeight);
      ctx.stroke();
    }

    // Plot lines for selected connections
    const colors = [
      '#38bdf8', // cyan
      '#fb923c', // orange
      '#a78bfa', // purple
      '#34d399', // green
      '#f472b6', // pink
      '#fbbf24', // yellow
    ];

    selectedConnections.forEach((connection, idx) => {
      const color = colors[idx % colors.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      history.forEach((snapshot, i) => {
        const weight = snapshot.weights.get(connection) || 0;
        const x = padding.left + (graphWidth / (history.length - 1)) * i;
        const y = padding.top + graphHeight - (weight * graphHeight);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      ctx.fillStyle = color;
      history.forEach((snapshot, i) => {
        const weight = snapshot.weights.get(connection) || 0;
        const x = padding.left + (graphWidth / (history.length - 1)) * i;
        const y = padding.top + graphHeight - (weight * graphHeight);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + graphHeight);
    ctx.lineTo(padding.left + graphWidth, padding.top + graphHeight);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Time →', padding.left + graphWidth / 2, height - 10);

    ctx.save();
    ctx.translate(15, padding.top + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Weight →', 0, 0);
    ctx.restore();

  }, [history, selectedConnections, height]);

  return (
    <div className="timeseries-graph">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px` }}
      />
      {selectedConnections.length > 0 && (
        <div className="graph-legend">
          {selectedConnections.map((conn, idx) => {
            const colors = ['#38bdf8', '#fb923c', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'];
            return (
              <div key={conn} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="legend-label">{conn}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
