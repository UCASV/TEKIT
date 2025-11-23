// =============================================
// BE/src/controllers/contactController.js - CORREGIDO
// =============================================
import { Contact } from '../models/Contact.js';
import { successResponse, errorResponse } from '../config/constants.js';
import { MESSAGES } from '../config/constants.js';

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
        const pool = await getConnection();
        const profile = await pool.request()
            .input('usuario_id', sql.Int, req.user.id)
            .query(`
                SELECT id FROM Perfiles_Profesionales
                WHERE usuario_id = @usuario_id
            `);

        if (!profile.recordset[0]) {
            return errorResponse(res, 'Perfil profesional no encontrado', 404);
        }

        const stats = await Contact.getStats(profile.recordset[0].id);
        return successResponse(res, stats);

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return errorResponse(res, error.message, 500);
    }
};