import React, { useState, useEffect } from 'react';
import { BarChart3, Shield, Eye, EyeOff, Info } from 'lucide-react';
import { analytics } from '../lib/analytics';

export const AnalyticsSettings: React.FC = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(analytics.isEnabled());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setAnalyticsEnabled(analytics.isEnabled());
  }, []);

  const handleToggle = () => {
    const newValue = !analyticsEnabled;
    setAnalyticsEnabled(newValue);
    analytics.setEnabled(newValue);
  };

  return (
    <div className="analytics-settings">
      <div className="analytics-header">
        <div className="analytics-icon">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="analytics-title-section">
          <h3 className="analytics-title">Analytics & Performance</h3>
          <p className="analytics-subtitle">Help us improve synaptiCITY</p>
        </div>
      </div>

      <div className="analytics-toggle-card">
        <div className="toggle-content">
          <div className="toggle-text">
            <h4 className="toggle-title">
              {analyticsEnabled ? (
                <>
                  <Eye className="w-5 h-5" />
                  Analytics Enabled
                </>
              ) : (
                <>
                  <EyeOff className="w-5 h-5" />
                  Analytics Disabled
                </>
              )}
            </h4>
            <p className="toggle-description">
              {analyticsEnabled
                ? 'We\'re collecting anonymous usage data to improve the app'
                : 'No data is being collected'}
            </p>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={handleToggle}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="analytics-info">
        <button
          className="info-button"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info className="w-4 h-4" />
          {showDetails ? 'Hide details' : 'What data is collected?'}
        </button>

        {showDetails && (
          <div className="info-details">
            <div className="info-section">
              <h5 className="info-heading">
                <Shield className="w-4 h-4 text-green-400" />
                We collect:
              </h5>
              <ul className="info-list">
                <li>Page views and navigation patterns</li>
                <li>Feature usage (which tools you use)</li>
                <li>Performance metrics (load times, FPS)</li>
                <li>Error reports (to fix bugs faster)</li>
                <li>Achievement unlocks and challenge completions</li>
              </ul>
            </div>

            <div className="info-section">
              <h5 className="info-heading">
                <Shield className="w-4 h-4 text-red-400" />
                We DON'T collect:
              </h5>
              <ul className="info-list">
                <li>Personal information (name, email, etc.)</li>
                <li>Your network data or vocabulary</li>
                <li>Passwords or authentication tokens</li>
                <li>IP addresses or precise location</li>
                <li>Any data that identifies you personally</li>
              </ul>
            </div>

            <div className="info-section">
              <h5 className="info-heading">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Why we collect data:
              </h5>
              <ul className="info-list">
                <li>Understand which features are most useful</li>
                <li>Identify and fix bugs faster</li>
                <li>Improve performance and load times</li>
                <li>Prioritize new features based on usage</li>
                <li>Ensure the app works across devices</li>
              </ul>
            </div>

            <div className="info-footer">
              <p>
                All data is anonymous and aggregated. You can opt-out anytime.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="analytics-status">
        <div className="status-item">
          <span className="status-label">Session ID:</span>
          <span className="status-value">
            {analytics['sessionId']?.substring(0, 8)}...
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Provider:</span>
          <span className="status-value">
            {analytics['provider'] || 'Custom'}
          </span>
        </div>
      </div>
    </div>
  );
};
