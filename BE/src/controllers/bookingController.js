import { Booking } from '../models/Booking.js';
import { Professional } from '../models/Professional.js';
import { successResponse, errorResponse } from '../config/constants.js';

// Obtener historial del cliente (Ya existía)
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.getByClient(req.user.id);
        return successResponse(res, bookings);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// NUEVO: Crear solicitud
export const createBooking = async (req, res) => {
    try {
        const { profesional_id, servicio_id, titulo_trabajo, monto_acordado, detalles } = req.body;
        
        // profesional_id aquí se refiere al ID del PERFIL, no del usuario.
        const newBooking = await Booking.create({
            cliente_id: req.user.id,
            profesional_id, 
            servicio_id,
            titulo_trabajo,
            monto_acordado,
            comentario_cliente: detalles
        });

        return successResponse(res, newBooking, 'Solicitud enviada correctamente', 201);
    } catch (error) {
        console.error(error);
        return errorResponse(res, error.message, 500);
    }
};

// NUEVO: Obtener solicitudes del profesional (Dashboard)
export const getProfessionalBookings = async (req, res) => {
    try {
        // Primero obtenemos el ID del perfil profesional del usuario logueado
        const profile = await Professional.getFullProfile(req.user.id);
        if (!profile) return errorResponse(res, 'No tienes perfil profesional', 403);

        const requests = await Booking.getByProfessional(profile.perfil_id);
        return successResponse(res, requests);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

// NUEVO: Actualizar estado
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // 'completado', 'cancelado', 'en_proceso'
        
        await Booking.updateStatus(id, estado);
        return successResponse(res, null, 'Estado actualizado');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};