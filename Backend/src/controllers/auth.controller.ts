import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users, categories } from '../db/schema';
import { eq } from 'drizzle-orm';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    // Seed default categories
    const defaultCategories = [
      { name: 'Identity', color: '#3b82f6' },
      { name: 'Travel', color: '#10b981' },
      { name: 'Finance', color: '#f59e0b' },
      { name: 'Health', color: '#ef4444' },
    ];

    await Promise.all(
      defaultCategories.map(cat => 
        db.insert(categories).values({
          userId: user.id,
          name: cat.name,
          color: cat.color,
        })
      )
    );

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
