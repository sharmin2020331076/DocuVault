import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendExpiryEmail = async (email: string, docTitle: string, daysLeft: number) => {
  if (!resend) {
    console.log(`[Email Simulated] To: ${email}, Msg: ${docTitle} expires in ${daysLeft} days.`);
    return;
  }

  try {
    await resend.emails.send({
      from: 'DocuVault <alerts@resend.dev>', // Resend default for free tier without domain verified
      to: email,
      subject: `Action Required: ${docTitle} is expiring soon!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1f2937;">
          <h1 style="color: #3b82f6;">DocuVault Alert</h1>
          <p>Hi there,</p>
          <p>Your document "<strong>${docTitle}</strong>" is set to expire in <strong>${daysLeft} days</strong>.</p>
          <p>Please log in to your dashboard to renew or update it.</p>
          <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px;">
            <p style="margin: 0;">This is an automated proactive reminder from your DocuVault Life Admin system.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
