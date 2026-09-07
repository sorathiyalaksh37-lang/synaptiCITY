import React, { useState } from 'react';

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  totalXP: number;
  achievements: number;
  rank: number;
  streak: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
  currentUserRank?: number;
  timeframe?: 'all-time' | 'monthly' | 'weekly';
  onTimeframeChange?: (timeframe: 'all-time' | 'monthly' | 'weekly') => void;
}

// Mock data for demonstration
const MOCK_ENTRIES: LeaderboardEntry[] = [
  {
    id: '1',
    username: 'NeuralMaster',
    level: 25,
    totalXP: 12450,
    achievements: 18,
    rank: 1,
    streak: 15,
  },
  {
    id: '2',
    username: 'SynapticGenius',
    level: 23,
    totalXP: 10830,
    achievements: 16,
    rank: 2,
    streak: 12,
  },
  {
    id: '3',
    username: 'HebbianHero',
    level: 22,
    totalXP: 9920,
    achievements: 15,
    rank: 3,
    streak: 10,
  },
  {
    id: '4',
    username: 'MemoryChamp',
    level: 21,
    totalXP: 8750,
    achievements: 14,
    rank: 4,
    streak: 8,
  },
  {
    id: '5',
    username: 'PatternPro',
    level: 20,
    totalXP: 7890,
    achievements: 13,
    rank: 5,
    streak: 7,
  },
  {
    id: 'current',
    username: 'You',
    level: 18,
    totalXP: 6420,
    achievements: 11,
    rank: 8,
    streak: 5,
    isCurrentUser: true,
  },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries = MOCK_ENTRIES,
  currentUserRank,
  timeframe = 'all-time',
  onTimeframeChange,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  const handleTimeframeChange = (tf: typeof timeframe) => {
    setSelectedTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return '#ffd700';
    if (rank === 2) return '#c0c0c0';
    if (rank === 3) return '#cd7f32';
    return 'var(--on-surface-variant)';
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h4>Leaderboard</h4>
        <div className="timeframe-selector">
          {(['all-time', 'monthly', 'weekly'] as const).map((tf) => (
            <button
              key={tf}
              className={`timeframe-btn ${selectedTimeframe === tf ? 'is-active' : ''}`}
              onClick={() => handleTimeframeChange(tf)}
            >
              {tf === 'all-time' ? 'All Time' : tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="podium">
        {entries.slice(0, 3).map((entry, index) => {
          const position = [1, 0, 2][index]; // Arrange as 2nd, 1st, 3rd
          const sortedEntry = entries[position];
          
          return (
            <div
              key={sortedEntry.id}
              className={`podium-place podium-place-${sortedEntry.rank}`}
              style={{ order: index }}
            >
              <div className="podium-avatar">
                {sortedEntry.avatar ? (
                  <img src={sortedEntry.avatar} alt={sortedEntry.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {sortedEntry.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="podium-rank-badge" style={{ color: getRankColor(sortedEntry.rank) }}>
                  {getRankIcon(sortedEntry.rank)}
                </div>
              </div>
              <div className="podium-info">
                <div className="podium-username">{sortedEntry.username}</div>
                <div className="podium-level">Level {sortedEntry.level}</div>
                <div className="podium-xp">{sortedEntry.totalXP.toLocaleString()} XP</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="leaderboard-table">
        <div className="table-header">
          <span className="col-rank">Rank</span>
          <span className="col-user">User</span>
          <span className="col-level">Level</span>
          <span className="col-xp">XP</span>
          <span className="col-achievements">Achievements</span>
          <span className="col-streak">Streak</span>
        </div>

        <div className="table-body">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`table-row ${entry.isCurrentUser ? 'is-current-user' : ''}`}
            >
              <span className="col-rank" style={{ color: getRankColor(entry.rank) }}>
                {getRankIcon(entry.rank)}
              </span>
              
              <span className="col-user">
                <div className="user-avatar-small">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.username} />
                  ) : (
                    <div className="avatar-placeholder-small">
                      {entry.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="username">{entry.username}</span>
                {entry.isCurrentUser && <span className="you-badge">YOU</span>}
              </span>

              <span className="col-level">
                <div className="level-badge-small">{entry.level}</div>
              </span>

              <span className="col-xp">{entry.totalXP.toLocaleString()}</span>

              <span className="col-achievements">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: 4 }}>
                  <path
                    d="M7 1L8.5 5H13L9.5 8L11 12L7 9L3 12L4.5 8L1 5H5.5L7 1Z"
                    fill="currentColor"
                  />
                </svg>
                {entry.achievements}
              </span>

              <span className="col-streak">
                {entry.streak > 0 && (
                  <>
                    <span className="streak-icon">🔥</span>
                    {entry.streak}
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="leaderboard-note">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10V7M7 4.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>
          Rankings update in real-time. Compete with others to climb the leaderboard!
        </span>
      </div>
    </div>
  );
};
