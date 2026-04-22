import { Router } from 'express';
import { getNotifications, markAllRead, deleteNotification } from '../controllers/notification.controller.js';
import { markNotificationRead } from '../controllers/stats.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken as any);

router.get('/', getNotifications as any);
router.post('/mark-read', markAllRead as any);
router.post('/:id/read', markNotificationRead as any);
router.delete('/:id', deleteNotification as any);

export default router;
