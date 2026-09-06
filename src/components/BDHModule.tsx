import React, { useState } from 'react';

export const BDHModule: React.FC = () => {
  const [activeComparisonTab, setActiveComparisonTab] = useState<'memory' | 'computation' | 'scaling'>('memory');

  return (
    <div className="research-module">
      {/* Keyframes for Restrained Exhibit Motion */}
      <style>{`
        @keyframes signal-flow {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes signal-flow-down {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .animate-signal-x {
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 12px var(--cyan);
          transform: translateY(-50%);
          animation: signal-flow 2.8s ease-in-out infinite;
        }
        .animate-signal-y {
          position: absolute;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--violet);
          box-shadow: 0 0 12px var(--violet);
          transform: translateX(-50%);
          animation: signal-flow-down 3s ease-in-out infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-signal-x, .animate-signal-y, .animate-pulse-ring {
            animation: none !important;
          }
        }
      `}</style>

      {/* CENTRAL CONCEPT CHAIN BREADCRUMB */}
      <section className="research-panel">
        <span className="panel-kicker">EXHIBIT NARRATIVE CHAIN</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', font: '12px var(--mono)', marginTop: '8px', color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--cyan)' }}>SYNAPTIC PLASTICITY</strong>
          <span style={{ color: 'var(--faint)' }}>→</span>
          <span>CONNECTION STRENGTH</span>
          <span style={{ color: 'var(--faint)' }}>→</span>
          <strong style={{ color: 'var(--cyan)' }}>LEARNED STATE</strong>
          <span style={{ color: 'var(--faint)' }}>→</span>
          <span>RECALL</span>
          <span style={{ color: 'var(--faint)' }}>→</span>
          <strong style={{ color: 'var(--violet)' }}>BDH RECURRENT STATE</strong>
          <span style={{ color: 'var(--faint)' }}>→</span>
          <strong style={{ color: 'var(--violet)' }}>BDH-CQ LATENT REASONING</strong>
        </div>
      </section>

      {/* 1. BDH HERO */}
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">RESEARCH CONNECTION / BDH & BRAIN-INSPIRED COMPUTATION</span>
            <h2>From toy memory to recurrent state.</h2>
          </div>
          <span className="action-index">01</span>
        </div>
        <p className="panel-intro">
          In our toy experiment, memory lives in changing connection strengths between words.
          <strong> Dragon Hatchling (BDH)</strong> takes a related computational idea into modern AI research: carrying information in a
          dynamically updated <em>recurrent hidden state</em>.
        </p>

        {/* Visual State-Flow Diagram */}
        <div style={{ marginTop: '20px', padding: '18px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: '10px var(--mono)', color: 'var(--faint)', marginBottom: '12px' }}>
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>CONCEPTUAL MODEL</span>
            <span>Information carrying forward through internal state</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', textAlign: 'center', font: '12px var(--mono)', alignItems: 'center' }}>
            <div style={{ padding: '14px', border: '1px solid var(--line)', background: 'rgba(16, 22, 26, 0.82)' }}>
              <span style={{ fontSize: '9px', color: 'var(--faint)', textTransform: 'uppercase', display: 'block' }}>INPUT TOKEN</span>
              <strong style={{ color: 'var(--cyan)', fontSize: '14px' }}>DOG</strong>
            </div>

            <div style={{ padding: '14px', border: '1px solid var(--line)', background: 'rgba(16, 22, 26, 0.82)', position: 'relative' }}>
              <span style={{ fontSize: '9px', color: 'var(--faint)', textTransform: 'uppercase', display: 'block' }}>STATE (h₀)</span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingTop: '8px' }}>
                <span className="animate-pulse-ring" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)' }} />
                <span className="animate-pulse-ring" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)' }} />
                <span className="animate-pulse-ring" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)' }} />
              </div>
            </div>

            <div style={{ padding: '14px', border: '1px solid rgba(102, 217, 255, 0.4)', background: 'rgba(102, 217, 255, 0.05)' }}>
              <span style={{ fontSize: '9px', color: 'var(--cyan)', textTransform: 'uppercase', display: 'block' }}>UPDATED STATE (h₁)</span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', paddingTop: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
              </div>
            </div>

            <div style={{ padding: '14px', border: '1px solid rgba(125, 215, 170, 0.4)', background: 'rgba(125, 215, 170, 0.05)' }}>
              <span style={{ fontSize: '9px', color: 'var(--green)', textTransform: 'uppercase', display: 'block' }}>RECALLED OUTPUT</span>
              <strong style={{ color: 'var(--green)', fontSize: '14px' }}>ANIMAL</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CENTRAL CONNECTION */}
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">THE CENTRAL CONNECTION</span>
            <h2>Learning changes what the system carries forward.</h2>
          </div>
          <span className="action-index">02</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '18px', font: '12px var(--mono)' }}>
          {/* Left: Toy Experiment */}
          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--cyan)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              SYNAPCITY TOY MODEL
            </span>
            <div style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <div>DOG → ANIMAL</div>
              <div style={{ color: 'var(--cyan)' }}>↓ Connection strength increases (Δw = η × aᵢ × aⱼ)</div>
              <div>↓ Weight matrix stores memory</div>
              <div style={{ color: 'var(--green)' }}>↓ Outgoing matrix recall retrieves highest score</div>
            </div>
          </div>

          {/* Right: BDH */}
          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--violet)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              BDH ARCHITECTURE
            </span>
            <div style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <div>INPUT TOKEN (x<sub>t</sub>)</div>
              <div style={{ color: 'var(--violet)' }}>↓ Recurrent state update (h<sub>t</sub> = f(W·x<sub>t</sub> + U·h<sub>t-1</sub>))</div>
              <div>↓ Dynamic hidden state carries context forward</div>
              <div style={{ color: 'var(--violet)' }}>↓ Downstream computation reads recurrent state</div>
            </div>
          </div>
        </div>

        <div className="equation-block">
          <span className="equation-label">Illustrative Recurrence (Conceptual Model)</span>
          <code>h<sub>t</sub> = f(W · x<sub>t</sub> + U · h<sub>t-1</sub>)</code>
          <small style={{ color: 'var(--faint)', display: 'block', marginTop: '6px', fontSize: '11px', lineHeight: '1.5' }}>
            * Pedagogical simplification. BDH's literal math updates a sparse synapse-state matrix via positive activations rather than a dense vector RNN transition.
          </small>
        </div>
      </section>

      {/* 3. EXPERIMENT VS BDH COMPARISON */}
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">MECHANISM COMPARISON</span>
            <h2>How SynapCity stores learning vs. how BDH carries state.</h2>
          </div>
          <span className="action-index">03</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '18px', font: '12px var(--mono)' }}>
          {/* Toy Model Weight Bars */}
          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--faint)', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase' }}>
              YOUR TOY EXPERIMENT (SYNAPSE WEIGHTS)
            </span>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '4px' }}>
                <span>DOG → ANIMAL</span>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>w = 0.41</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#080b0e', border: '1px solid var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '82%', height: '100%', background: 'var(--cyan)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', marginBottom: '4px' }}>
                <span>DOG → PET</span>
                <span style={{ color: 'var(--violet)', fontWeight: 600 }}>w = 0.40</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#080b0e', border: '1px solid var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', background: 'var(--violet)' }} />
              </div>
            </div>
            <p style={{ color: 'var(--muted)', marginTop: '14px', fontSize: '12px', lineHeight: '1.6' }}>
              Your experiment stored learning by changing connection strengths between words in an explicit matrix.
            </p>
          </div>

          {/* BDH Recurrent State Transition */}
          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--faint)', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase' }}>
              BDH ARCHITECTURE (RECURRENT STATE)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center', padding: '14px 0', border: '1px solid var(--line)', background: 'rgba(16, 22, 26, 0.82)' }}>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--faint)', display: 'block' }}>INPUT</span>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>x<sub>t</sub></span>
              </div>
              <span style={{ color: 'var(--violet)' }}>→</span>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--violet)', display: 'block' }}>STATE (h<sub>t-1</sub>)</span>
                <span style={{ color: 'var(--violet)' }}>● ● ●</span>
              </div>
              <span style={{ color: 'var(--violet)' }}>→</span>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--green)', display: 'block' }}>STATE (h<sub>t</sub>)</span>
                <span style={{ color: 'var(--green)' }}>● ● ● ●</span>
              </div>
            </div>
            <p style={{ color: 'var(--muted)', marginTop: '14px', fontSize: '12px', lineHeight: '1.6' }}>
              BDH explores a different way to carry learned/internal state: updating a recurrent hidden state as processing proceeds.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE ARCHITECTURE COMPARISON TABLE */}
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">INTERACTIVE ARCHITECTURE COMPARISON</span>
            <h2>Two Ways to Carry Context</h2>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setActiveComparisonTab('memory')}
              className="outline-button"
              style={{ borderColor: activeComparisonTab === 'memory' ? 'var(--cyan)' : undefined, color: activeComparisonTab === 'memory' ? 'var(--cyan)' : undefined }}
            >
              MEMORY
            </button>
            <button
              onClick={() => setActiveComparisonTab('computation')}
              className="outline-button"
              style={{ borderColor: activeComparisonTab === 'computation' ? 'var(--cyan)' : undefined, color: activeComparisonTab === 'computation' ? 'var(--cyan)' : undefined }}
            >
              COMPUTATION
            </button>
            <button
              onClick={() => setActiveComparisonTab('scaling')}
              className="outline-button"
              style={{ borderColor: activeComparisonTab === 'scaling' ? 'var(--cyan)' : undefined, color: activeComparisonTab === 'scaling' ? 'var(--cyan)' : undefined }}
            >
              SCALING
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '18px' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>DIMENSION</th>
                <th>STANDARD TRANSFORMER</th>
                <th>BDH ARCHITECTURE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Memory Footprint</strong></td>
                <td>Linear KV cache growth O(N) with context length.</td>
                <td>Bounded O(1) recurrent state matrix footprint.</td>
              </tr>
              <tr>
                <td><strong>Sequence Scaling</strong></td>
                <td>Quadratic O(N²) attention computation across all tokens.</td>
                <td>Constant O(1) per-step hidden state transition update.</td>
              </tr>
              <tr>
                <td><strong>Synaptic Plasticity</strong></td>
                <td>Static weights during inference; memory is external KV cache.</td>
                <td>Dynamic recurrent state writes inspired by Hebbian plasticity.</td>
              </tr>
              <tr>
                <td><strong>Interference Management</strong></td>
                <td>Softmax attention weights separate token representations.</td>
                <td>Managed through sparse active activations (Kosowski et al., 2025).</td>
              </tr>
              <tr>
                <td><strong>ARC-AGI Benchmark</strong></td>
                <td>Requires extensive verbal CoT tokens for multi-step tasks.</td>
                <td>BDH-CQ scores 29.5% pass@2 on ARC-AGI-1 at ~$0.0007/task.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. RESEARCH INSIGHTS */}
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">RESEARCH INSIGHTS</span>
            <h2>Why This Research Direction Matters</h2>
          </div>
          <span className="action-index">05</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '18px' }}>
          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--cyan)', font: '18px var(--mono)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>01</span>
            <strong style={{ color: 'var(--ink)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Persistent Internal State</strong>
            <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
              Demonstrates how persistent internal hidden states carry information forward across sequence steps without expanding token memory.
            </p>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--cyan)', font: '18px var(--mono)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>02</span>
            <strong style={{ color: 'var(--ink)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>In-Context Adaptation</strong>
            <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
              State updates support dynamic adaptation from recent context without requiring full backpropagation parameter updates.
            </p>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--cyan)', font: '18px var(--mono)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>03</span>
            <strong style={{ color: 'var(--ink)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Compute & Memory Efficiency</strong>
            <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
              Recurrent hidden states offer energy-efficient constant-memory lookup compared to dense key-value attention stores.
            </p>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <span style={{ color: 'var(--cyan)', font: '18px var(--mono)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>04</span>
            <strong style={{ color: 'var(--ink)', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Neural Hardware Alignment</strong>
            <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
              Brain-inspired sparse co-activation is a guiding engineering framework for hardware-efficient modern AI architectures.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BDH-CQ SECTION */}
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker-amber">THEN THE IDEA EVOLVES</span>
            <h2>BDH-CQ: Recurrent Latent Reasoning</h2>
          </div>
          <span className="action-index">06</span>
        </div>
        <p className="panel-intro">
          BDH-CQ extends base BDH by demonstrating how recurrent latent states can perform multi-step reasoning from demonstrations
          without requiring explicit verbalized chain-of-thought tokens. Evaluated on the ARC-AGI-1 benchmark, BDH-CQ achieved
          <strong> 29.5% pass@2 at ~$0.0007/task</strong>.
        </p>
      </section>

      {/* 7. PRIMARY RESEARCH ARCHIVE */}
      <section className="research-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker">PRIMARY RESEARCH ARCHIVE</span>
            <h2>Verified Primary Sources</h2>
          </div>
          <span className="action-index">07</span>
        </div>

        <ul className="reference-list" style={{ marginTop: '18px' }}>
          <li style={{ padding: '14px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ color: 'var(--ink)', display: 'block' }}>
                  The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain (2025)
                </strong>
                <span style={{ color: 'var(--faint)', fontSize: '11px' }}>
                  Kosowski, A., Uznański, P., Chorowski, J., Stamirowska, Z., & Bartoszkiewicz, M.
                </span>
              </div>
              <a href="https://arxiv.org/abs/2509.26507" target="_blank" rel="noopener noreferrer" className="outline-button">
                arXiv:2509.26507 →
              </a>
            </div>
          </li>

          <li style={{ padding: '14px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ color: 'var(--ink)', display: 'block' }}>
                  BDH-CQ: In-Context Learning with Recurrent Latent Reasoning (2026)
                </strong>
                <span style={{ color: 'var(--faint)', fontSize: '11px' }}>
                  Engdahl, B., Kosowski, A., Chorowski, J., Stamirowska, Z., Uznański, P., et al.
                </span>
              </div>
              <a href="https://arxiv.org/abs/2608.09888" target="_blank" rel="noopener noreferrer" className="outline-button">
                arXiv:2608.09888 →
              </a>
            </div>
          </li>

          <li style={{ padding: '14px', border: '1px solid var(--line)', background: 'rgba(9, 14, 17, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ color: 'var(--ink)', display: 'block' }}>
                  Learning to (Learn at Test Time): RNNs with Expressive Hidden States (2024)
                </strong>
                <span style={{ color: 'var(--faint)', fontSize: '11px' }}>
                  Sun, Y., Li, X., Dalal, K., Xu, J., Vikram, A., Zhang, G., Dubois, Y., et al.
                </span>
              </div>
              <a href="https://arxiv.org/abs/2407.04620" target="_blank" rel="noopener noreferrer" className="outline-button">
                arXiv:2407.04620 →
              </a>
            </div>
          </li>
        </ul>
      </section>

      {/* 8. SCOPE & METHODOLOGICAL LIMITS */}
      <section className="honesty-panel">
        <div className="panel-heading-row">
          <div>
            <span className="panel-kicker-amber">IMPORTANT DISTINCTION</span>
            <h2>Scope & Methodological Limits</h2>
          </div>
        </div>
        <div className="honesty-columns">
          <p>
            <b>THIS IS</b>
            A small educational demonstration illustrating how local connection weights and recurrent hidden states represent learned associations.
          </p>
          <p>
            <b>THIS IS NOT</b>
            A full production reimplementation of BDH, BDH-CQ, or a biological brain simulator.
          </p>
          <p>
            <b>BENCHMARK CONTEXT</b>
            BDH-CQ achieved 29.5% pass@2 on ARC-AGI-1 at ~$0.0007/task, demonstrating cost-efficient latent reasoning from sequence demonstrations.
          </p>
        </div>
      </section>
    </div>
  );
};
