import express from 'express';
import { 
    getAllCategories, 
    getCategoryById, 
    getCategoryStats 
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/:id/stats', getCategoryStats);

export default router;