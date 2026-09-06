import React from 'react';

interface WeightHeatmapProps {
  weights: number[][];
  vocabulary: string[];
}

export const WeightHeatmap: React.FC<WeightHeatmapProps> = ({ weights, vocabulary }) => {
  const maxWeight = Math.max(...weights.flat());
  
  const getColor = (weight: number): string => {
    if (weight === 0) return 'rgba(16, 19, 28, 0.8)';
    
    const intensity = weight / Math.max(maxWeight, 0.1);
    
    // Cyan gradient from dark to bright
    const r = Math.floor(56 + (142 * intensity));
    const g = Math.floor(189 + (66 * intensity));
    const b = Math.floor(248);
    
    return `rgba(${r}, ${g}, ${b}, ${0.3 + (0.7 * intensity)})`;
  };

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <span className="heatmap-title">Weight Matrix Heatmap</span>
        <span className="heatmap-legend">
          <span className="legend-label">Weak</span>
          <div className="legend-gradient" />
          <span className="legend-label">Strong</span>
        </span>
      </div>
      
      <div className="heatmap-grid-wrapper">
        {/* Column headers */}
        <div className="heatmap-labels heatmap-labels-top">
          <div className="heatmap-corner" />
          {vocabulary.map((word) => (
            <div key={`col-${word}`} className="heatmap-label">
              {word}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="heatmap-content">
          {/* Row headers */}
          <div className="heatmap-labels heatmap-labels-left">
            {vocabulary.map((word) => (
              <div key={`row-${word}`} className="heatmap-label">
                {word}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="heatmap-grid">
            {weights.map((row, i) => (
              <div key={i} className="heatmap-row">
                {row.map((weight, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`heatmap-cell ${i === j ? 'heatmap-cell-diagonal' : ''}`}
                    style={{ backgroundColor: getColor(weight) }}
                    title={`${vocabulary[i]} → ${vocabulary[j]}: ${weight.toFixed(3)}`}
                  >
                    {weight > 0.01 && (
                      <span className="heatmap-value">{weight.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-footer">
        <span className="heatmap-note">
          Rows: Source nodes · Columns: Target nodes · Diagonal: Self-connections (disabled)
        </span>
      </div>
    </div>
  );
};
