import React, { useMemo } from 'react';

interface StatisticalAnalysisProps {
  weights: number[][];
  vocabulary: string[];
}

interface Statistics {
  mean: number;
  median: number;
  mode: number;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  quartiles: [number, number, number];
  outliers: number[];
  skewness: number;
  kurtosis: number;
}

export const StatisticalAnalysis: React.FC<StatisticalAnalysisProps> = ({
  weights,
  vocabulary,
}) => {
  const stats = useMemo(() => calculateStatistics(weights), [weights]);
  const distribution = useMemo(() => calculateDistribution(weights), [weights]);

  return (
    <div className="statistical-analysis">
      <div className="analysis-header">
        <h4>Statistical Analysis</h4>
        <p className="analysis-subtitle">
          Comprehensive statistical metrics for weight distribution
        </p>
      </div>

      <div className="stats-grid">
        {/* Central Tendency */}
        <div className="stat-group">
          <h5 className="stat-group-title">Central Tendency</h5>
          <div className="stat-item">
            <span className="stat-label">Mean (μ)</span>
            <span className="stat-value">{stats.mean.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Median</span>
            <span className="stat-value">{stats.median.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mode</span>
            <span className="stat-value">{stats.mode.toFixed(4)}</span>
          </div>
        </div>

        {/* Dispersion */}
        <div className="stat-group">
          <h5 className="stat-group-title">Dispersion</h5>
          <div className="stat-item">
            <span className="stat-label">Std Deviation (σ)</span>
            <span className="stat-value">{stats.stdDev.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Variance (σ²)</span>
            <span className="stat-value">{stats.variance.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Range</span>
            <span className="stat-value">{stats.range.toFixed(4)}</span>
          </div>
        </div>

        {/* Range */}
        <div className="stat-group">
          <h5 className="stat-group-title">Range & Extremes</h5>
          <div className="stat-item">
            <span className="stat-label">Minimum</span>
            <span className="stat-value">{stats.min.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Maximum</span>
            <span className="stat-value">{stats.max.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Outliers</span>
            <span className="stat-value">{stats.outliers.length}</span>
          </div>
        </div>

        {/* Shape */}
        <div className="stat-group">
          <h5 className="stat-group-title">Distribution Shape</h5>
          <div className="stat-item">
            <span className="stat-label">Skewness</span>
            <span className="stat-value">{stats.skewness.toFixed(4)}</span>
            <span className="stat-hint">
              {Math.abs(stats.skewness) < 0.5 ? 'Symmetric' : stats.skewness > 0 ? 'Right-skewed' : 'Left-skewed'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Kurtosis</span>
            <span className="stat-value">{stats.kurtosis.toFixed(4)}</span>
            <span className="stat-hint">
              {stats.kurtosis > 0 ? 'Heavy-tailed' : stats.kurtosis < 0 ? 'Light-tailed' : 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Quartiles Visualization */}
      <div className="quartiles-section">
        <h5>Quartiles & Box Plot</h5>
        <div className="boxplot">
          <div className="boxplot-line" />
          <div className="boxplot-whisker-left" style={{ left: `${(stats.min / stats.max) * 100}%` }} />
          <div
            className="boxplot-box"
            style={{
              left: `${(stats.quartiles[0] / stats.max) * 100}%`,
              width: `${((stats.quartiles[2] - stats.quartiles[0]) / stats.max) * 100}%`,
            }}
          >
            <div
              className="boxplot-median"
              style={{
                left: `${((stats.quartiles[1] - stats.quartiles[0]) / (stats.quartiles[2] - stats.quartiles[0])) * 100}%`,
              }}
            />
          </div>
          <div className="boxplot-whisker-right" style={{ left: `${(stats.max / stats.max) * 100}%` }} />
        </div>
        <div className="boxplot-labels">
          <span>Min<br/>{stats.min.toFixed(3)}</span>
          <span>Q1<br/>{stats.quartiles[0].toFixed(3)}</span>
          <span>Q2<br/>{stats.quartiles[1].toFixed(3)}</span>
          <span>Q3<br/>{stats.quartiles[2].toFixed(3)}</span>
          <span>Max<br/>{stats.max.toFixed(3)}</span>
        </div>
      </div>

      {/* Distribution */}
      <div className="distribution-section">
        <h5>Weight Distribution</h5>
        <div className="histogram">
          {distribution.map((bucket, idx) => (
            <div key={idx} className="histogram-bar" title={`${bucket.range}: ${bucket.count} weights`}>
              <div
                className="histogram-bar-fill"
                style={{ height: `${(bucket.count / Math.max(...distribution.map(b => b.count))) * 100}%` }}
              />
              <span className="histogram-label">{bucket.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function calculateStatistics(weights: number[][]): Statistics {
  const allWeights = weights.flat().filter((w) => w > 0);
  
  if (allWeights.length === 0) {
    return {
      mean: 0,
      median: 0,
      mode: 0,
      stdDev: 0,
      variance: 0,
      min: 0,
      max: 0,
      range: 0,
      quartiles: [0, 0, 0],
      outliers: [],
      skewness: 0,
      kurtosis: 0,
    };
  }

  const sorted = [...allWeights].sort((a, b) => a - b);
  const n = sorted.length;

  // Central tendency
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const median = sorted[Math.floor(n / 2)];
  
  // Mode (most frequent value, binned)
  const bins = new Map<number, number>();
  sorted.forEach((w) => {
    const bin = Math.floor(w * 100) / 100;
    bins.set(bin, (bins.get(bin) || 0) + 1);
  });
  const mode = Array.from(bins.entries()).sort((a, b) => b[1] - a[1])[0][0];

  // Dispersion
  const variance = sorted.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Range
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Quartiles
  const q1 = sorted[Math.floor(n * 0.25)];
  const q2 = median;
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Outliers (values beyond 1.5 * IQR)
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = sorted.filter((w) => w < lowerBound || w > upperBound);

  // Skewness
  const skewness = sorted.reduce((sum, w) => sum + Math.pow((w - mean) / stdDev, 3), 0) / n;

  // Kurtosis (excess kurtosis)
  const kurtosis = sorted.reduce((sum, w) => sum + Math.pow((w - mean) / stdDev, 4), 0) / n - 3;

  return {
    mean,
    median,
    mode,
    stdDev,
    variance,
    min,
    max,
    range,
    quartiles: [q1, q2, q3],
    outliers,
    skewness,
    kurtosis,
  };
}

function calculateDistribution(weights: number[][]): Array<{
  range: string;
  label: string;
  count: number;
}> {
  const allWeights = weights.flat().filter((w) => w > 0);
  const bucketCount = 10;
  const max = Math.max(...allWeights, 0.001);
  const bucketSize = max / bucketCount;

  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    range: `${(i * bucketSize).toFixed(3)}-${((i + 1) * bucketSize).toFixed(3)}`,
    label: ((i + 0.5) * bucketSize).toFixed(2),
    count: 0,
  }));

  allWeights.forEach((w) => {
    const bucketIndex = Math.min(Math.floor(w / bucketSize), bucketCount - 1);
    buckets[bucketIndex].count++;
  });

  return buckets;
}
