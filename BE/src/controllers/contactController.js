// =============================================
// BE/src/controllers/contactController.js - CORREGIDO
// =============================================
import { Contact } from '../models/Contact.js';
import { Professional } from '../models/Professional.js'; // Importar modelo profesional
import { successResponse, errorResponse } from '../config/constants.js';
import { MESSAGES } from '../config/constants.js';
import { getConnection, sql } from '../config/database.js'; // <--- IMPORTACIÓN AÑADIDA


export const registerContact = async (req, res) => {
    try {
        const { profesional_id } = req.body;

        if (!profesional_id) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
        }

        const contactData = {
            cliente_id: req.user.id,
            profesional_id
        };

        const contact = await Contact.register(contactData);

        return successResponse(
            res,
            contact,
            MESSAGES.CONTACT_REGISTERED,
            201
        );

    } catch (error) {
        console.error('Error registrando contacto:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getContactStats = async (req, res) => {
    try {
        // Obtener el perfil profesional del usuario autenticado
        const profile = await Professional.getFullProfile(req.user.id); 

        if (!profile || !profile.perfil_id) {
            // Si no hay perfil profesional, devolver 0 stats en lugar de 404/500
            return successResponse(res, {
                total_contactos: 0,
                clientes_unicos: 0,
                contactos_semana: 0,
                contactos_mes: 0
            });
        }

        // Usar el perfil_id correcto
        const stats = await Contact.getStats(profile.perfil_id);
        return successResponse(res, stats);

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return errorResponse(res, error.message, 500);
    }
};

// NUEVO: Obtener servicios públicos de un profesional (por ID de usuario)
export const getServicesByProfessional = async (req, res) => {
    try {
        const { id } = req.params; // Recibimos el ID del Usuario (no del perfil)

        // 1. Obtener el ID del perfil profesional asociado al usuario
        const profile = await Professional.getFullProfile(parseInt(id));
        
        if (!profile) {
            return successResponse(res, []); // Si no hay perfil, devolvemos lista vacía
        }

        // 2. Buscar servicios usando el ID del perfil
        const services = await Service.getByProfessionalId(profile.perfil_id);
        
        // Filtrar solo los activos para la vista pública
        const activeServices = services.filter(s => s.activo);

        return successResponse(res, activeServices);

    } catch (error) {
        console.error('Error obteniendo servicios del profesional:', error);
        return errorResponse(res, error.message, 500);
    }
};