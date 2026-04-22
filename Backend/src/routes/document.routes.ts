import { Router } from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/document.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateToken as any);

router.post('/', upload.single('file') as any, uploadDocument as any);
router.get('/', getDocuments as any);
router.delete('/:id', deleteDocument as any);

export default router;
