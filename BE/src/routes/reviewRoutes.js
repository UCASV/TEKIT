import express from 'express';
import { 
    createReview, 
    getProfessionalReviews,
    updateReview,
    deleteReview
} from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/professional/:id', getProfessionalReviews);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;