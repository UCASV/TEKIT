import express from 'express';
import {
    searchProfessionals,
    getProfessionalProfile,
    updateProfessionalProfile
} from '../controllers/professionalController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/search', searchProfessionals);
router.get('/:id', getProfessionalProfile);
router.put(
    '/profile',
    authenticate,
    authorize(ROLES.PROFESIONAL),
    updateProfessionalProfile
);

export default router;