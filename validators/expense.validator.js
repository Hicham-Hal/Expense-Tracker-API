import { body, param, query } from "express-validator";

const EXPENSE_CATEGORIES = ['groceries', 'leisure', 'electronics', 'utilities', 'clothing', 'health', 'others']

export const expenseAddValidator = [
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 8, max: 150 }).withMessage('Description must be between 8 and 150 characters'),

    body('amount')
        .trim()
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number'),
    
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`)
]

export const expenseUpValidator = [
    param('id')
        .isMongoId().withMessage('Invalid expense Id'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 150 }).withMessage('Description must be at most 150 characters'),

    body('amount')
        .trim()
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number'),
    
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}`),
        
    query('filter')
        .optional(),
    
    query('start')
        .optional(),
    
    query('end')
        .optional()
]