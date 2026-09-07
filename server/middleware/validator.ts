import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check validation results
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

/**
 * Validation rules for network creation
 */
export const validateNetwork = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Description must not exceed 300 characters'),
  body('vocabulary')
    .isArray({ min: 2, max: 50 })
    .withMessage('Vocabulary must be an array with 2-50 items'),
  body('vocabulary.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each vocabulary word must be 1-30 characters'),
  body('weights')
    .isObject()
    .withMessage('Weights must be an object'),
  body('learning_rate')
    .isFloat({ min: 0.001, max: 1.0 })
    .withMessage('Learning rate must be between 0.001 and 1.0'),
  body('learning_rule')
    .isIn(['hebbian', 'stdp', 'bcm', 'oja'])
    .withMessage('Invalid learning rule'),
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be boolean'),
  body('allow_derivatives')
    .optional()
    .isBoolean()
    .withMessage('allow_derivatives must be boolean'),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 tags allowed'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Each tag must be 2-20 characters'),
  validate,
];

/**
 * Validation rules for profile updates
 */
export const validateProfile = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-20 characters (letters, numbers, _, -)'),
  body('display_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be 1-50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio must not exceed 200 characters'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  validate,
];

/**
 * Validation rules for comments
 */
export const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  body('parent_id')
    .optional()
    .isUUID()
    .withMessage('Parent ID must be a valid UUID'),
  validate,
];

/**
 * Validation rules for UUID parameters
 */
export const validateUUID = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate,
];

/**
 * Validation rules for pagination
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate,
];

/**
 * Validation rules for search
 */
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be 2-100 characters'),
  query('tags')
    .optional()
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        return value.split(',').map((t) => t.trim());
      }
      return value;
    }),
  validate,
];
