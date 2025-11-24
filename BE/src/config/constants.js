
export const ROLES = {
    CLIENTE: 1,
    PROFESIONAL: 2,
    ADMIN: 3
};

export const ESTADOS_RESERVA = {
    PENDIENTE: 'pendiente',
    ACEPTADA: 'aceptada',
    COMPLETADA: 'completada',
    CANCELADA: 'cancelada'
};

export const MESSAGES = {

    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
    EMAIL_ALREADY_EXISTS: 'El email ya está registrado',
    USER_NOT_FOUND: 'Usuario no encontrado',
    UNAUTHORIZED: 'No autorizado',
    TOKEN_INVALID: 'Token inválido',
    
    SUCCESS: 'Operación exitosa',
    ERROR: 'Ocurrió un error',
    REQUIRED_FIELDS: 'Faltan campos obligatorios',
    
    PROFILE_CREATED: 'Perfil profesional creado exitosamente',
    PROFILE_UPDATED: 'Perfil actualizado exitosamente',
    
    REVIEW_CREATED: 'Reseña creada exitosamente',
    REVIEW_EXISTS: 'Ya has dejado una reseña para este profesional',
    
    CONTACT_REGISTERED: 'Contacto registrado exitosamente'
};


export const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res, message = 'Error interno del servidor', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors })
    });
};

export const validationErrorResponse = (res, errors) => {
    return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
    });
};