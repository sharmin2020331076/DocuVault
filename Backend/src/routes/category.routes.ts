import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken as any);

router.get('/', getCategories as any);
router.post('/', createCategory as any);
router.delete('/:id', deleteCategory as any);

export default router;
