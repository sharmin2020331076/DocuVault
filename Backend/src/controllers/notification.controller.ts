import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
    });

    res.json(userNotifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    await db.delete(notifications)
      .where(and(eq(notifications.id, id as string), eq(notifications.userId, userId)));

    res.json({ message: 'Notification deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
