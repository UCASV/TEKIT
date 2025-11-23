// =============================================
// BE/src/controllers/serviceController.js
// =============================================
import { Service } from '../models/Service.js';
import { Professional } from '../models/Professional.js';
import { successResponse, errorResponse } from '../config/constants.js';
import { MESSAGES } from '../config/constants.js';

export const createService = async (req, res) => {
    try {
        const { categoria_id, titulo, descripcion, precio, tipo_precio } = req.body;

        if (!categoria_id || !titulo || !tipo_precio) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
        }

        // Obtener el perfil profesional del usuario autenticado
        const profile = await Professional.getFullProfile(req.user.id);

        if (!profile) {
            return errorResponse(res, 'Perfil profesional no encontrado', 404);
        }

        const serviceData = {
            profesional_id: profile.perfil_id,
            categoria_id,
            titulo,
            descripcion,
            precio: precio || null,
            tipo_precio
        };

        const newService = await Service.create(serviceData);

        return successResponse(
            res,
            newService,
            'Servicio creado exitosamente',
            201
        );

    } catch (error) {
        console.error('Error creando servicio:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getMyServices = async (req, res) => {
    try {
        const profile = await Professional.getFullProfile(req.user.id);

        if (!profile) {
            return errorResponse(res, 'Perfil profesional no encontrado', 404);
        }

        const services = await Service.getByProfessional(profile.perfil_id);

        return successResponse(res, services);

    } catch (error) {
        console.error('Error obteniendo servicios:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getServicesByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const services = await Service.getByCategory(parseInt(id));

        return successResponse(res, {
            total: services.length,
            services
        });

    } catch (error) {
        console.error('Error obteniendo servicios por categoría:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, precio, tipo_precio } = req.body;

        const service = await Service.getById(parseInt(id));

        if (!service) {
            return errorResponse(res, 'Servicio no encontrado', 404);
        }

        const updatedService = await Service.update(parseInt(id), {
            titulo,
            descripcion,
            precio,
            tipo_precio
        });

        return successResponse(res, updatedService, 'Servicio actualizado exitosamente');

    } catch (error) {
        console.error('Error actualizando servicio:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.getById(parseInt(id));

        if (!service) {
            return errorResponse(res, 'Servicio no encontrado', 404);
        }

        await Service.delete(parseInt(id));

        return successResponse(res, null, 'Servicio eliminado exitosamente');

    } catch (error) {
        console.error('Error eliminando servicio:', error);
        return errorResponse(res, error.message, 500);
    }
};