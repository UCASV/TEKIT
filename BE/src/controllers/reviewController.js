// =============================================
// BE/src/controllers/reviewController.js - CORREGIDO
// =============================================
import { Review } from '../models/Review.js';
import { successResponse, errorResponse } from '../config/constants.js';
import { MESSAGES } from '../config/constants.js';

export const createReview = async (req, res) => {
    try {
        const { calificado_id, calificacion, comentario } = req.body;

        if (!calificado_id || !calificacion) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
        }

        // Validar rango de calificación
        if (calificacion < 1 || calificacion > 5) {
            return errorResponse(res, 'La calificación debe estar entre 1 y 5', 400);
        }

        const existingReview = await Review.checkExisting(
            req.user.id,
            calificado_id
        );

        if (existingReview) {
            return errorResponse(res, MESSAGES.REVIEW_EXISTS, 400);
        }

        const reviewData = {
            calificador_id: req.user.id,
            calificado_id,
            calificacion,
            comentario: comentario || ''
        };

        const newReview = await Review.create(reviewData);

        return successResponse(
            res,
            newReview,
            MESSAGES.REVIEW_CREATED,
            201
        );

    } catch (error) {
        console.error('Error creando reseña:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getProfessionalReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.getByProfessional(parseInt(id));

        return successResponse(res, {
            total: reviews.length,
            reviews
        });

    } catch (error) {
        console.error('Error obteniendo reseñas:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { calificacion, comentario } = req.body;

        const review = await Review.getById(parseInt(id));

        if (!review) {
            return errorResponse(res, 'Reseña no encontrada', 404);
        }

        // Verificar que el usuario sea el creador de la reseña
        if (review.calificador_id !== req.user.id) {
            return errorResponse(res, 'No tienes permisos para editar esta reseña', 403);
        }

        const updatedReview = await Review.update(parseInt(id), {
            calificacion,
            comentario
        });

        return successResponse(res, updatedReview, 'Reseña actualizada exitosamente');

    } catch (error) {
        console.error('Error actualizando reseña:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.getById(parseInt(id));

        if (!review) {
            return errorResponse(res, 'Reseña no encontrada', 404);
        }

        // Verificar que el usuario sea el creador de la reseña
        if (review.calificador_id !== req.user.id) {
            return errorResponse(res, 'No tienes permisos para eliminar esta reseña', 403);
        }

        await Review.delete(parseInt(id));

        return successResponse(res, null, 'Reseña eliminada exitosamente');

    } catch (error) {
        console.error('Error eliminando reseña:', error);
        return errorResponse(res, error.message, 500);
    }
};