import React from 'react';
import type { TopologyType } from '../lib/NetworkTopology';

interface TopologySelectorProps {
  currentTopology: TopologyType;
  onTopologyChange: (topology: TopologyType, config?: any) => void;
  disabled?: boolean;
}

const TOPOLOGIES: Array<{
  type: TopologyType;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    type: 'fully-connected',
    name: 'Fully Connected',
    description: 'Every node connects to every other node. Maximum connectivity.',
    icon: '⬢',
  },
  {
    type: 'sparse',
    name: 'Sparse Random',
    description: 'Random connections with low density. Efficient and scalable.',
    icon: '⚡',
  },
  {
    type: 'modular',
    name: 'Modular',
    description: 'Clustered communities with sparse inter-module connections.',
    icon: '🔷',
  },
  {
    type: 'ring',
    name: 'Ring Lattice',
    description: 'Each node connects to nearest neighbors in a ring structure.',
    icon: '⭕',
  },
  {
    type: 'small-world',
    name: 'Small World',
    description: 'Mix of local clustering and long-range shortcuts (Watts-Strogatz).',
    icon: '🌐',
  },
];

export const TopologySelector: React.FC<TopologySelectorProps> = ({
  currentTopology,
  onTopologyChange,
  disabled = false,
}) => {
  return (
    <div className="topology-selector">
      <div className="selector-header">
        <h4>Network Topology</h4>
        <p className="selector-subtitle">
          Choose how nodes are connected. Different topologies affect learning dynamics.
        </p>
      </div>

      <div className="topology-grid">
        {TOPOLOGIES.map((topo) => (
          <button
            key={topo.type}
            className={`topology-card ${currentTopology === topo.type ? 'is-active' : ''}`}
            onClick={() => onTopologyChange(topo.type)}
            disabled={disabled}
          >
            <div className="topology-icon">{topo.icon}</div>
            <div className="topology-info">
              <span className="topology-name">{topo.name}</span>
              <span className="topology-desc">{topo.description}</span>
            </div>
            {currentTopology === topo.type && (
              <div className="active-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="topology-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10V7M7 4.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>
          Changing topology will reset the network. Existing weights will be lost.
        </span>
      </div>
    </div>
  );
};
