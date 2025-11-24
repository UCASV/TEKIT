import express from 'express';
import { createService, getMyServices, deleteService, getServicesByProfessional } from '../controllers/serviceController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

//Rutas protegidas
router.post('/', authenticate, createService);
router.get('/my-services', authenticate, getMyServices);
router.delete('/:id', authenticate, deleteService);


//Rutas públicas
router.get('/professional/:id', getServicesByProfessional);

export default router;