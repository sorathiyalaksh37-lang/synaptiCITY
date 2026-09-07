import { Router } from 'express';
import {
  getNetworks,
  getNetwork,
  createNetwork,
  updateNetwork,
  deleteNetwork,
  likeNetwork,
  unlikeNetwork,
  getMyNetworks,
} from '../controllers/networkController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { createNetworkLimiter, interactionLimiter } from '../middleware/rateLimiter';
import {
  validateNetwork,
  validateUUID,
  validatePagination,
  validateSearch,
} from '../middleware/validator';

const router = Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, validatePagination, validateSearch, getNetworks);
router.get('/:id', optionalAuth, validateUUID, getNetwork);

// Protected routes (require authentication)
router.get('/me/networks', authenticate, getMyNetworks);
router.post('/', authenticate, createNetworkLimiter, validateNetwork, createNetwork);
router.put('/:id', authenticate, validateUUID, validateNetwork, updateNetwork);
router.delete('/:id', authenticate, validateUUID, deleteNetwork);

// Interaction routes
router.post('/:id/like', authenticate, interactionLimiter, validateUUID, likeNetwork);
router.delete('/:id/like', authenticate, interactionLimiter, validateUUID, unlikeNetwork);

export default router;
