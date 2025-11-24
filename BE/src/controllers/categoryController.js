import { Category } from '../models/Category.js';
import { successResponse, errorResponse } from '../config/constants.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        return successResponse(res, categories);
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.getById(parseInt(id));
        
        if (!category) {
            return errorResponse(res, 'Categoría no encontrada', 404);
        }
        
        return successResponse(res, category);
    } catch (error) {
        console.error('Error obteniendo categoría:', error);
        return errorResponse(res, error.message, 500);
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await Category.getStats(parseInt(id));
        
        return successResponse(res, stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return errorResponse(res, error.message, 500);
    }
};