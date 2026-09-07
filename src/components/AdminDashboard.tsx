import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface AdminStats {
  totalUsers: number;
  totalNetworks: number;
  totalLikes: number;
  activeUsers24h: number;
  networksToday: number;
  flaggedContent: number;
}

interface FlaggedItem {
  id: string;
  type: 'network' | 'comment';
  content: any;
  reportedBy: string;
  reason: string;
  timestamp: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalNetworks: 3892,
    totalLikes: 15634,
    activeUsers24h: 342,
    networksToday: 67,
    flaggedContent: 8,
  });

  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([
    {
      id: '1',
      type: 'network',
      content: { name: 'Inappropriate Network', author: 'user123' },
      reportedBy: 'moderator1',
      reason: 'Spam content',
      timestamp: Date.now() - 3600000,
    },
    {
      id: '2',
      type: 'comment',
      content: { text: 'Offensive comment here...', author: 'user456' },
      reportedBy: 'user789',
      reason: 'Harassment',
      timestamp: Date.now() - 7200000,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id: string) => {
    setFlaggedItems(items => items.filter(item => item.id !== id));
    console.log('Approved item:', id);
  };

  const handleRemove = (id: string) => {
    setFlaggedItems(items => items.filter(item => item.id !== id));
    console.log('Removed item:', id);
  };

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>🛡️ Admin Dashboard</h2>
        <p className="admin-subtitle">Content moderation and platform management</p>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📦 Content
        </button>
        <button
          className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          🚨 Reports {flaggedItems.length > 0 && <span className="badge">{flaggedItems.length}</span>}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🧠</div>
              <div className="stat-details">
                <div className="stat-value">{stats.totalNetworks.toLocaleString()}</div>
                <div className="stat-label">Networks Created</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-details">
                <div className="stat-value">{stats.totalLikes.toLocaleString()}</div>
                <div className="stat-label">Total Likes</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-details">
                <div className="stat-value">{stats.activeUsers24h}</div>
                <div className="stat-label">Active Users (24h)</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🆕</div>
              <div className="stat-details">
                <div className="stat-value">{stats.networksToday}</div>
                <div className="stat-label">Networks Today</div>
              </div>
            </div>

            <div className="stat-card alert">
              <div className="stat-icon">⚠️</div>
              <div className="stat-details">
                <div className="stat-value">{stats.flaggedContent}</div>
                <div className="stat-label">Flagged Items</div>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">✅</span>
                <span className="activity-text">Network "Deep Learning Demo" approved</span>
                <span className="activity-time">5m ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-icon">👤</span>
                <span className="activity-text">New user "neuralmaster" registered</span>
                <span className="activity-time">12m ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-icon">🗑️</span>
                <span className="activity-text">Spam network removed by moderator</span>
                <span className="activity-time">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Level</th>
                  <th>Networks</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">JD</div>
                      <span>johndoe</span>
                    </div>
                  </td>
                  <td>john@example.com</td>
                  <td><span className="level-badge">Level 12</span></td>
                  <td>47</td>
                  <td>Mar 15, 2026</td>
                  <td>
                    <button className="action-btn">View</button>
                    <button className="action-btn warn">Ban</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="admin-content">
          <h3>Flagged Content</h3>
          {flaggedItems.length === 0 ? (
            <div className="empty-state">
              <p>✅ No flagged content to review</p>
            </div>
          ) : (
            <div className="flagged-list">
              {flaggedItems.map((item) => (
                <div key={item.id} className="flagged-item">
                  <div className="flagged-header">
                    <span className="flagged-type">{item.type}</span>
                    <span className="flagged-time">{formatTimeAgo(item.timestamp)}</span>
                  </div>
                  
                  <div className="flagged-content">
                    {item.type === 'network' ? (
                      <div>
                        <strong>{item.content.name}</strong>
                        <p>by {item.content.author}</p>
                      </div>
                    ) : (
                      <p>{item.content.text}</p>
                    )}
                  </div>

                  <div className="flagged-meta">
                    <span>Reported by: <strong>{item.reportedBy}</strong></span>
                    <span>Reason: <strong>{item.reason}</strong></span>
                  </div>

                  <div className="flagged-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(item.id)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemove(item.id)}
                    >
                      ✗ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .admin-dashboard {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .admin-header h2 {
          color: #38bdf8;
          margin: 0 0 8px 0;
          font-size: 24px;
        }

        .admin-subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 24px 0;
        }

        .admin-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid rgba(56, 189, 248, 0.2);
        }

        .admin-tab {
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

        .admin-tab:hover {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.05);
        }

        .admin-tab.active {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
        }

        .admin-tab .badge {
          background: #ef4444;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
          margin-left: 6px;
        }

        .admin-content {
          margin-top: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(56, 189, 248, 0.5);
        }

        .stat-card.alert {
          border-color: rgba(239, 68, 68, 0.5);
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-value {
          color: #38bdf8;
          font-size: 28px;
          font-weight: 600;
          line-height: 1;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 13px;
          margin-top: 4px;
        }

        .recent-activity h3 {
          color: #e2e8f0;
          font-size: 18px;
          margin: 0 0 16px 0;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
        }

        .activity-icon {
          font-size: 20px;
        }

        .activity-text {
          flex: 1;
          color: #e2e8f0;
          font-size: 14px;
        }

        .activity-time {
          color: #64748b;
          font-size: 12px;
        }

        .search-bar {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 10px 16px;
          color: #e2e8f0;
          font-size: 14px;
        }

        .users-table {
          overflow-x: auto;
        }

        .users-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          padding: 12px;
          text-align: left;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 12px;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          color: #e2e8f0;
          font-size: 14px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .level-badge {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .action-btn {
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          margin-right: 8px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(56, 189, 248, 0.3);
        }

        .action-btn.warn {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .action-btn.warn:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .flagged-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .flagged-item {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 20px;
        }

        .flagged-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .flagged-type {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .flagged-time {
          color: #64748b;
          font-size: 12px;
        }

        .flagged-content {
          color: #e2e8f0;
          margin-bottom: 12px;
          padding: 12px;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
        }

        .flagged-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          color: #94a3b8;
          font-size: 13px;
        }

        .flagged-meta strong {
          color: #e2e8f0;
        }

        .flagged-actions {
          display: flex;
          gap: 12px;
        }

        .btn-approve,
        .btn-remove {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-approve {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .btn-approve:hover {
          background: rgba(34, 197, 94, 0.3);
        }

        .btn-remove {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .btn-remove:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .admin-tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .users-table {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};
