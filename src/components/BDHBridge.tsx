import React, { useState } from 'react';

export const BDHBridge: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'comparison' | 'research'>('overview');

  return (
    <div className="bdh-bridge">
      <div className="bridge-header">
        <h3>🌉 From Toy Model to BDH</h3>
        <p className="subtitle">
          Understanding the conceptual bridge between this educational tool and the research concept
        </p>
      </div>

      <div className="bridge-tabs">
        <button
          className={`bridge-tab ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          Overview
        </button>
        <button
          className={`bridge-tab ${activeSection === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveSection('comparison')}
        >
          Comparison
        </button>
        <button
          className={`bridge-tab ${activeSection === 'research' ? 'active' : ''}`}
          onClick={() => setActiveSection('research')}
        >
          Research Path
        </button>
      </div>

      {activeSection === 'overview' && (
        <div className="bridge-content">
          <div className="content-section">
            <h4>What synaptiCITY IS</h4>
            <ul className="feature-list">
              <li>✅ Educational neural network simulator</li>
              <li>✅ Visualization of Hebbian learning principles</li>
              <li>✅ Interactive demonstration of synaptic plasticity</li>
              <li>✅ Toy model for understanding basic concepts</li>
              <li>✅ Platform for exploring network topologies</li>
              <li>✅ Tool for learning about attention mechanisms</li>
            </ul>
          </div>

          <div className="content-section">
            <h4>What synaptiCITY IS NOT</h4>
            <ul className="feature-list">
              <li>❌ A biologically accurate brain simulation</li>
              <li>❌ An implementation of BDH theory</li>
              <li>❌ A model of human memory formation</li>
              <li>❌ A production-grade ML framework</li>
              <li>❌ A replacement for neuroscience research tools</li>
            </ul>
          </div>

          <div className="warning-box">
            <h4>⚠️ Important Distinction</h4>
            <p>
              This platform uses simplified neural network concepts to teach fundamental principles.
              The Brain-Derived Hypothesis (BDH) is a research concept that involves far more complexity
              than what can be demonstrated in an educational web application.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'comparison' && (
        <div className="bridge-content">
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell">Aspect</div>
              <div className="comparison-cell">synaptiCITY (Toy Model)</div>
              <div className="comparison-cell">BDH (Research Concept)</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Scope</div>
              <div className="comparison-cell">
                Simple associative networks (2-50 nodes)
              </div>
              <div className="comparison-cell">
                Complex biological neural systems (billions of neurons)
              </div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Learning Rules</div>
              <div className="comparison-cell">
                Hebbian, STDP, BCM, Oja (simplified)
              </div>
              <div className="comparison-cell">
                Complex plasticity rules, neuromodulation, gene expression
              </div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Time Scale</div>
              <div className="comparison-cell">
                Milliseconds to seconds
              </div>
              <div className="comparison-cell">
                Milliseconds to years (developmental time scales)
              </div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Biological Fidelity</div>
              <div className="comparison-cell">
                Abstract mathematical model
              </div>
              <div className="comparison-cell">
                Biologically detailed, molecular level
              </div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell label">Purpose</div>
              <div className="comparison-cell">
                Education and visualization
              </div>
              <div className="comparison-cell">
                Scientific research and discovery
              </div>
            </div>
          </div>

          <div className="info-box">
            <h4>📊 Complexity Gap</h4>
            <p>
              The gap between this educational tool and actual BDH research is similar to the
              gap between a model airplane and a Boeing 747. Both involve flight principles,
              but the complexity, scale, and functionality are vastly different.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'research' && (
        <div className="bridge-content">
          <div className="research-path">
            <h4>🎓 From Here to Real Research</h4>
            <p className="intro-text">
              If you're interested in exploring BDH and computational neuroscience further,
              here's a suggested learning path:
            </p>

            <div className="path-steps">
              <div className="path-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Strengthen Foundations</h5>
                  <ul>
                    <li>Neuroscience basics (Kandel et al., "Principles of Neural Science")</li>
                    <li>Advanced calculus and linear algebra</li>
                    <li>Probability and statistics</li>
                    <li>Programming (Python, MATLAB)</li>
                  </ul>
                </div>
              </div>

              <div className="path-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Computational Neuroscience</h5>
                  <ul>
                    <li>Theoretical Neuroscience (Dayan & Abbott)</li>
                    <li>Spiking Neural Networks</li>
                    <li>Neuronal Dynamics (Gerstner et al.)</li>
                    <li>Tools: NEURON, Brian2, NEST</li>
                  </ul>
                </div>
              </div>

              <div className="path-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Advanced Topics</h5>
                  <ul>
                    <li>Synaptic plasticity mechanisms</li>
                    <li>Network dynamics and oscillations</li>
                    <li>Cognitive modeling</li>
                    <li>Research papers on BDH</li>
                  </ul>
                </div>
              </div>

              <div className="path-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h5>Research Experience</h5>
                  <ul>
                    <li>Join a computational neuroscience lab</li>
                    <li>Attend conferences (SfN, COSYNE)</li>
                    <li>Collaborate on research projects</li>
                    <li>Publish findings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="resources">
            <h4>📚 Recommended Resources</h4>
            <div className="resource-grid">
              <div className="resource-card">
                <h5>Books</h5>
                <ul>
                  <li>"Theoretical Neuroscience" - Dayan & Abbott</li>
                  <li>"Neuronal Dynamics" - Gerstner et al.</li>
                  <li>"Principles of Neural Science" - Kandel et al.</li>
                </ul>
              </div>

              <div className="resource-card">
                <h5>Online Courses</h5>
                <ul>
                  <li>Coursera: Computational Neuroscience</li>
                  <li>edX: Fundamentals of Neuroscience</li>
                  <li>Neuromatch Academy</li>
                </ul>
              </div>

              <div className="resource-card">
                <h5>Software Tools</h5>
                <ul>
                  <li>NEURON (neuron.yale.edu)</li>
                  <li>Brian2 (briansimulator.org)</li>
                  <li>PyNN (neuralensemble.org)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bdh-bridge {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .bridge-header h3 {
          color: #38bdf8;
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .bridge-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid rgba(56, 189, 248, 0.2);
        }

        .bridge-tab {
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          padding: 12px 20px;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          bottom: -2px;
        }

        .bridge-tab:hover {
          color: #38bdf8;
        }

        .bridge-tab.active {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
        }

        .bridge-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .content-section h4 {
          color: #38bdf8;
          font-size: 18px;
          margin: 0 0 12px 0;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-list li {
          padding: 8px 0;
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.6;
        }

        .warning-box,
        .info-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 16px;
        }

        .info-box {
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .warning-box h4,
        .info-box h4 {
          color: #38bdf8;
          font-size: 16px;
          margin: 0 0 12px 0;
        }

        .warning-box p,
        .info-box p {
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        .comparison-table {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 150px 1fr 1fr;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
        }

        .comparison-row:last-child {
          border-bottom: none;
        }

        .comparison-row.header {
          background: rgba(56, 189, 248, 0.2);
        }

        .comparison-cell {
          padding: 12px 16px;
          color: #e2e8f0;
          font-size: 14px;
          border-right: 1px solid rgba(56, 189, 248, 0.2);
        }

        .comparison-cell:last-child {
          border-right: none;
        }

        .comparison-cell.label {
          color: #38bdf8;
          font-weight: 600;
        }

        .comparison-row.header .comparison-cell {
          color: #38bdf8;
          font-weight: 600;
        }

        .research-path {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 20px;
        }

        .research-path h4 {
          color: #38bdf8;
          font-size: 18px;
          margin: 0 0 12px 0;
        }

        .intro-text {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .path-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .path-step {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .step-number {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          font-weight: 600;
        }

        .step-content h5 {
          color: #38bdf8;
          font-size: 16px;
          margin: 0 0 8px 0;
        }

        .step-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .step-content li {
          padding: 4px 0;
          color: #e2e8f0;
          font-size: 14px;
          padding-left: 20px;
          position: relative;
        }

        .step-content li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #38bdf8;
        }

        .resources h4 {
          color: #38bdf8;
          font-size: 18px;
          margin: 0 0 16px 0;
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .resource-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 16px;
        }

        .resource-card h5 {
          color: #38bdf8;
          font-size: 16px;
          margin: 0 0 12px 0;
        }

        .resource-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .resource-card li {
          padding: 6px 0;
          color: #e2e8f0;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .comparison-row {
            grid-template-columns: 1fr;
          }

          .comparison-cell {
            border-right: none;
            border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          }

          .comparison-cell:last-child {
            border-bottom: none;
          }

          .resource-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
