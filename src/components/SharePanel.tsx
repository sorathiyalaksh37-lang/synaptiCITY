import React, { useState } from 'react';
import html2canvas from 'html2canvas';

interface SharePanelProps {
  weights: number[][];
  vocabulary: string[];
  learningRate: number;
  selectedRule: string;
}

export const SharePanel: React.FC<SharePanelProps> = ({
  weights,
  vocabulary,
  learningRate,
  selectedRule,
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [screenshotTaken, setScreenshotTaken] = useState(false);

  const generateShareUrl = () => {
    const state = {
      w: weights,
      v: vocabulary,
      lr: learningRate,
      rule: selectedRule,
      t: Date.now(),
    };

    // Compress state to base64
    const encoded = btoa(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    
    setShareUrl(url);
    return url;
  };

  const copyToClipboard = async () => {
    const url = shareUrl || generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnTwitter = () => {
    const url = shareUrl || generateShareUrl();
    const text = `Check out my neural network in synaptiCITY! 🧠✨`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const shareOnFacebook = () => {
    const url = shareUrl || generateShareUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    const url = shareUrl || generateShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const takeScreenshot = async () => {
    setIsGenerating(true);
    try {
      const element = document.querySelector('.main-container') as HTMLElement;
      if (!element) {
        throw new Error('Main container not found');
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0e1a',
        scale: 2,
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `synaptiCITY-network-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          setScreenshotTaken(true);
          setTimeout(() => setScreenshotTaken(false), 2000);
        }
      });
    } catch (err) {
      console.error('Screenshot failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const embedCode = shareUrl
    ? `<iframe src="${shareUrl}" width="800" height="600" frameborder="0"></iframe>`
    : '';

  return (
    <div className="share-panel">
      <h3>📤 Share Your Network</h3>

      <div className="share-section">
        <h4>🔗 Shareable Link</h4>
        <p className="share-description">
          Generate a URL that captures your current network state
        </p>
        
        <button 
          className="btn-primary"
          onClick={generateShareUrl}
          disabled={!!shareUrl}
        >
          {shareUrl ? '✓ Link Generated' : 'Generate Share Link'}
        </button>

        {shareUrl && (
          <div className="share-url-container">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-url-input"
            />
            <button
              className="btn-copy"
              onClick={copyToClipboard}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        )}
      </div>

      {shareUrl && (
        <>
          <div className="share-section">
            <h4>🌐 Social Media</h4>
            <div className="social-buttons">
              <button className="btn-social twitter" onClick={shareOnTwitter}>
                <span className="social-icon">🐦</span>
                Twitter
              </button>
              <button className="btn-social facebook" onClick={shareOnFacebook}>
                <span className="social-icon">👍</span>
                Facebook
              </button>
              <button className="btn-social linkedin" onClick={shareOnLinkedIn}>
                <span className="social-icon">💼</span>
                LinkedIn
              </button>
            </div>
          </div>

          <div className="share-section">
            <h4>📝 Embed Code</h4>
            <textarea
              className="embed-code"
              value={embedCode}
              readOnly
              rows={3}
            />
          </div>
        </>
      )}

      <div className="share-section">
        <h4>📸 Screenshot</h4>
        <p className="share-description">
          Capture your network as a PNG image
        </p>
        <button
          className="btn-primary"
          onClick={takeScreenshot}
          disabled={isGenerating}
        >
          {isGenerating ? '⏳ Generating...' : screenshotTaken ? '✓ Downloaded!' : '📸 Take Screenshot'}
        </button>
      </div>

      <div className="share-stats">
        <div className="stat-item">
          <span className="stat-label">Nodes:</span>
          <span className="stat-value">{vocabulary.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Connections:</span>
          <span className="stat-value">
            {weights.flat().filter(w => w > 0).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Weight:</span>
          <span className="stat-value">
            {(weights.flat().reduce((a, b) => a + b, 0) / weights.flat().length).toFixed(3)}
          </span>
        </div>
      </div>

      <style>{`
        .share-panel {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .share-panel h3 {
          color: #38bdf8;
          margin: 0 0 20px 0;
          font-size: 20px;
        }

        .share-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
        }

        .share-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .share-section h4 {
          color: #38bdf8;
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .share-description {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 12px 0;
        }

        .share-url-container {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .share-url-input {
          flex: 1;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 10px 12px;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }

        .btn-copy {
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.5);
          border-radius: 8px;
          padding: 10px 16px;
          color: #38bdf8;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-copy:hover {
          background: rgba(56, 189, 248, 0.3);
          transform: translateY(-1px);
        }

        .social-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .btn-social {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-social.twitter {
          background: rgba(29, 155, 240, 0.1);
          border-color: rgba(29, 155, 240, 0.3);
          color: #1d9bf0;
        }

        .btn-social.twitter:hover {
          background: rgba(29, 155, 240, 0.2);
        }

        .btn-social.facebook {
          background: rgba(24, 119, 242, 0.1);
          border-color: rgba(24, 119, 242, 0.3);
          color: #1877f2;
        }

        .btn-social.facebook:hover {
          background: rgba(24, 119, 242, 0.2);
        }

        .btn-social.linkedin {
          background: rgba(10, 102, 194, 0.1);
          border-color: rgba(10, 102, 194, 0.3);
          color: #0a66c2;
        }

        .btn-social.linkedin:hover {
          background: rgba(10, 102, 194, 0.2);
        }

        .social-icon {
          font-size: 18px;
        }

        .embed-code {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: #e2e8f0;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          resize: vertical;
        }

        .share-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(56, 189, 248, 0.2);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 12px;
        }

        .stat-value {
          color: #38bdf8;
          font-size: 18px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .share-panel {
            padding: 16px;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }

          .share-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
