import { verifyToken } from '../utils/helpers.js';
import { User } from '../models/User.js';
import { errorResponse } from '../config/constants.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return errorResponse(res, 'Token no proporcionado', 401);
        }

        const decoded = verifyToken(token);
        
        if (!decoded) {
            return errorResponse(res, 'Token inválido o expirado', 401);
        }

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return errorResponse(res, 'Usuario no encontrado', 404);
        }

        req.user = {
            id: user.id,
            email: user.email,
            rol_id: user.rol_id,
            rol_nombre: user.rol_nombre
        };

        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        return errorResponse(res, 'Error de autenticación', 401);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol_id)) {
            return errorResponse(res, 'No tienes permisos para esta acción', 403);
        }
        next();
    };
};