import nodemailer from 'nodemailer';
import { ContactFormData } from '../validation/schemas';

export async function sendContactEmail(formData: ContactFormData): Promise<{ success: boolean; messageId?: string }> {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = (process.env.SMTP_USER || '').trim();
  // Strip any accidental spaces from Gmail App Password
  const smtpPass = (process.env.SMTP_PASSWORD || '').replace(/\s+/g, '').trim();
  const smtpFrom = process.env.SMTP_FROM || `"Ohmtech Developers Web" <${smtpUser || 'sanjayaswal2003@gmail.com'}>`;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || smtpUser || 'sanjayaswal2003@gmail.com';

  // If SMTP password or user is not set in env, log to console and simulate mock delivery for dev safety
  if (!smtpPass || !smtpUser) {
    console.log('[LOCAL DEMO EMAIL SERVICE DISPATCHED]', {
      timestamp: new Date().toISOString(),
      to: receiverEmail,
      payload: formData,
    });
    return { success: true, messageId: `mock-msg-${Date.now()}` };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0b0e14; color: #ffffff; border-radius: 8px;">
      <h2 style="color: #dfb76c; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">New Enterprise Contact Enquiry</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Company:</strong> ${formData.company || 'N/A'}</p>
      <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
      <p><strong>Country:</strong> ${formData.country || 'N/A'}</p>
      <p><strong>Project Type:</strong> ${formData.projectType}</p>
      <p><strong>Budget Range:</strong> ${formData.budget || 'Unspecified'}</p>
      <p><strong>Submission Timestamp:</strong> ${new Date().toISOString()}</p>
      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 20px 0;" />
      <h3>Message:</h3>
      <p style="background: #121722; padding: 15px; border-radius: 6px; border-left: 4px solid #dfb76c;">${formData.message}</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: receiverEmail,
      subject: `[Web Lead] ${formData.projectType} - ${formData.name}`,
      replyTo: formData.email,
      html: htmlBody,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('SMTP Delivery Failure:', error);
    return { success: false };
  }
}
