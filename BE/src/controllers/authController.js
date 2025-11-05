import { User } from '../models/User.js';
import { Professional } from '../models/Professional.js';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers.js';
import { successResponse, errorResponse } from '../config/constants.js';
import { ROLES, MESSAGES } from '../config/constants.js';

export const register = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            phone, 
            password,
            accountType,
            profession,
            experience,
            description,
            hourlyRate
        } = req.body;

        // Validaciones básicas
        if (!firstName || !lastName || !email || !password) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
        }

        // Verificar si el email ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return errorResponse(res, MESSAGES.EMAIL_ALREADY_EXISTS, 400);
        }

        // Hash de password
        const hashedPassword = await hashPassword(password);

        // Determinar rol
        const rol_id = accountType === 'professional' ? ROLES.PROFESIONAL : ROLES.CLIENTE;

        // Crear usuario
        const userData = {
            nombre: firstName,
            apellido: lastName,
            email,
            password: hashedPassword,
            telefono: phone || null,
            rol_id
        };

        const newUser = await User.create(userData);

        // Si es profesional, crear perfil profesional
        if (accountType === 'professional' && profession) {
            const professionalData = {
                usuario_id: newUser.id,
                titulo: profession,
                descripcion: description || '',
                ubicacion: 'El Salvador', // Default, se puede actualizar después
                tarifa_por_hora: parseFloat(hourlyRate) || 0,
                años_experiencia: parseInt(experience?.split('-')[0]) || 0
            };

            await Professional.create(professionalData);
        }

        // Generar token
        const token = generateToken({ 
            userId: newUser.id, 
            email: newUser.email,
            rol_id: newUser.rol_id 
        });

        return successResponse(res, {
            token,
            user: {
                id: newUser.id,
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                email: newUser.email,
                rol_id: newUser.rol_id
            }
        }, 'Usuario registrado exitosamente', 201);

    } catch (error) {
        console.error('Error en registro:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
        }

        // Buscar usuario
        const user = await User.findByEmail(email);
        
        if (!user) {
            return errorResponse(res, MESSAGES.INVALID_CREDENTIALS, 401);
        }

        // Verificar password
        const isValidPassword = await comparePassword(password, user.password);
        
        if (!isValidPassword) {
            return errorResponse(res, MESSAGES.INVALID_CREDENTIALS, 401);
        }

        // Generar token
        const token = generateToken({ 
            userId: user.id, 
            email: user.email,
            rol_id: user.rol_id 
        });

        return successResponse(res, {
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                telefono: user.telefono,
                rol_id: user.rol_id,
                rol_nombre: user.rol_nombre
            }
        }, MESSAGES.LOGIN_SUCCESS);

    } catch (error) {
        console.error('Error en login:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return errorResponse(res, MESSAGES.USER_NOT_FOUND, 404);
        }

        // Si es profesional, obtener perfil completo
        let profileData = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            telefono: user.telefono,
            foto_perfil: user.foto_perfil,
            rol_id: user.rol_id,
            rol_nombre: user.rol_nombre,
            email_verificado: user.email_verificado
        };

        if (user.rol_id === ROLES.PROFESIONAL) {
            const professionalProfile = await Professional.getFullProfile(user.id);
            if (professionalProfile) {
                profileData.perfil_profesional = professionalProfile;
            }
        }

        return successResponse(res, profileData);

    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { nombre, apellido, telefono, foto_perfil } = req.body;

        const updatedUser = await User.update(req.user.id, {
            nombre,
            apellido,
            telefono,
            foto_perfil
        });

        return successResponse(res, updatedUser, MESSAGES.PROFILE_UPDATED);

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        return errorResponse(res, error.message, 500);
    }
};