import express from 'express';
import { 
    getMyBookings, 
    createBooking, 
    getProfessionalBookings, 
    updateBookingStatus 
} from '../controllers/bookingController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Rutas Cliente
router.get('/my-bookings', authenticate, getMyBookings);
router.post('/', authenticate, createBooking); // Crear solicitud

// Rutas Profesional
router.get('/professional-requests', authenticate, getProfessionalBookings); // Ver solicitudes
router.put('/:id/status', authenticate, updateBookingStatus); // Cambiar estado

export default router;