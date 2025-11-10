import { Review } from '../models/Review.js';
import { MESSAGES } from '../config/constants.js';

export const createReview = async (req, res) => {
    try {
        const { calificado_id, calificacion, comentario } = req.body;

        if (!calificado_id || !calificacion) {
            return errorResponse(res, MESSAGES.REQUIRED_FIELDS, 400);
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
            comentario
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

        return successResponse(res, reviews);

    } catch (error) {
        console.error('Error obteniendo reseñas:', error);
        return errorResponse(res, error.message, 500);
    }
};