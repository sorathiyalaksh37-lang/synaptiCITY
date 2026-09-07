import React from 'react';

export interface NetworkMetrics {
  totalNodes: number;
  totalConnections: number;
  averageWeight: number;
  maxWeight: number;
  minWeight: number;
  weightStdDev: number;
  networkDensity: number;
  teachingEvents: number;
  recallAccuracy: number;
  memoryCapacity: number;
}

interface PerformanceMetricsProps {
  metrics: NetworkMetrics;
  realtime?: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  metrics,
  realtime = true,
}) => {
  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  };

  const getHealthColor = (value: number, thresholds: [number, number]): string => {
    if (value < thresholds[0]) return 'var(--error)';
    if (value > thresholds[1]) return 'var(--success)';
    return 'var(--warning)';
  };

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <h4>Performance Metrics</h4>
        {realtime && (
          <span className="realtime-badge">
            <span className="pulse-dot" />
            Live
          </span>
        )}
      </div>

      <div className="metrics-grid">
        {/* Network Structure */}
        <div className="metric-group">
          <h5 className="group-title">Network Structure</h5>
          
          <div className="metric-item">
            <span className="metric-label">Nodes</span>
            <span className="metric-value">{metrics.totalNodes}</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">Active Connections</span>
            <span className="metric-value">{metrics.totalConnections}</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">Density</span>
            <span className="metric-value">{formatNumber(metrics.networkDensity * 100)}%</span>
            <div className="metric-bar">
              <div
                className="metric-bar-fill"
                style={{ width: `${metrics.networkDensity * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weight Statistics */}
        <div className="metric-group">
          <h5 className="group-title">Weight Statistics</h5>

          <div className="metric-item">
            <span className="metric-label">Average Weight</span>
            <span className="metric-value">{formatNumber(metrics.averageWeight, 3)}</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">Max Weight</span>
            <span className="metric-value">{formatNumber(metrics.maxWeight, 3)}</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">Min Weight</span>
            <span className="metric-value">{formatNumber(metrics.minWeight, 3)}</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">Std Deviation</span>
            <span className="metric-value">{formatNumber(metrics.weightStdDev, 3)}</span>
          </div>
        </div>

        {/* Performance */}
        <div className="metric-group">
          <h5 className="group-title">Performance</h5>

          <div className="metric-item">
            <span className="metric-label">Teaching Events</span>
            <span className="metric-value">{metrics.teachingEvents}</span>
          </div>

          <div className="metric-item">
            <span className="metric-label">Recall Accuracy</span>
            <span
              className="metric-value"
              style={{ color: getHealthColor(metrics.recallAccuracy, [0.5, 0.8]) }}
            >
              {formatNumber(metrics.recallAccuracy * 100)}%
            </span>
            <div className="metric-bar">
              <div
                className="metric-bar-fill"
                style={{
                  width: `${metrics.recallAccuracy * 100}%`,
                  backgroundColor: getHealthColor(metrics.recallAccuracy, [0.5, 0.8]),
                }}
              />
            </div>
          </div>

          <div className="metric-item">
            <span className="metric-label">Memory Capacity</span>
            <span className="metric-value">{formatNumber(metrics.memoryCapacity, 1)}</span>
          </div>
        </div>
      </div>

      <div className="metrics-summary">
        <div className="summary-item">
          <span className="summary-icon">🧠</span>
          <div>
            <div className="summary-value">{metrics.totalConnections} / {metrics.totalNodes * (metrics.totalNodes - 1)}</div>
            <div className="summary-label">Connections formed</div>
          </div>
        </div>

        <div className="summary-item">
          <span className="summary-icon">⚡</span>
          <div>
            <div className="summary-value">{formatNumber(metrics.averageWeight, 3)}</div>
            <div className="summary-label">Avg connection strength</div>
          </div>
        </div>

        <div className="summary-item">
          <span className="summary-icon">🎯</span>
          <div>
            <div className="summary-value">{formatNumber(metrics.recallAccuracy * 100, 0)}%</div>
            <div className="summary-label">Recall success rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Calculate metrics from network state
 */
export const calculateMetrics = (
  weights: number[][],
  teachingHistory: any[],
  recallHistory: any[]
): NetworkMetrics => {
  const nodeCount = weights.length;
  
  // Flatten weights and filter out zeros
  const allWeights = weights.flat().filter((w) => w > 0);
  const connectionCount = allWeights.length;

  // Weight statistics
  const avgWeight = allWeights.length > 0 
    ? allWeights.reduce((a, b) => a + b, 0) / allWeights.length 
    : 0;
  
  const maxWeight = allWeights.length > 0 ? Math.max(...allWeights) : 0;
  const minWeight = allWeights.length > 0 ? Math.min(...allWeights) : 0;

  // Standard deviation
  const variance = allWeights.length > 0
    ? allWeights.reduce((sum, w) => sum + Math.pow(w - avgWeight, 2), 0) / allWeights.length
    : 0;
  const stdDev = Math.sqrt(variance);

  // Network density
  const possibleConnections = nodeCount * (nodeCount - 1);
  const density = possibleConnections > 0 ? connectionCount / possibleConnections : 0;

  // Recall accuracy
  const successfulRecalls = recallHistory.filter((r) => r.success).length;
  const recallAccuracy = recallHistory.length > 0 
    ? successfulRecalls / recallHistory.length 
    : 0;

  // Memory capacity (estimate)
  const memoryCapacity = connectionCount * avgWeight;

  return {
    totalNodes: nodeCount,
    totalConnections: connectionCount,
    averageWeight: avgWeight,
    maxWeight,
    minWeight,
    weightStdDev: stdDev,
    networkDensity: density,
    teachingEvents: teachingHistory.length,
    recallAccuracy,
    memoryCapacity,
  };
};
