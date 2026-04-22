import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { db } from '../db/index.js';
import { documents, notifications } from '../db/schema.js';
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
      orderBy: (notifications: any, { desc }: any) => [desc(notifications.createdAt)],
      limit: 5
    });

    res.json({
      total: totalDocs?.value || 0,
      expiring: expiringDocs?.value || 0,
      expired: expiredDocs?.value || 0,
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
        await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.id, id as string), eq(notifications.userId, userId!)));
        res.json({ message: 'Marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
