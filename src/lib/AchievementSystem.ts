/**
 * Achievement and gamification system
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'teaching' | 'recall' | 'network' | 'exploration' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  xp: number;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  target: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  totalXP: number;
  achievements: Achievement[];
  stats: {
    totalTeachings: number;
    totalRecalls: number;
    successfulRecalls: number;
    networksCreated: number;
    maxConnections: number;
    daysActive: number;
    streak: number;
  };
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Teaching achievements
  {
    id: 'first-teach',
    name: 'First Lesson',
    description: 'Teach your first association',
    icon: '🎓',
    category: 'teaching',
    tier: 'bronze',
    xp: 10,
    target: 1,
  },
  {
    id: 'teacher-10',
    name: 'Dedicated Teacher',
    description: 'Teach 10 associations',
    icon: '👨‍🏫',
    category: 'teaching',
    tier: 'silver',
    xp: 50,
    target: 10,
  },
  {
    id: 'teacher-50',
    name: 'Master Educator',
    description: 'Teach 50 associations',
    icon: '🎖️',
    category: 'teaching',
    tier: 'gold',
    xp: 200,
    target: 50,
  },
  {
    id: 'teacher-100',
    name: 'Legend of Learning',
    description: 'Teach 100 associations',
    icon: '👑',
    category: 'teaching',
    tier: 'platinum',
    xp: 500,
    target: 100,
  },

  // Recall achievements
  {
    id: 'first-recall',
    name: 'Memory Test',
    description: 'Test your first recall',
    icon: '🧠',
    category: 'recall',
    tier: 'bronze',
    xp: 10,
    target: 1,
  },
  {
    id: 'recall-accuracy-80',
    name: 'Sharp Mind',
    description: 'Achieve 80% recall accuracy',
    icon: '🎯',
    category: 'recall',
    tier: 'silver',
    xp: 75,
    target: 0.8,
  },
  {
    id: 'recall-accuracy-95',
    name: 'Perfect Memory',
    description: 'Achieve 95% recall accuracy',
    icon: '💎',
    category: 'recall',
    tier: 'gold',
    xp: 250,
    target: 0.95,
  },
  {
    id: 'recall-streak-10',
    name: 'Consistent Recall',
    description: '10 successful recalls in a row',
    icon: '🔥',
    category: 'recall',
    tier: 'silver',
    xp: 100,
    target: 10,
  },

  // Network achievements
  {
    id: 'dense-network',
    name: 'Well Connected',
    description: 'Create a network with 20+ connections',
    icon: '🕸️',
    category: 'network',
    tier: 'silver',
    xp: 60,
    target: 20,
  },
  {
    id: 'large-network',
    name: 'Network Architect',
    description: 'Create a network with 50+ connections',
    icon: '🏗️',
    category: 'network',
    tier: 'gold',
    xp: 150,
    target: 50,
  },
  {
    id: 'topology-explorer',
    name: 'Topology Explorer',
    description: 'Try all 5 network topologies',
    icon: '🌐',
    category: 'exploration',
    tier: 'silver',
    xp: 80,
    target: 5,
  },

  // Exploration achievements
  {
    id: 'rule-explorer',
    name: 'Rule Explorer',
    description: 'Try all 4 learning rules',
    icon: '🔬',
    category: 'exploration',
    tier: 'bronze',
    xp: 40,
    target: 4,
  },
  {
    id: 'formula-master',
    name: 'Formula Master',
    description: 'Use the formula playground 10 times',
    icon: '📐',
    category: 'exploration',
    tier: 'silver',
    xp: 60,
    target: 10,
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Export network data 5 times',
    icon: '📊',
    category: 'exploration',
    tier: 'bronze',
    xp: 30,
    target: 5,
  },

  // Mastery achievements
  {
    id: 'week-streak',
    name: 'Dedicated Learner',
    description: 'Use synaptiCITY for 7 days in a row',
    icon: '📅',
    category: 'mastery',
    tier: 'gold',
    xp: 200,
    target: 7,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete all tutorials and challenges',
    icon: '🏆',
    category: 'mastery',
    tier: 'platinum',
    xp: 1000,
    target: 1,
  },
];

export class AchievementSystem {
  private progress: UserProgress;

  constructor(savedProgress?: Partial<UserProgress>) {
    this.progress = {
      level: savedProgress?.level || 1,
      xp: savedProgress?.xp || 0,
      totalXP: savedProgress?.totalXP || 0,
      achievements: this.initializeAchievements(savedProgress?.achievements),
      stats: {
        totalTeachings: 0,
        totalRecalls: 0,
        successfulRecalls: 0,
        networksCreated: 0,
        maxConnections: 0,
        daysActive: 0,
        streak: 0,
        ...savedProgress?.stats,
      },
    };
  }

  private initializeAchievements(saved?: Achievement[]): Achievement[] {
    return ACHIEVEMENTS.map((template) => {
      const savedAchievement = saved?.find((a) => a.id === template.id);
      return {
        ...template,
        unlocked: savedAchievement?.unlocked || false,
        unlockedAt: savedAchievement?.unlockedAt,
        progress: savedAchievement?.progress || 0,
      };
    });
  }

  getProgress(): UserProgress {
    return { ...this.progress };
  }

  addXP(amount: number): { levelUp: boolean; newLevel: number } {
    this.progress.xp += amount;
    this.progress.totalXP += amount;

    const xpForNextLevel = this.getXPForLevel(this.progress.level + 1);
    
    if (this.progress.xp >= xpForNextLevel) {
      this.progress.level += 1;
      this.progress.xp -= xpForNextLevel;
      return { levelUp: true, newLevel: this.progress.level };
    }

    return { levelUp: false, newLevel: this.progress.level };
  }

  getXPForLevel(level: number): number {
    // Exponential XP curve: 100 * 1.5^(level-1)
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  checkAchievements(event: string, value: number): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    this.progress.achievements.forEach((achievement) => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      // Update progress based on event
      switch (event) {
        case 'teach':
          if (achievement.id.startsWith('teacher-') || achievement.id === 'first-teach') {
            achievement.progress = this.progress.stats.totalTeachings;
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;

        case 'recall':
          if (achievement.id.startsWith('recall-') && !achievement.id.includes('accuracy')) {
            achievement.progress += 1;
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;

        case 'recall-accuracy':
          if (achievement.id.includes('accuracy')) {
            achievement.progress = value;
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;

        case 'connections':
          if (achievement.id.includes('network') && (achievement.id.includes('dense') || achievement.id.includes('large'))) {
            achievement.progress = value;
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;

        case 'topology':
          if (achievement.id === 'topology-explorer') {
            achievement.progress = Math.min(achievement.progress + 1, achievement.target);
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;

        case 'learning-rule':
          if (achievement.id === 'rule-explorer') {
            achievement.progress = Math.min(achievement.progress + 1, achievement.target);
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;

        case 'export':
          if (achievement.id === 'data-scientist') {
            achievement.progress += 1;
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;

        case 'formula-use':
          if (achievement.id === 'formula-master') {
            achievement.progress += 1;
            shouldUnlock = achievement.progress >= achievement.target;
          }
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        newlyUnlocked.push(achievement);
        this.addXP(achievement.xp);
      }
    });

    return newlyUnlocked;
  }

  updateStats(stat: keyof UserProgress['stats'], value: number): void {
    this.progress.stats[stat] = value;
  }

  incrementStat(stat: keyof UserProgress['stats']): void {
    this.progress.stats[stat] += 1;
  }

  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.progress.achievements.filter((a) => a.category === category);
  }

  getUnlockedAchievements(): Achievement[] {
    return this.progress.achievements.filter((a) => a.unlocked);
  }

  getLockedAchievements(): Achievement[] {
    return this.progress.achievements.filter((a) => !a.unlocked);
  }

  getCompletionPercentage(): number {
    const unlocked = this.getUnlockedAchievements().length;
    const total = this.progress.achievements.length;
    return (unlocked / total) * 100;
  }

  save(): string {
    return JSON.stringify(this.progress);
  }

  static load(data: string): AchievementSystem {
    try {
      const progress = JSON.parse(data);
      return new AchievementSystem(progress);
    } catch (error) {
      return new AchievementSystem();
    }
  }
}
