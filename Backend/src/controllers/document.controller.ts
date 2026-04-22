import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { db } from '../db';
import { documents, categories, reminders } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import cloudinary from '../config/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { title, categoryId, expiryDate, leadTimeDays } = req.body;
    const userId = req.user?.id;
    const file = req.file;

    if (!userId || !file || !title || !expiryDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'docuvault',
          public_id: `doc_${uuidv4()}`,
          access_mode: 'authenticated', // Secure delivery
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const cloudinaryResult: any = await uploadPromise;

    // Save to database
    const [newDoc] = await db.insert(documents).values({
      userId,
      categoryId,
      title,
      expiryDate,
      fileUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      status: 'valid',
    }).returning();

    // Create default reminder
    await db.insert(reminders).values({
      documentId: newDoc.id,
      leadTimeDays: parseInt(leadTimeDays) || 30,
    });

    res.status(201).json(newDoc);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const userDocs = await db.query.documents.findMany({
      where: eq(documents.userId, userId),
      with: {
        category: true,
        reminders: true,
      },
      orderBy: [desc(documents.createdAt)],
    });

    // For secure delivery, generate signed URLs
    const docsWithSignedUrls = userDocs.map((doc) => {
      const signedUrl = cloudinary.url(doc.cloudinaryPublicId, {
        sign_url: true,
        type: 'authenticated',
        secure: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      });
      return { ...doc, fileUrl: signedUrl };
    });

    res.json(docsWithSignedUrls);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const doc = await db.query.documents.findFirst({
      where: and(eq(documents.id, id), eq(documents.userId, userId!)),
    });

    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(doc.cloudinaryPublicId);

    // Delete from DB
    await db.delete(documents).where(eq(documents.id, id));

    res.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
