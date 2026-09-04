import React, { useEffect, useRef } from 'react';
import type { Node, Connection } from '../types';

interface NeuralGridProps {
  nodes: Node[];
  connections: Connection[];
  highlightedConnection?: { from: string; to: string } | null;
}

export const NeuralGrid: React.FC<NeuralGridProps> = ({
  nodes,
  connections,
  highlightedConnection
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Get connection color based on weight
  const getConnectionColor = (weight: number): string => {
    if (weight < 0.2) return '#ef4444'; // red - weak
    if (weight < 0.5) return '#f59e0b'; // orange - medium
    return '#10b981'; // green - strong
  };

  // Get connection width based on weight
  const getConnectionWidth = (weight: number): number => {
    return 1 + weight * 5; // 1-6px
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 600 400"
        aria-label="Neural network visualization"
      >
        {/* Draw connections first (so they appear behind nodes) */}
        <g className="connections">
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            if (!fromNode || !toNode) return null;

            const isHighlighted = highlightedConnection &&
              highlightedConnection.from === conn.from &&
              highlightedConnection.to === conn.to;

            return (
              <line
                key={`${conn.from}-${conn.to}-${idx}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getConnectionColor(conn.weight)}
                strokeWidth={getConnectionWidth(conn.weight)}
                className={`connection-line ${isHighlighted ? 'opacity-100' : 'opacity-60'}`}
                opacity={isHighlighted ? 1 : 0.6}
              >
                <title>
                  {fromNode.label} → {toNode.label}: {conn.weight.toFixed(3)}
                </title>
              </line>
            );
          })}
        </g>

        {/* Draw nodes */}
        <g className="nodes">
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={30}
                fill={node.activation > 0 ? '#3b82f6' : '#1f2937'}
                stroke={node.activation > 0 ? '#60a5fa' : '#374151'}
                strokeWidth={2}
                className="transition-all duration-300"
              >
                <title>{node.label} (activation: {node.activation.toFixed(2)})</title>
              </circle>
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                pointerEvents="none"
              >
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-neural-weak"></div>
          <span className="text-gray-300">Weak</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 bg-neural-medium"></div>
          <span className="text-gray-300">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-neural-strong"></div>
          <span className="text-gray-300">Strong</span>
        </div>
      </div>
    </div>
  );
};
