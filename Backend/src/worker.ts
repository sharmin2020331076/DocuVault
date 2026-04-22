import cron from 'node-cron';
import { db } from './db/index.js';
import { documents, reminders, notifications, users } from './db/schema.js';
import { eq, and, sql, lte, gte } from 'drizzle-orm';
import { sendExpiryEmail } from './utils/resend.js';

const checkExpiries = async () => {
  console.log('Running daily expiry check...');
  
  try {
    // Current date logic
    const today = new Date();
    
    // Find all documents with their reminders and user emails
    // We want docs where today + leadTimeDays >= expiryDate AND status is 'valid'
    const docs = await db.select({
      id: documents.id,
      title: documents.title,
      expiryDate: documents.expiryDate,
      userId: documents.userId,
      email: users.email,
      leadTimeDays: reminders.leadTimeDays,
      reminderId: reminders.id
    })
    .from(documents)
    .innerJoin(reminders, eq(documents.id, reminders.documentId))
    .innerJoin(users, eq(documents.userId, users.id))
    .where(eq(documents.status, 'valid'));

    for (const doc of docs) {
      const expiry = new Date(doc.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= doc.leadTimeDays && diffDays > 0) {
        console.log(`Document "${doc.title}" is expiring in ${diffDays} days. Notifying ${doc.email}...`);

        // 1. Send Email
        await sendExpiryEmail(doc.email, doc.title, diffDays);

        // 2. Create In-App Notification
        await db.insert(notifications).values({
          userId: doc.userId,
          documentId: doc.id,
          type: 'email',
          message: `Your document "${doc.title}" will expire in ${diffDays} days.`
        });
        
        await db.insert(notifications).values({
          userId: doc.userId,
          documentId: doc.id,
          type: 'in-app',
          message: `Your document "${doc.title}" will expire in ${diffDays} days.`
        });

        // 3. Update document status to 'expiring'
        await db.update(documents)
          .set({ status: 'expiring' })
          .where(eq(documents.id, doc.id));

        // 4. Update reminder last notified
        await db.update(reminders)
          .set({ lastNotifiedAt: new Date() })
          .where(eq(reminders.id, doc.reminderId));
      } else if (diffDays <= 0) {
        // Mark as expired
        await db.update(documents)
          .set({ status: 'expired' })
          .where(eq(documents.id, doc.id));
          
        await db.insert(notifications).values({
          userId: doc.userId,
          documentId: doc.id,
          type: 'in-app',
          message: `Your document "${doc.title}" has EXPIRED.`
        });
      }
    }
    
    console.log('Expiry check completed.');
  } catch (error) {
    console.error('Error in expiry check worker:', error);
  }
};

// Run at midnight every day
cron.schedule('0 0 * * *', checkExpiries);

// Also run immediately on start for testing
checkExpiries();
