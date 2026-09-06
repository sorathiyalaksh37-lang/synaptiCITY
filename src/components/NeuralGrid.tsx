import React, { useEffect, useRef, useState } from 'react';
import type { Node, Connection } from '../types';

interface NeuralGridProps {
  nodes: Node[];
  connections: Connection[];
  highlightedConnection?: { from: string; to: string } | null;
  selectedNodes?: { input: string; output: string };
  selectionFocus?: 'input' | 'output';
  onNodeSelect?: (word: string) => void;
}

/**
 * Returns the HSL colour for a connection weight.
 * dim red (weak) → amber (medium) → bright emerald (strong)
 */
function weightToColor(weight: number): string {
  if (weight < 0.15) return '#ef4444';   // red-500
  if (weight < 0.4)  return '#f59e0b';   // amber-500
  return '#10b981';                       // emerald-500
}

/** Stroke width scales with weight, min 1 px, max 7 px */
function weightToWidth(weight: number): number {
  return 1 + weight * 6;
}

/**
 * Linearly interpolate between two points.
 * t = 0 → start, t = 1 → end.
 */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const NeuralGrid: React.FC<NeuralGridProps> = ({
  nodes,
  connections,
  highlightedConnection,
  selectedNodes,
  selectionFocus = 'input',
  onNodeSelect,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  /**
   * Pulse particle: a glowing circle that travels from the source node
   * to the target node over ~700 ms, simulating signal propagation.
   */
  const [pulseT, setPulseT] = useState(0);          // 0..1 along the edge
  const [pulseActive, setPulseActive] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const PULSE_DURATION = 700; // ms

  // Start a new pulse whenever the highlighted connection changes
  useEffect(() => {
    if (!highlightedConnection) {
      setPulseActive(false);
      setPulseT(0);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }

    // Reset and start animation
    setPulseActive(true);
    setPulseT(0);
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / PULSE_DURATION, 1);
      // Ease-in-out: smooth start + smooth end
      const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setPulseT(easedT);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPulseActive(false);
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [highlightedConnection]);

  const fromNode = highlightedConnection
    ? nodes.find(n => n.id === highlightedConnection.from)
    : null;
  const toNode = highlightedConnection
    ? nodes.find(n => n.id === highlightedConnection.to)
    : null;

  // Pulse particle position
  const pulseX =
    fromNode && toNode ? lerp(fromNode.x, toNode.x, pulseT) : 0;
  const pulseY =
    fromNode && toNode ? lerp(fromNode.y, toNode.y, pulseT) : 0;

  return (
    <div className="neural-grid">
      {/* Inline keyframe animations — zero runtime dependencies */}
      <style>{`
        @keyframes nodeRipple {
          0%   { r: 32; opacity: 0.7; }
          100% { r: 52; opacity: 0; }
        }
        @keyframes edgePulse {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 0.4; }
        }
        .ripple-ring {
          animation: nodeRipple 0.7s ease-out forwards;
          transform-box: fill-box;
          transform-origin: center;
        }
        .edge-pulse {
          animation: edgePulse 0.6s ease-in-out infinite;
        }
      `}</style>

      <svg
        ref={svgRef}
        className="w-full flex-1"
        viewBox="0 0 600 400"
        aria-label="Neural network visualization"
      >
        {/* ── SVG definitions ── */}
        <defs>
          {/* Glow filter for highlighted connections and nodes */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle glow for inactive nodes */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Arrowhead marker — default (inactive) */}
          <marker
            id="arrow-inactive"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="#4b5563" opacity="0.6" />
          </marker>

          {/* Arrowhead marker — highlighted */}
          <marker
            id="arrow-active"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* ── Connections ── */}
        <g>
          {connections.map((conn, idx) => {
            const f = nodes.find(n => n.id === conn.from);
            const t = nodes.find(n => n.id === conn.to);
            if (!f || !t) return null;

            const isHighlighted =
              !!highlightedConnection &&
              highlightedConnection.from === conn.from &&
              highlightedConnection.to === conn.to;

            // Shorten the line so it doesn't overlap the node circles (r=30)
            const dx = t.x - f.x;
            const dy = t.y - f.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nodeR = 31;
            const x1 = f.x + (dx / dist) * nodeR;
            const y1 = f.y + (dy / dist) * nodeR;
            const x2 = t.x - (dx / dist) * (nodeR + 8); // extra gap for arrowhead
            const y2 = t.y - (dy / dist) * nodeR;

            const color = isHighlighted ? '#38bdf8' : weightToColor(conn.weight);
            const width = isHighlighted
              ? Math.max(weightToWidth(conn.weight), 3)
              : weightToWidth(conn.weight);

            // Mid-point for weight label
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;


            return (
              <g key={`conn-${conn.from}-${conn.to}-${idx}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={width}
                  opacity={isHighlighted ? 1 : 0.55}
                  filter={isHighlighted ? 'url(#glow)' : undefined}
                  markerEnd={
                    isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-inactive)'
                  }
                  className={isHighlighted ? 'edge-pulse' : ''}
                >
                  <title>
                    {conn.from} → {conn.to}: {conn.weight.toFixed(3)}
                  </title>
                </line>

                {/* Weight label — only shown for meaningful weights */}
                {conn.weight > 0.05 && (
                  <text
                    x={mx}
                    y={my - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isHighlighted ? '#7dd3fc' : '#9ca3af'}
                    fontFamily="monospace"
                    pointerEvents="none"
                    opacity={isHighlighted ? 1 : 0.8}
                  >
                    {conn.weight.toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* ── Nodes ── */}
        <g>
          {nodes.map(node => {
            const isSource =
              !!highlightedConnection && highlightedConnection.from === node.id;
            const isTarget =
              !!highlightedConnection && highlightedConnection.to === node.id;
            const isSelectedInput = selectedNodes?.input === node.id;
            const isSelectedOutput = selectedNodes?.output === node.id;
            const isSelected = isSelectedInput || isSelectedOutput;
            const isActive = isSource || isTarget || node.activation > 0 || isSelected;

            const fillColor = isSource
              ? '#0ea5e9'   // sky-500 — pre-synaptic neuron fires
              : isTarget
              ? '#8b5cf6'   // violet-500 — post-synaptic neuron activates
              : node.activation > 0
              ? '#3b82f6'   // blue-500
              : '#1f2937';  // gray-800 — resting

            const strokeColor = isActive ? '#e0f2fe' : '#374151';

            return (
              <g
                key={node.id}
                className={`neural-node ${isSelected ? 'is-selected' : ''}`}
                role={onNodeSelect ? 'button' : undefined}
                tabIndex={onNodeSelect ? 0 : undefined}
                aria-label={onNodeSelect ? `Select ${node.label} as ${selectionFocus}` : undefined}
                onClick={() => onNodeSelect?.(node.id)}
                onKeyDown={(event) => {
                  if (onNodeSelect && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onNodeSelect(node.id);
                  }
                }}
              >
                {/* Ripple ring — plays once while highlighted */}
                {isActive && highlightedConnection && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={32}
                    fill="none"
                    stroke={isSource ? '#0ea5e9' : '#8b5cf6'}
                    strokeWidth={2}
                    className="ripple-ring"
                    key={`ripple-${node.id}-${JSON.stringify(highlightedConnection)}`}
                  />
                )}

                {/* Main node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={30}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  filter={isActive ? 'url(#glow)' : 'url(#softGlow)'}
                  style={{
                    transition: 'fill 0.35s ease, stroke 0.35s ease',
                  }}
                >
                  <title>
                    {node.label} (activation: {node.activation.toFixed(2)})
                  </title>
                </circle>

                {isSelected && !isSource && !isTarget && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={35}
                    fill="none"
                    stroke={isSelectedInput ? '#66d9ff' : '#b49cff'}
                    strokeWidth={1}
                    strokeDasharray="3 4"
                    opacity={0.8}
                  />
                )}

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={isActive ? '13' : '12'}
                  fontWeight="bold"
                  fontFamily="system-ui, sans-serif"
                  pointerEvents="none"
                  style={{ transition: 'font-size 0.2s ease' }}
                >
                  {node.label}
                </text>

                {/* Role badge below node while highlighted */}
                {(isSource || isTarget) && (
                  <text
                    x={node.x}
                    y={node.y + 44}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isSource ? '#7dd3fc' : '#c4b5fd'}
                    fontFamily="system-ui, sans-serif"
                    pointerEvents="none"
                  >
                    {isSource ? 'pre-synaptic' : 'post-synaptic'}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* ── Travelling pulse particle ── */}
        {pulseActive && fromNode && toNode && (
          <circle
            cx={pulseX}
            cy={pulseY}
            r={7}
            fill="#fbbf24"
            opacity={0.85 - pulseT * 0.4}
            filter="url(#glow)"
            pointerEvents="none"
          />
        )}
      </svg>

      {/* Legend */}
      <div className="graph-legend">
        <div className="flex items-center gap-1.5">
          <svg width="28" height="6">
            <line x1="0" y1="3" x2="28" y2="3" stroke="#ef4444" strokeWidth="2" />
          </svg>
          <span>Weak</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="6">
            <line x1="0" y1="3" x2="28" y2="3" stroke="#f59e0b" strokeWidth="3.5" />
          </svg>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="28" height="8">
            <line x1="0" y1="4" x2="28" y2="4" stroke="#10b981" strokeWidth="5" />
          </svg>
          <span>Strong</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-sky-400">■</span>
          <span>Pre-synaptic</span>
          <span className="text-violet-400 ml-2">■</span>
          <span>Post-synaptic</span>
        </div>
      </div>
    </div>
  );
};
