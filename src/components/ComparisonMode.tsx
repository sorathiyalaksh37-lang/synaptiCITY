import React, { useState } from 'react';

interface NetworkSnapshot {
  id: string;
  name: string;
  timestamp: number;
  weights: number[][];
  metrics: any;
}

interface ComparisonModeProps {
  snapshots: NetworkSnapshot[];
  onTakeSnapshot: (name: string) => void;
  onDeleteSnapshot: (id: string) => void;
  onLoadSnapshot: (id: string) => void;
}

export const ComparisonMode: React.FC<ComparisonModeProps> = ({
  snapshots,
  onTakeSnapshot,
  onDeleteSnapshot,
  onLoadSnapshot,
}) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([]);

  const handleTakeSnapshot = () => {
    if (!snapshotName.trim()) return;
    onTakeSnapshot(snapshotName.trim());
    setSnapshotName('');
  };

  const toggleSnapshotSelection = (id: string) => {
    setSelectedSnapshots((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id].slice(-2)
    );
  };

  const selectedData = snapshots.filter((s) => selectedSnapshots.includes(s.id));

  return (
    <div className="comparison-mode">
      <div className="comparison-header">
        <h4>Network Comparison</h4>
        <p className="comparison-subtitle">
          Take snapshots and compare network states side-by-side
        </p>
      </div>

      <div className="snapshot-creator">
        <input
          type="text"
          value={snapshotName}
          onChange={(e) => setSnapshotName(e.target.value)}
          placeholder="Snapshot name..."
          className="snapshot-input"
          maxLength={50}
          onKeyPress={(e) => e.key === 'Enter' && handleTakeSnapshot()}
        />
        <button className="snapshot-btn" onClick={handleTakeSnapshot} disabled={!snapshotName.trim()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="4" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4L6.5 2H9.5L10 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Take Snapshot
        </button>
      </div>

      <div className="snapshots-list">
        {snapshots.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="24" cy="26" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="M18 12L19 6H29L30 12" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p>No snapshots yet</p>
            <span>Create a snapshot to save the current network state</span>
          </div>
        ) : (
          <div className="snapshots-grid">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className={`snapshot-card ${selectedSnapshots.includes(snapshot.id) ? 'is-selected' : ''}`}
              >
                <div className="snapshot-header">
                  <input
                    type="checkbox"
                    checked={selectedSnapshots.includes(snapshot.id)}
                    onChange={() => toggleSnapshotSelection(snapshot.id)}
                    className="snapshot-checkbox"
                  />
                  <span className="snapshot-name">{snapshot.name}</span>
                  <button
                    className="snapshot-delete"
                    onClick={() => onDeleteSnapshot(snapshot.id)}
                    aria-label="Delete snapshot"
                  >
                    ✕
                  </button>
                </div>

                <div className="snapshot-meta">
                  <span className="snapshot-time">
                    {new Date(snapshot.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="snapshot-metrics">
                  <div className="metric-mini">
                    <span className="metric-mini-label">Connections</span>
                    <span className="metric-mini-value">{snapshot.metrics?.totalConnections || 0}</span>
                  </div>
                  <div className="metric-mini">
                    <span className="metric-mini-label">Avg Weight</span>
                    <span className="metric-mini-value">
                      {snapshot.metrics?.averageWeight?.toFixed(3) || '0.000'}
                    </span>
                  </div>
                  <div className="metric-mini">
                    <span className="metric-mini-label">Density</span>
                    <span className="metric-mini-value">
                      {((snapshot.metrics?.networkDensity || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <button className="load-snapshot-btn" onClick={() => onLoadSnapshot(snapshot.id)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 10V2M7 2L4 5M7 2L10 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M2 9V11C2 12.1046 2.89543 13 4 13H10C11.1046 13 12 12.1046 12 11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Load
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedData.length === 2 && (
        <div className="comparison-view">
          <h5>Comparison</h5>
          <div className="comparison-grid">
            {selectedData.map((snapshot) => (
              <div key={snapshot.id} className="comparison-column">
                <div className="comparison-column-header">
                  <span className="comparison-name">{snapshot.name}</span>
                  <span className="comparison-time">
                    {new Date(snapshot.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="comparison-metrics">
                  <div className="comparison-metric">
                    <span className="comparison-label">Connections</span>
                    <span className="comparison-value">
                      {snapshot.metrics?.totalConnections || 0}
                    </span>
                  </div>
                  <div className="comparison-metric">
                    <span className="comparison-label">Avg Weight</span>
                    <span className="comparison-value">
                      {snapshot.metrics?.averageWeight?.toFixed(4) || '0.0000'}
                    </span>
                  </div>
                  <div className="comparison-metric">
                    <span className="comparison-label">Max Weight</span>
                    <span className="comparison-value">
                      {snapshot.metrics?.maxWeight?.toFixed(4) || '0.0000'}
                    </span>
                  </div>
                  <div className="comparison-metric">
                    <span className="comparison-label">Density</span>
                    <span className="comparison-value">
                      {((snapshot.metrics?.networkDensity || 0) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="comparison-metric">
                    <span className="comparison-label">Teaching Events</span>
                    <span className="comparison-value">
                      {snapshot.metrics?.teachingEvents || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="comparison-diff">
            <h6>Differences</h6>
            <div className="diff-metrics">
              <div className="diff-item">
                <span className="diff-label">Connection Change</span>
                <span className={`diff-value ${getDiffClass(
                  (selectedData[1].metrics?.totalConnections || 0) -
                  (selectedData[0].metrics?.totalConnections || 0)
                )}`}>
                  {formatDiff(
                    (selectedData[1].metrics?.totalConnections || 0) -
                    (selectedData[0].metrics?.totalConnections || 0)
                  )}
                </span>
              </div>
              <div className="diff-item">
                <span className="diff-label">Weight Change</span>
                <span className={`diff-value ${getDiffClass(
                  (selectedData[1].metrics?.averageWeight || 0) -
                  (selectedData[0].metrics?.averageWeight || 0)
                )}`}>
                  {formatDiff(
                    (selectedData[1].metrics?.averageWeight || 0) -
                    (selectedData[0].metrics?.averageWeight || 0),
                    4
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getDiffClass = (diff: number): string => {
  if (diff > 0) return 'positive';
  if (diff < 0) return 'negative';
  return 'neutral';
};

const formatDiff = (diff: number, decimals: number = 0): string => {
  const sign = diff > 0 ? '+' : '';
  return sign + diff.toFixed(decimals);
};
