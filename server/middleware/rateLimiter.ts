import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again after 15 minutes',
  },
  skipSuccessfulRequests: true,
});

// Limiter for network creation (prevent spam)
export const createNetworkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 network creations per hour
  message: {
    error: 'Network creation limit reached',
    message: 'You can create up to 10 networks per hour',
  },
});

// Limiter for likes/interactions
export const interactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 interactions per minute
  message: {
    error: 'Too many interactions',
    message: 'Please slow down',
  },
});
