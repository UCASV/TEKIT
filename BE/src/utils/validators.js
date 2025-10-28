
// =============================================
// BE/src/utils/validators.js
// =============================================
import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: errors.array()
        });
    }
    next();
};

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{8,}$/;
    return phoneRegex.test(phone);
};

export const isStrongPassword = (password) => {
    // Mínimo 6 caracteres
    return password && password.length >= 6;
};