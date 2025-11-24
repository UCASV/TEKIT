import { Service } from '../models/Service.js';
import { Professional } from '../models/Professional.js';
import { successResponse, errorResponse } from '../config/constants.js';

export const createService = async (req, res) => {
    try {
        const { categoria_id, titulo, descripcion, precio, tipo_precio } = req.body;

        const profile = await Professional.getFullProfile(req.user.id);

        if (!profile) {
            return errorResponse(res, 'Debes tener un perfil profesional para crear servicios', 403);
        }

        const serviceData = {
            profesional_id: profile.perfil_id,
            categoria_id,
            titulo,
            descripcion,
            precio,
            tipo_precio
        };

        const newService = await Service.create(serviceData);

        return successResponse(res, newService, 'Servicio creado exitosamente', 201);

    } catch (error) {
        console.error('Error creando servicio:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getMyServices = async (req, res) => {
    try {
        const profile = await Professional.getFullProfile(req.user.id);

        if (!profile) {
            return successResponse(res, []);
        }

        const services = await Service.getByProfessionalId(profile.perfil_id);
        return successResponse(res, services);

    } catch (error) {
        console.error('Error obteniendo mis servicios:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Professional.getFullProfile(req.user.id);

        if (!profile) {
            return errorResponse(res, 'No autorizado', 403);
        }

        const deleted = await Service.delete(id, profile.perfil_id);

        if (!deleted) {
            return errorResponse(res, 'Servicio no encontrado o no te pertenece', 404);
        }

        return successResponse(res, null, 'Servicio eliminado correctamente');

    } catch (error) {
        console.error('Error eliminando servicio:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getServicesByProfessional = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await Professional.getFullProfile(parseInt(id));

        if (!profile) {
            return successResponse(res, []);
        }

        const services = await Service.getByProfessionalId(profile.perfil_id);

        const activeServices = services.filter(s => s.activo);

        return successResponse(res, activeServices);

    } catch (error) {
        console.error('Error obteniendo servicios públicos:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getServicesByCategory = async (req, res) => {
    return successResponse(res, []);
};