import { Router } from 'express';
import {
  getProfile,
  getMyProfile,
  updateProfile,
  getUserAchievements,
  getUserActivity,
  getLeaderboard,
  updateUserStats,
} from '../controllers/userController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateProfile } from '../middleware/validator';

const router = Router();

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/:id', optionalAuth, getProfile);
router.get('/:id/achievements', getUserAchievements);

// Protected routes
router.get('/me/profile', authenticate, getMyProfile);
router.put('/me/profile', authenticate, validateProfile, updateProfile);
router.get('/me/activity', authenticate, getUserActivity);
router.post('/me/stats', authenticate, updateUserStats);

export default router;
