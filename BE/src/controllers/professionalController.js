import { Professional } from '../models/Professional.js';
import { successResponse, errorResponse } from '../config/constants.js';
import { MESSAGES } from '../config/constants.js';

export const searchProfessionals = async (req, res) => {
    try {
        const filters = {
            categoria_id: req.query.category,
            ubicacion: req.query.location,
            tarifa_min: req.query.priceMin,
            tarifa_max: req.query.priceMax,
            calificacion_min: req.query.rating,
            busqueda: req.query.q
        };

        console.log('Búsqueda con filtros:', filters);

        const professionals = await Professional.search(filters);

        return successResponse(res, {
            total: professionals.length,
            professionals
        });

    } catch (error) {
        console.error('Error buscando profesionales:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getProfessionalProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await Professional.getFullProfile(parseInt(id));

        if (!profile) {
            return errorResponse(res, 'Perfil profesional no encontrado', 404);
        }

        return successResponse(res, profile);

    } catch (error) {
        console.error('Error obteniendo perfil profesional:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const updateProfessionalProfile = async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            ubicacion,
            tarifa_por_hora,
            años_experiencia
        } = req.body;

        // Obtener el perfil profesional del usuario autenticado
        const profile = await Professional.getFullProfile(req.user.userId);

        if (!profile) {
            return errorResponse(res, 'Perfil profesional no encontrado', 404);
        }

        const updatedProfile = await Professional.update(profile.perfil_id, {
            titulo,
            descripcion,
            ubicacion,
            tarifa_por_hora,
            años_experiencia
        });

        return successResponse(res, updatedProfile, MESSAGES.PROFILE_UPDATED);

    } catch (error) {
        console.error('Error actualizando perfil profesional:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getStats = async (req, res) => {
    try {
        const stats = await Professional.getGlobalStats();
        return successResponse(res, stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return errorResponse(res, error.message, 500);
    }
};