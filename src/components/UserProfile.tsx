import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  networks_created: number;
  networks_shared: number;
  achievements_unlocked: number;
  created_at: string;
}

interface SyncStatus {
  lastSync: number | null;
  isSyncing: boolean;
  syncError: string | null;
}

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    isSyncing: false,
    syncError: null,
  });

  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    loadProfile();
    // Auto-sync every 5 minutes
    const syncInterval = setInterval(() => {
      syncData();
    }, 300000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, []);

  const loadProfile = async () => {
    // In real app, this would call api.getMyProfile()
    // For now, using mock data
    const mockProfile: UserProfile = {
      id: 'user-123',
      username: 'neuralexplorer',
      display_name: 'Neural Explorer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neuralexplorer',
      bio: 'Passionate about neural networks and AI learning! 🧠✨',
      level: 12,
      total_xp: 4850,
      current_streak: 7,
      longest_streak: 21,
      networks_created: 47,
      networks_shared: 23,
      achievements_unlocked: 12,
      created_at: '2026-03-15T10:30:00Z',
    };

    setProfile(mockProfile);
    setFormData({
      username: mockProfile.username,
      display_name: mockProfile.display_name || '',
      bio: mockProfile.bio || '',
      avatar_url: mockProfile.avatar_url || '',
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username,
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real app: await api.updateProfile(formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (profile) {
        setProfile({
          ...profile,
          ...formData,
        });
      }
      
      setIsEditing(false);
      await syncData();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const syncData = async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncError: null }));
    
    try {
      // In real app, this would sync networks, achievements, etc.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSyncStatus({
        lastSync: Date.now(),
        isSyncing: false,
        syncError: null,
      });
    } catch (error: any) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncError: error.message || 'Sync failed',
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  if (!profile) {
    return (
      <div className="user-profile loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>👤 User Profile</h2>
        
        {/* Sync Status */}
        <div className="sync-status">
          {syncStatus.isSyncing ? (
            <span className="syncing">⏳ Syncing...</span>
          ) : syncStatus.syncError ? (
            <span className="sync-error">⚠️ Sync failed</span>
          ) : (
            <span className="synced">✓ Synced {formatLastSync(syncStatus.lastSync)}</span>
          )}
          <button onClick={syncData} disabled={syncStatus.isSyncing} className="sync-btn">
            🔄 Sync Now
          </button>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {profile.username.substring(0, 2).toUpperCase()}
              </div>
            )}
            
            <div className="profile-level">
              <span className="level-badge">Level {profile.level}</span>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: '65%' }} />
              </div>
              <span className="xp-text">{profile.total_xp} XP</span>
            </div>
          </div>

          <div className="profile-info">
            {!isEditing ? (
              <>
                <h3>{profile.display_name || profile.username}</h3>
                <p className="username">@{profile.username}</p>
                <p className="bio">{profile.bio || 'No bio yet'}</p>
                <button onClick={handleEdit} className="btn-edit">
                  ✏️ Edit Profile
                </button>
              </>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="Your display name"
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username (3-20 characters)"
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button onClick={handleSave} disabled={isSaving} className="btn-save">
                    {isSaving ? '💾 Saving...' : '💾 Save Changes'}
                  </button>
                  <button onClick={handleCancel} className="btn-cancel">
                    ✗ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-section">
          <h3>📊 Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{profile.networks_created}</div>
              <div className="stat-label">Networks Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{profile.networks_shared}</div>
              <div className="stat-label">Networks Shared</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{profile.achievements_unlocked}</div>
              <div className="stat-label">Achievements</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{profile.current_streak} 🔥</div>
              <div className="stat-label">Current Streak</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{profile.longest_streak}</div>
              <div className="stat-label">Longest Streak</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatDate(profile.created_at).split(',')[0]}</div>
              <div className="stat-label">Member Since</div>
            </div>
          </div>
        </div>

        {/* Cross-Device Info */}
        <div className="sync-info">
          <h3>📱 Cross-Device Sync</h3>
          <p>Your networks, achievements, and progress automatically sync across all your devices.</p>
          <div className="sync-devices">
            <div className="device-item">
              <span className="device-icon">💻</span>
              <span className="device-name">MacBook Pro</span>
              <span className="device-status active">Active</span>
            </div>
            <div className="device-item">
              <span className="device-icon">📱</span>
              <span className="device-name">iPhone 15</span>
              <span className="device-status">Last seen 2h ago</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .user-profile {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .profile-header h2 {
          color: #38bdf8;
          margin: 0;
          font-size: 24px;
        }

        .sync-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .syncing,
        .synced,
        .sync-error {
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 8px;
        }

        .syncing {
          background: rgba(234, 179, 8, 0.2);
          color: #eab308;
        }

        .synced {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .sync-error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .sync-btn {
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sync-btn:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.3);
        }

        .sync-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 24px;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
        }

        .profile-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid #38bdf8;
        }

        .profile-avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 40px;
          font-weight: 600;
        }

        .profile-level {
          text-align: center;
          width: 100%;
        }

        .level-badge {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 600;
        }

        .xp-bar {
          width: 100%;
          height: 8px;
          background: rgba(56, 189, 248, 0.2);
          border-radius: 4px;
          margin: 12px 0 6px;
          overflow: hidden;
        }

        .xp-fill {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          border-radius: 4px;
          transition: width 0.5s;
        }

        .xp-text {
          color: #94a3b8;
          font-size: 12px;
        }

        .profile-info h3 {
          color: #e2e8f0;
          margin: 0 0 4px 0;
          font-size: 24px;
        }

        .username {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 12px 0;
        }

        .bio {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .btn-edit {
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit:hover {
          background: rgba(56, 189, 248, 0.3);
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group label {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 10px 12px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .btn-save,
        .btn-cancel {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .btn-save:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.3);
        }

        .btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: rgba(100, 116, 139, 0.2);
          border: 1px solid rgba(100, 116, 139, 0.3);
          color: #94a3b8;
        }

        .btn-cancel:hover {
          background: rgba(100, 116, 139, 0.3);
        }

        .stats-section h3 {
          color: #e2e8f0;
          font-size: 18px;
          margin: 0 0 16px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .stat-item {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-value {
          color: #38bdf8;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 13px;
        }

        .sync-info {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          padding: 20px;
        }

        .sync-info h3 {
          color: #e2e8f0;
          font-size: 18px;
          margin: 0 0 12px 0;
        }

        .sync-info p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 16px 0;
        }

        .sync-devices {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .device-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
        }

        .device-icon {
          font-size: 24px;
        }

        .device-name {
          flex: 1;
          color: #e2e8f0;
          font-size: 14px;
        }

        .device-status {
          color: #64748b;
          font-size: 12px;
        }

        .device-status.active {
          color: #22c55e;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .profile-card {
            grid-template-columns: 1fr;
          }

          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .sync-status {
            width: 100%;
            justify-content: space-between;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
