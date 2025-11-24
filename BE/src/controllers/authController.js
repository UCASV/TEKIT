import { User } from '../models/User.js';
import { Professional } from '../models/Professional.js';
import { Service } from '../models/Service.js';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers.js';
import { successResponse, errorResponse } from '../config/constants.js';
import { ROLES, MESSAGES } from '../config/constants.js';

export const register = async (req, res) => {
    try {
        const { 
            firstName, lastName, email, phone, password, accountType,
            profession, categoryId, location, experience, description, hourlyRate
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return errorResponse(res, MESSAGES.EMAIL_ALREADY_EXISTS, 400);
        }

        const hashedPassword = await hashPassword(password);
        const rol_id = accountType === 'professional' ? ROLES.PROFESIONAL : ROLES.CLIENTE;

        const newUser = await User.create({
            nombre: firstName,
            apellido: lastName,
            email,
            password: hashedPassword,
            telefono: phone || null,
            rol_id
        });

        //Si es profesional, crear Perfil y servicio por defecto
        if (accountType === 'professional') {
            const professionalData = {
                usuario_id: newUser.id,
                titulo: profession || 'Profesional', 
                descripcion: description || '',
                ubicacion: location || 'El Salvador',
                tarifa_por_hora: parseFloat(hourlyRate) || 0,
                años_experiencia: parseInt(experience) || 0
            };

            const newProfile = await Professional.create(professionalData);

            if (categoryId && newProfile) {
                await Service.create({
                    profesional_id: newProfile.id, 
                    categoria_id: parseInt(categoryId),
                    titulo: `Servicios de ${profession}`,
                    descripcion: description || `Servicio profesional de ${profession}`,
                    precio: parseFloat(hourlyRate),
                    tipo_precio: 'por_hora'
                });
            }
        }

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
    console.log('🔑 Intento de Login:', req.body.email);
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
        }

        //1. Buscar usuario
        const user = await User.findByEmail(email);
        
        if (!user) {
            console.log('❌ Usuario no encontrado en BD');
            return errorResponse(res, MESSAGES.INVALID_CREDENTIALS, 401);
        }

        //2. Comparar contraseña
        const isValidPassword = await comparePassword(password, user.password);
        
        if (!isValidPassword) {
            console.log('❌ Contraseña incorrecta para:', email);
            return errorResponse(res, MESSAGES.INVALID_CREDENTIALS, 401);
        }

        console.log('✅ Login exitoso para:', email);

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
                foto_perfil: user.foto_perfil,
                rol_id: user.rol_id,
                rol_nombre: user.rol_nombre
            }
        }, MESSAGES.LOGIN_SUCCESS);

    } catch (error) {
        console.error('❌ Error CRÍTICO en login:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return errorResponse(res, MESSAGES.USER_NOT_FOUND, 404);
        }

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