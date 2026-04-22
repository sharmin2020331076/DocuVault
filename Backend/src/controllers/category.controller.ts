import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { db } from '../db';
import { categories } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userCategories = await db.query.categories.findMany({
      where: eq(categories.userId, userId),
    });

    res.json(userCategories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, color } = req.body;

    if (!userId || !name) return res.status(400).json({ message: 'Name is required' });

    const [newCategory] = await db.insert(categories).values({
      userId,
      name,
      color: color || '#3b82f6',
    }).returning();

    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId!)));

    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
