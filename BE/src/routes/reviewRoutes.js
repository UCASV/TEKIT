import express from 'express';
import { createReview, getReviewsByProfessional } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Ruta protegida para crear reseña
router.post('/', authenticate, createReview);

// Ruta pública para ver reseñas de un profesional
router.get('/professional/:id', getReviewsByProfessional);

export default router;