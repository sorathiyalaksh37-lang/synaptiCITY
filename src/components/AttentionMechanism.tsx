import React, { useState } from 'react';

interface AttentionScore {
  from: string;
  to: string;
  score: number;
}

export const AttentionMechanism: React.FC = () => {
  const [sequence] = useState(['The', 'cat', 'sat', 'on', 'the', 'mat']);
  const [focusWord, setFocusWord] = useState('cat');
  const [attentionScores, setAttentionScores] = useState<AttentionScore[]>([]);

  const calculateAttention = (queryWord: string) => {
    // Simplified attention mechanism (normally this would use learned weights)
    const scores: AttentionScore[] = sequence.map((word, idx) => {
      // Simulate attention score based on word similarity/context
      let score = 0;
      
      if (word.toLowerCase() === queryWord.toLowerCase()) {
        score = 1.0; // Self-attention
      } else if (idx > 0 && sequence[idx - 1].toLowerCase() === queryWord.toLowerCase()) {
        score = 0.8; // Next word context
      } else if (idx < sequence.length - 1 && sequence[idx + 1].toLowerCase() === queryWord.toLowerCase()) {
        score = 0.7; // Previous word context
      } else if (word.toLowerCase() === 'the' || queryWord.toLowerCase() === 'the') {
        score = 0.3; // Articles get moderate attention
      } else {
        score = 0.1 + Math.random() * 0.2; // Small random baseline
      }

      return {
        from: queryWord,
        to: word,
        score,
      };
    });

    // Normalize scores (softmax-like)
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    scores.forEach(s => s.score = s.score / sum);

    setAttentionScores(scores);
  };

  const handleWordClick = (word: string) => {
    setFocusWord(word);
    calculateAttention(word);
  };

  React.useEffect(() => {
    calculateAttention(focusWord);
  }, [focusWord]);

  return (
    <div className="attention-mechanism">
      <div className="attention-header">
        <h3>👁️ Attention Mechanism</h3>
        <p className="subtitle">
          Visualize how attention focuses on different parts of the input sequence
        </p>
      </div>

      <div className="attention-content">
        <div className="attention-explanation">
          <p>
            <strong>How it works:</strong> Click on any word to see which other words it "attends to" 
            (pays attention to). The brightness shows the attention weight.
          </p>
          <p>
            In transformer models, attention allows the network to focus on relevant parts 
            of the input when processing each element.
          </p>
        </div>

        {/* Query Word */}
        <div className="query-section">
          <h4>Query Word (Focus):</h4>
          <div className="word-display query-word">
            {focusWord}
          </div>
        </div>

        {/* Attention Visualization */}
        <div className="attention-viz">
          <h4>Attention Weights:</h4>
          <div className="sequence-container">
            {sequence.map((word, idx) => {
              const attentionScore = attentionScores.find(s => s.to === word);
              const score = attentionScore?.score || 0;
              const opacity = 0.1 + score * 0.9;
              
              return (
                <div
                  key={idx}
                  className={`word-item ${word === focusWord ? 'is-query' : ''}`}
                  style={{
                    background: `rgba(56, 189, 248, ${opacity})`,
                    borderColor: word === focusWord ? '#38bdf8' : `rgba(56, 189, 248, ${opacity})`,
                  }}
                  onClick={() => handleWordClick(word)}
                >
                  <div className="word-text">{word}</div>
                  <div className="attention-score">{(score * 100).toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attention Matrix Heatmap */}
        <div className="attention-matrix">
          <h4>Full Attention Matrix:</h4>
          <div className="matrix-grid">
            <div className="matrix-corner"></div>
            {sequence.map((word, idx) => (
              <div key={`col-${idx}`} className="matrix-label col-label">
                {word}
              </div>
            ))}
            
            {sequence.map((fromWord, fromIdx) => (
              <React.Fragment key={fromIdx}>
                <div className="matrix-label row-label">{fromWord}</div>
                {sequence.map((toWord, toIdx) => {
                  // Calculate attention from fromWord to toWord
                  let score = 0;
                  if (fromIdx === toIdx) {
                    score = 1.0;
                  } else if (Math.abs(fromIdx - toIdx) === 1) {
                    score = 0.6;
                  } else {
                    score = 0.1 + Math.random() * 0.3;
                  }
                  
                  return (
                    <div
                      key={`${fromIdx}-${toIdx}`}
                      className="matrix-cell"
                      style={{
                        background: `rgba(56, 189, 248, ${score})`,
                      }}
                      title={`${fromWord} → ${toWord}: ${(score * 100).toFixed(1)}%`}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Key Concepts */}
        <div className="concepts">
          <h4>Key Concepts:</h4>
          <div className="concept-grid">
            <div className="concept-card">
              <div className="concept-icon">Q</div>
              <div className="concept-title">Query</div>
              <div className="concept-desc">What am I looking for?</div>
            </div>
            <div className="concept-card">
              <div className="concept-icon">K</div>
              <div className="concept-title">Key</div>
              <div className="concept-desc">What do I contain?</div>
            </div>
            <div className="concept-card">
              <div className="concept-icon">V</div>
              <div className="concept-title">Value</div>
              <div className="concept-desc">What information do I carry?</div>
            </div>
          </div>
          <div className="formula">
            <strong>Attention Formula:</strong>
            <code>Attention(Q, K, V) = softmax(Q·K<sup>T</sup> / √d<sub>k</sub>) · V</code>
          </div>
        </div>
      </div>

      <style>{`
        .attention-mechanism {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .attention-header h3 {
          color: #38bdf8;
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .attention-explanation {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .attention-explanation p {
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 12px 0;
        }

        .attention-explanation p:last-child {
          margin-bottom: 0;
        }

        .query-section {
          margin-bottom: 24px;
        }

        .query-section h4 {
          color: #e2e8f0;
          font-size: 16px;
          margin: 0 0 12px 0;
        }

        .query-word {
          display: inline-block;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 20px;
          font-weight: 600;
        }

        .attention-viz {
          margin-bottom: 32px;
        }

        .attention-viz h4 {
          color: #e2e8f0;
          font-size: 16px;
          margin: 0 0 16px 0;
        }

        .sequence-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .word-item {
          padding: 16px 20px;
          border-radius: 8px;
          border: 2px solid;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .word-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
        }

        .word-item.is-query {
          border-width: 3px;
        }

        .word-text {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .attention-score {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-family: monospace;
        }

        .attention-matrix {
          margin-bottom: 32px;
        }

        .attention-matrix h4 {
          color: #e2e8f0;
          font-size: 16px;
          margin: 0 0 16px 0;
        }

        .matrix-grid {
          display: grid;
          grid-template-columns: 80px repeat(6, 1fr);
          gap: 2px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 8px;
          overflow-x: auto;
        }

        .matrix-corner {
          background: rgba(15, 23, 42, 0.6);
        }

        .matrix-label {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 4px;
        }

        .col-label {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        .matrix-cell {
          aspect-ratio: 1;
          border-radius: 4px;
          cursor: help;
          transition: transform 0.2s;
        }

        .matrix-cell:hover {
          transform: scale(1.1);
          z-index: 10;
        }

        .concepts {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 20px;
        }

        .concepts h4 {
          color: #e2e8f0;
          font-size: 16px;
          margin: 0 0 16px 0;
        }

        .concept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .concept-card {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .concept-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: 600;
        }

        .concept-title {
          color: #38bdf8;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .concept-desc {
          color: #94a3b8;
          font-size: 13px;
        }

        .formula {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .formula strong {
          color: #38bdf8;
          display: block;
          margin-bottom: 8px;
        }

        .formula code {
          color: #e2e8f0;
          font-size: 16px;
          font-family: 'Courier New', monospace;
        }

        @media (max-width: 768px) {
          .sequence-container {
            justify-content: center;
          }

          .matrix-grid {
            font-size: 10px;
          }

          .concept-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
