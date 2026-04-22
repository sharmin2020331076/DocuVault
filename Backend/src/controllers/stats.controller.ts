import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { db } from '../db';
import { documents, notifications } from '../db/schema';
import { eq, count, and } from 'drizzle-orm';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const [totalDocs] = await db.select({ value: count() }).from(documents).where(eq(documents.userId, userId));
    const [expiringDocs] = await db.select({ value: count() }).from(documents).where(and(eq(documents.userId, userId), eq(documents.status, 'expiring')));
    const [expiredDocs] = await db.select({ value: count() }).from(documents).where(and(eq(documents.userId, userId), eq(documents.status, 'expired')));
    
    const unreadNotifications = await db.query.notifications.findMany({
      where: and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
      limit: 5
    });

    res.json({
      total: totalDocs.value,
      expiring: expiringDocs.value,
      expired: expiredDocs.value,
      notifications: unreadNotifications
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.id, id), eq(notifications.userId, userId!)));
        res.json({ message: 'Marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
