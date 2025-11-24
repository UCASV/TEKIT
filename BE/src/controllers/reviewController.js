import { Review } from '../models/Review.js';
import { successResponse, errorResponse } from '../config/constants.js';

export const createReview = async (req, res) => {
    try {
        const { calificado_id, calificacion, comentario, contratacion_id } = req.body;
        const calificador_id = req.user.id;

        if (!calificado_id || !calificacion) {
            return errorResponse(res, 'Faltan datos requeridos', 400);
        }

        if (parseInt(calificado_id) === parseInt(calificador_id)) {
            return errorResponse(res, 'No puedes calificarte a ti mismo', 400);
        }

        const newReview = await Review.create({
            calificador_id,
            calificado_id,
            calificacion,
            comentario,
            contratacion_id // Pasamos el ID para actualizar la tabla Contrataciones
        });

        return successResponse(res, newReview, 'Reseña creada exitosamente', 201);

    } catch (error) {
        console.error('Error creando reseña:', error);
        return errorResponse(res, error.message, 500);
    }
};


export const getReviewsByProfessional = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.getByProfessional(id);

        return successResponse(res, {
            reviews,
            total: reviews.length
        });

    } catch (error) {
        console.error('Error obteniendo reseñas:', error);
        return errorResponse(res, error.message, 500);
    }
};