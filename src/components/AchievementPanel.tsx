import React, { useState } from 'react';
import type { Achievement } from '../lib/AchievementSystem';

interface AchievementPanelProps {
  achievements: Achievement[];
  level: number;
  xp: number;
  xpForNextLevel: number;
  totalXP: number;
  onCategoryFilter?: (category: Achievement['category'] | 'all') => void;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({
  achievements,
  level,
  xp,
  xpForNextLevel,
  totalXP,
  onCategoryFilter,
}) => {
  const [filter, setFilter] = useState<Achievement['category'] | 'all'>('all');

  const handleFilterChange = (category: Achievement['category'] | 'all') => {
    setFilter(category);
    onCategoryFilter?.(category);
  };

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter((a) => a.category === filter);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPercentage = (unlockedCount / achievements.length) * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

  const tierColors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
  };

  return (
    <div className="achievement-panel">
      <div className="achievement-header">
        <h4>Achievements</h4>
        <div className="achievement-stats">
          <span className="achievement-count">
            {unlockedCount} / {achievements.length}
          </span>
          <div className="completion-bar">
            <div 
              className="completion-bar-fill" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Level and XP Display */}
      <div className="level-display">
        <div className="level-info">
          <div className="level-badge">
            <span className="level-number">{level}</span>
            <span className="level-label">Level</span>
          </div>
          <div className="xp-info">
            <div className="xp-bar">
              <div 
                className="xp-bar-fill" 
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="xp-text">
              <span className="xp-current">{xp} XP</span>
              <span className="xp-divider">/</span>
              <span className="xp-next">{xpForNextLevel} XP</span>
            </div>
            <div className="xp-total">Total: {totalXP.toLocaleString()} XP</div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="achievement-filters">
        {(['all', 'teaching', 'recall', 'network', 'exploration', 'mastery'] as const).map((category) => (
          <button
            key={category}
            className={`filter-btn ${filter === category ? 'is-active' : ''}`}
            onClick={() => handleFilterChange(category)}
          >
            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="achievement-grid">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'is-unlocked' : 'is-locked'}`}
            style={{
              borderColor: achievement.unlocked ? tierColors[achievement.tier] : undefined,
            }}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            
            <div className="achievement-content">
              <div className="achievement-title">{achievement.name}</div>
              <div className="achievement-description">{achievement.description}</div>
              
              {!achievement.unlocked && (
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {achievement.progress} / {achievement.target}
                  </span>
                </div>
              )}
              
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="achievement-unlocked">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7L5 10L12 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="achievement-footer">
              <span 
                className="achievement-tier"
                style={{ color: tierColors[achievement.tier] }}
              >
                {achievement.tier}
              </span>
              <span className="achievement-xp">+{achievement.xp} XP</span>
            </div>

            {achievement.unlocked && (
              <div className="achievement-shine" />
            )}
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="empty-achievements">
          <p>No achievements in this category yet</p>
        </div>
      )}
    </div>
  );
};
