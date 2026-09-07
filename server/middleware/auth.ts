import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}

/**
 * Middleware to verify JWT token from Supabase Auth
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed',
      });
    }

    // Attach user to request
    req.user = {
      id: data.user.id,
      email: data.user.email!,
      username: data.user.user_metadata?.username,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data } = await supabase.auth.getUser(token);

      if (data.user) {
        req.user = {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.username,
        };
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors
    console.warn('Optional auth warning:', error);
    next();
  }
};
