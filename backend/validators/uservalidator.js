import { body } from "express-validator";

export const validateUserRegistration = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),   
];

export const validateUserLogin = [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),   
];
export const validateUserUpdate = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required'),
];
export const validateUpdatePassword = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').notEmpty().withMessage('New password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];