// =============================================
// BE/src/routes/serviceRoutes.js
// =============================================
import express from 'express';
import {
    createService,
    getMyServices,
    getServicesByCategory,
    updateService,
    deleteService
} from '../controllers/serviceController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Rutas protegidas para profesionales
router.post(
    '/',
    authenticate,
    authorize(ROLES.PROFESIONAL),
    createService
);

router.get(
    '/my-services',
    authenticate,
    authorize(ROLES.PROFESIONAL),
    getMyServices
);

router.put(
    '/:id',
    authenticate,
    authorize(ROLES.PROFESIONAL),
    updateService
);

router.delete(
    '/:id',
    authenticate,
    authorize(ROLES.PROFESIONAL),
    deleteService
);

// Rutas públicas
router.get('/category/:id', getServicesByCategory);

export default router;