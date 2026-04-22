import { Router } from 'express';
import { getNotifications, markAllRead } from '../controllers/notification.controller';
import { markNotificationRead } from '../controllers/stats.controller';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markNotificationRead);

export default router;
