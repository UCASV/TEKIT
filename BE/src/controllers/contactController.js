import { Contact } from '../models/Contact.js';

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
        const stats = await Contact.getStats(req.user.id);
        return successResponse(res, stats);

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return errorResponse(res, error.message, 500);
    }
};