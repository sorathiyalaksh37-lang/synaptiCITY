import React from 'react';
import type { ConnectionFeedback } from './ConnectionInspector';

interface TeachingHistoryProps {
  entries: ConnectionFeedback[];
}

export const TeachingHistory: React.FC<TeachingHistoryProps> = ({ entries }) => (
  <section className="history-panel">
    <div className="history-heading">
      <div>
        <span className="panel-kicker">RECENT OBSERVATIONS</span>
        <h2>Teaching log</h2>
      </div>
      <span className="history-count">{entries.length.toString().padStart(2, '0')}</span>
    </div>

    {entries.length === 0 ? (
      <p className="empty-note">No teaching pulses recorded yet. The lab is waiting.</p>
    ) : (
      <div className="history-list">
        {entries.map((entry, index) => (
          <div className="history-row" key={`${entry.input}-${entry.output}-${index}`}>
            <span className="history-index">{String(entries.length - index).padStart(2, '0')}</span>
            <span className="mono">{entry.input} → {entry.output}</span>
            <span className="history-reps">{entry.repetitions} pulse{entry.repetitions === 1 ? '' : 's'}</span>
            <span className="history-delta">+{entry.deltaWeight.toFixed(3)}</span>
          </div>
        ))}
      </div>
    )}
  </section>
);