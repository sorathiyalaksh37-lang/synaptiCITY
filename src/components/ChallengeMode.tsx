import React, { useState } from 'react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  objective: string;
  reward: {
    xp: number;
    badge?: string;
  };
  criteria: {
    type: string;
    target: number;
  };
  completed: boolean;
  progress: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'perfect-recall',
    title: 'Perfect Recall',
    description: 'Achieve 100% accuracy on 5 consecutive recalls',
    difficulty: 'medium',
    category: 'Recall Mastery',
    objective: 'Test your memory accuracy',
    reward: { xp: 150, badge: '🎯' },
    criteria: { type: 'recall-streak', target: 5 },
    completed: false,
    progress: 0,
  },
  {
    id: 'speed-learner',
    title: 'Speed Learner',
    description: 'Teach 10 associations in under 2 minutes',
    difficulty: 'hard',
    category: 'Teaching Efficiency',
    objective: 'Learn fast, learn well',
    reward: { xp: 200, badge: '⚡' },
    criteria: { type: 'speed-teaching', target: 10 },
    completed: false,
    progress: 0,
  },
  {
    id: 'network-architect',
    title: 'Network Architect',
    description: 'Create a network with 30+ active connections',
    difficulty: 'medium',
    category: 'Network Building',
    objective: 'Build a dense neural network',
    reward: { xp: 120, badge: '🏗️' },
    criteria: { type: 'connections', target: 30 },
    completed: false,
    progress: 0,
  },
  {
    id: 'topology-master',
    title: 'Topology Master',
    description: 'Complete a challenge in each topology type',
    difficulty: 'expert',
    category: 'Exploration',
    objective: 'Master all network structures',
    reward: { xp: 300, badge: '🌐' },
    criteria: { type: 'topology-diversity', target: 5 },
    completed: false,
    progress: 0,
  },
  {
    id: 'forgetting-curve',
    title: 'Forgetting Curve',
    description: 'Enable forgetting and maintain 80% accuracy after 20 recalls',
    difficulty: 'hard',
    category: 'Advanced Learning',
    objective: 'Overcome memory decay',
    reward: { xp: 250, badge: '📉' },
    criteria: { type: 'decay-accuracy', target: 0.8 },
    completed: false,
    progress: 0,
  },
  {
    id: 'hebbian-hero',
    title: 'Hebbian Hero',
    description: 'Teach 50 associations using only Hebbian learning',
    difficulty: 'easy',
    category: 'Learning Rules',
    objective: 'Master the classic rule',
    reward: { xp: 100, badge: '🧠' },
    criteria: { type: 'rule-specific', target: 50 },
    completed: false,
    progress: 0,
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Export 3 different data formats (JSON, CSV, PNG)',
    difficulty: 'easy',
    category: 'Data Export',
    objective: 'Master data extraction',
    reward: { xp: 80, badge: '📊' },
    criteria: { type: 'export-diversity', target: 3 },
    completed: false,
    progress: 0,
  },
  {
    id: 'pattern-expert',
    title: 'Pattern Expert',
    description: 'Successfully complete 10 pattern completion tests',
    difficulty: 'medium',
    category: 'Pattern Recognition',
    objective: 'Recognize learned patterns',
    reward: { xp: 140, badge: '🔍' },
    criteria: { type: 'pattern-completion', target: 10 },
    completed: false,
    progress: 0,
  },
];

interface ChallengeModeProps {
  challenges?: Challenge[];
  onChallengeStart: (challengeId: string) => void;
  onChallengeComplete: (challengeId: string) => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({
  challenges = CHALLENGES,
  onChallengeStart,
  onChallengeComplete,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Challenge['difficulty'] | 'all'>('all');

  const filteredChallenges = selectedDifficulty === 'all'
    ? challenges
    : challenges.filter((c) => c.difficulty === selectedDifficulty);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.reward.xp, 0);

  const difficultyColors = {
    easy: 'var(--success)',
    medium: 'var(--warning)',
    hard: 'var(--error)',
    expert: 'var(--tertiary)',
  };

  return (
    <div className="challenge-mode">
      <div className="challenge-header">
        <div className="challenge-title-section">
          <h4>Challenge Mode</h4>
          <p className="challenge-subtitle">
            Complete challenges to earn XP and exclusive badges
          </p>
        </div>
        <div className="challenge-stats">
          <div className="challenge-stat">
            <span className="stat-value">{completedCount} / {challenges.length}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="challenge-stat">
            <span className="stat-value">{totalXP}</span>
            <span className="stat-label">XP Earned</span>
          </div>
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="difficulty-filters">
        {(['all', 'easy', 'medium', 'hard', 'expert'] as const).map((difficulty) => (
          <button
            key={difficulty}
            className={`difficulty-btn ${selectedDifficulty === difficulty ? 'is-active' : ''}`}
            onClick={() => setSelectedDifficulty(difficulty)}
            style={{
              borderColor: difficulty !== 'all' ? difficultyColors[difficulty] : undefined,
            }}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {/* Challenge Grid */}
      <div className="challenge-grid">
        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`challenge-card ${challenge.completed ? 'is-completed' : ''}`}
          >
            <div className="challenge-card-header">
              <div className="challenge-badge">
                {challenge.reward.badge || '🏆'}
              </div>
              <span
                className="challenge-difficulty"
                style={{ color: difficultyColors[challenge.difficulty] }}
              >
                {challenge.difficulty}
              </span>
            </div>

            <div className="challenge-content">
              <h5 className="challenge-title">{challenge.title}</h5>
              <p className="challenge-description">{challenge.description}</p>

              <div className="challenge-meta">
                <span className="challenge-category">{challenge.category}</span>
                <span className="challenge-objective">{challenge.objective}</span>
              </div>

              {!challenge.completed && (
                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(challenge.progress / challenge.criteria.target) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {challenge.progress} / {challenge.criteria.target}
                  </span>
                </div>
              )}
            </div>

            <div className="challenge-footer">
              <div className="challenge-reward">
                <span className="reward-icon">⭐</span>
                <span className="reward-xp">+{challenge.reward.xp} XP</span>
              </div>

              {challenge.completed ? (
                <div className="challenge-completed-badge">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8L6 11L13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Completed</span>
                </div>
              ) : (
                <button
                  className="challenge-start-btn"
                  onClick={() => onChallengeStart(challenge.id)}
                >
                  Start Challenge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
