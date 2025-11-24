import { Location } from '../models/Location.js';
import { successResponse, errorResponse } from '../config/constants.js';

export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.getAll();
        return successResponse(res, locations);
    } catch (error) {
        console.error('Error obteniendo ubicaciones:', error);
        return errorResponse(res, error.message, 500);
    }
};