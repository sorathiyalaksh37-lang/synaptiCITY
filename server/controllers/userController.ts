import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

/**
 * Get user profile by ID or username
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if id is a UUID or username
    const idParam = Array.isArray(id) ? id[0] : id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam);

    const query = supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (isUUID) {
      query.eq('id', idParam);
    } else {
      query.eq('username', idParam);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Profile not found',
      });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message,
    });
  }
};

/**
 * Get current user's profile
 */
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json({ data });
  } catch (error: any) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message,
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const updates = req.body;

    // Don't allow updating certain fields
    delete updates.id;
    delete updates.created_at;
    delete updates.level;
    delete updates.total_xp;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ data });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message,
    });
  }
};

/**
 * Get user's achievements
 */
export const getUserAchievements = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', id);

    if (error) throw error;

    res.json({ data });
  } catch (error: any) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      error: 'Failed to fetch achievements',
      message: error.message,
    });
  }
};

/**
 * Get user's activity log
 */
export const getUserActivity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { limit = 50 } = req.query;

    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit as string));

    if (error) throw error;

    res.json({ data });
  } catch (error: any) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      error: 'Failed to fetch activity',
      message: error.message,
    });
  }
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { timeframe = 'all_time', limit = 100 } = req.query;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, level, total_xp, current_streak')
      .order('total_xp', { ascending: false })
      .limit(parseInt(limit as string));

    if (error) throw error;

    // Add rank to each user
    const rankedData = data?.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json({ data: rankedData });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch leaderboard',
      message: error.message,
    });
  }
};

/**
 * Update user stats (XP, level, streaks)
 */
export const updateUserStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { xp_gained, action } = req.body;

    if (!xp_gained || !action) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'xp_gained and action are required',
      });
    }

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp, level')
      .eq('id', req.user.id)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Calculate new XP and level
    const newTotalXP = profile.total_xp + xp_gained;
    const newLevel = calculateLevel(newTotalXP);

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        total_xp: newTotalXP,
        level: newLevel,
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: req.user.id,
      action,
      metadata: { xp_gained, new_level: newLevel },
    });

    res.json({
      data,
      xp_gained,
      level_up: newLevel > profile.level,
    });
  } catch (error: any) {
    console.error('Update user stats error:', error);
    res.status(500).json({
      error: 'Failed to update stats',
      message: error.message,
    });
  }
};

/**
 * Calculate level from total XP (exponential curve)
 */
function calculateLevel(totalXP: number): number {
  // Formula: level = floor(1 + log₁.₅(totalXP / 100))
  // This means: Level 1 = 0-99 XP, Level 2 = 100-249 XP, Level 3 = 250-474 XP, etc.
  if (totalXP < 100) return 1;
  return Math.floor(1 + Math.log(totalXP / 100) / Math.log(1.5));
}
