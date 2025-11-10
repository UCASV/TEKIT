import express from 'express';
import { createReview, getProfessionalReviews } from '../controllers/index.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/professional/:id', getProfessionalReviews);

export default router;