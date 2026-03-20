import { body } from "express-validator";

export const validateExpenseAdd= [
    body('description').notEmpty().withMessage('Description is required'),
    body('amount').notEmpty().withMessage('Amount is required').isNumeric().withMessage('Amount must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').notEmpty().withMessage('Date is required').isDate().withMessage('Date must be a valid date'),
];
export const validateExpenseUpdate= [
    body('description').notEmpty().withMessage('Description is required'),
    body('amount').notEmpty().withMessage('Amount is required').isNumeric().withMessage('Amount must be a number'), 
    body('category').notEmpty().withMessage('Category is required'),
    body('date').notEmpty().withMessage('Date is required').isDate().withMessage('Date must be a valid date'),
];
