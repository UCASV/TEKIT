import express from 'express';
import { registerContact, getContactStats } from '../controllers/contactController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.post('/', authenticate, registerContact);
router.get(
    '/stats',
    authenticate,
    authorize(ROLES.PROFESIONAL),
    getContactStats
);

export default router;