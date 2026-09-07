import React, { useState } from 'react';

interface SubmitNetworkProps {
  weights: number[][];
  vocabulary: string[];
  learningRate: number;
  selectedRule: string;
  onSubmit: (data: NetworkSubmission) => void;
}

export interface NetworkSubmission {
  name: string;
  description: string;
  tags: string[];
  weights: number[][];
  vocabulary: string[];
  learningRate: number;
  rule: string;
  isPublic: boolean;
  allowDerivatives: boolean;
}

export const SubmitNetwork: React.FC<SubmitNetworkProps> = ({
  weights,
  vocabulary,
  learningRate,
  selectedRule,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [allowDerivatives, setAllowDerivatives] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const suggestedTags = [
    'beginner', 'intermediate', 'advanced',
    'animals', 'colors', 'emotions', 'music', 'programming',
    'demo', 'education', 'research', 'creative',
    'topology', 'graph-theory', 'psychology', 'art'
  ];

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !tags.includes(normalized) && tags.length < 5) {
      setTags([...tags, normalized]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      alert('Please provide a name and description for your network');
      return;
    }

    if (tags.length === 0) {
      alert('Please add at least one tag');
      return;
    }

    setIsSubmitting(true);

    const submission: NetworkSubmission = {
      name: name.trim(),
      description: description.trim(),
      tags,
      weights,
      vocabulary,
      learningRate,
      rule: selectedRule,
      isPublic,
      allowDerivatives,
    };

    // Simulate API call
    setTimeout(() => {
      onSubmit(submission);
      setIsSubmitting(false);
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setName('');
        setDescription('');
        setTags([]);
        setSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const networkStats = {
    nodes: vocabulary.length,
    connections: weights.flat().filter(w => w > 0).length,
    avgWeight: (weights.flat().reduce((a, b) => a + b, 0) / weights.flat().length).toFixed(3),
    maxWeight: Math.max(...weights.flat()).toFixed(3),
  };

  return (
    <div className="submit-network">
      <div className="submit-header">
        <h3>📤 Submit to Community</h3>
        <p className="submit-subtitle">
          Share your network with the synaptiCITY community
        </p>
      </div>

      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h4>Successfully Submitted!</h4>
          <p>Your network has been added to the community library</p>
        </div>
      ) : (
        <>
          <div className="form-section">
            <label className="form-label">
              Network Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., My Amazing Neural Network"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <div className="char-count">{name.length}/50</div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe what your network does and what makes it interesting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={4}
            />
            <div className="char-count">{description.length}/300</div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Tags <span className="required">*</span> (up to 5)
            </label>
            <div className="tags-container">
              {tags.map(tag => (
                <div key={tag} className="tag-item">
                  {tag}
                  <button
                    className="tag-remove"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={tags.length >= 5}
            />
            <div className="suggested-tags">
              <span className="suggested-label">Suggested:</span>
              {suggestedTags.filter(t => !tags.includes(t)).slice(0, 8).map(tag => (
                <button
                  key={tag}
                  className="suggested-tag"
                  onClick={() => addTag(tag)}
                  disabled={tags.length >= 5}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Network Statistics</label>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">{networkStats.nodes}</div>
                <div className="stat-label">Nodes</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{networkStats.connections}</div>
                <div className="stat-label">Connections</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{networkStats.avgWeight}</div>
                <div className="stat-label">Avg Weight</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{selectedRule.toUpperCase()}</div>
                <div className="stat-label">Learning Rule</div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Permissions</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span className="checkbox-text">
                  <strong>Public Network</strong>
                  <span className="checkbox-hint">Anyone can view and download this network</span>
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={allowDerivatives}
                  onChange={(e) => setAllowDerivatives(e.target.checked)}
                />
                <span className="checkbox-text">
                  <strong>Allow Derivatives</strong>
                  <span className="checkbox-hint">Others can modify and build upon your network</span>
                </span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !name || !description || tags.length === 0}
            >
              {isSubmitting ? '⏳ Submitting...' : '📤 Submit Network'}
            </button>
          </div>

          <div className="submission-note">
            <strong>Note:</strong> By submitting, you agree to our community guidelines.
            Your network will be reviewed before appearing in the public library.
          </div>
        </>
      )}

      <style>{`
        .submit-network {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .submit-header h3 {
          color: #38bdf8;
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .submit-subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 24px 0;
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .required {
          color: #f87171;
        }

        .form-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 10px 12px;
          color: #e2e8f0;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: #38bdf8;
        }

        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-textarea {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 10px 12px;
          color: #e2e8f0;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #38bdf8;
        }

        .char-count {
          text-align: right;
          color: #64748b;
          font-size: 12px;
          margin-top: 4px;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
          min-height: 32px;
        }

        .tag-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.4);
          border-radius: 16px;
          padding: 6px 12px;
          color: #38bdf8;
          font-size: 12px;
        }

        .tag-remove {
          background: none;
          border: none;
          color: #38bdf8;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 0;
          width: 16px;
          height: 16px;
        }

        .tag-remove:hover {
          color: #f87171;
        }

        .suggested-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          align-items: center;
        }

        .suggested-label {
          color: #64748b;
          font-size: 12px;
        }

        .suggested-tag {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 12px;
          padding: 4px 10px;
          color: #38bdf8;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .suggested-tag:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.2);
        }

        .suggested-tag:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .stat-box {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .stat-value {
          color: #38bdf8;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 12px;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 3px;
          accent-color: #38bdf8;
        }

        .checkbox-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .checkbox-text strong {
          color: #e2e8f0;
          font-size: 14px;
        }

        .checkbox-hint {
          color: #94a3b8;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .btn-submit {
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.5);
          border-radius: 8px;
          padding: 14px 32px;
          color: #38bdf8;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.3);
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submission-note {
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
          padding: 12px;
          color: #94a3b8;
          font-size: 13px;
          margin-top: 20px;
        }

        .submission-note strong {
          color: #38bdf8;
        }

        .success-message {
          text-align: center;
          padding: 60px 20px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: rgba(34, 197, 94, 0.2);
          border: 2px solid #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22c55e;
          font-size: 40px;
          font-weight: bold;
          animation: successPop 0.5s ease-out;
        }

        @keyframes successPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-message h4 {
          color: #22c55e;
          margin: 0 0 12px 0;
          font-size: 24px;
        }

        .success-message p {
          color: #94a3b8;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
