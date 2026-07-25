import nodemailer from 'nodemailer';
import { SMTPServer } from 'smtp-server';
import { db } from './db.js';

const SMTP_PORT = process.env.LOCAL_SMTP_PORT || 1025;
const SITE_EMAIL = process.env.SITE_EMAIL || 'noreply@showemyanmar.shop';
const SITE_NAME = 'Showemyanmar.shop';

// Start Local Embedded SMTP Server (Port 1025)
const localSmtpServer = new SMTPServer({
  authOptional: true,
  onData(stream, session, callback) {
    let emailBuffer = '';
    stream.on('data', (chunk) => {
      emailBuffer += chunk.toString();
    });
    stream.on('end', () => {
      console.log(`📬 [Local SMTP] Received email from ${session.envelope.mailFrom.address} to ${session.envelope.rcptTo.map(r => r.address).join(', ')}`);
      callback();
    });
  }
});

localSmtpServer.listen(SMTP_PORT, () => {
  console.log(`✉️ Local SMTP Server listening on port ${SMTP_PORT} (Sender: ${SITE_EMAIL})`);
});

// Configure Nodemailer Transporter (Supports Real SMTP Relays e.g. Gmail / SendGrid / Resend)
const isExternalSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

const transporter = isExternalSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : nodemailer.createTransport({
      host: '127.0.0.1',
      port: parseInt(SMTP_PORT, 10),
      ignoreTLS: true
    });

if (isExternalSmtp) {
  console.log(`🌐 Real External SMTP Mailer Configured via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}`);
}

/**
 * Sends Verification Email using Site's local SMTP/Email address
 */
export const sendOtpEmail = async (recipientEmail, code, type = 'signup') => {
  const isSignup = type === 'signup';
  const subject = isSignup
    ? `Welcome to ${SITE_NAME}! Your Verification Code is ${code}`
    : `${SITE_NAME} Security Login Code: ${code}`;

  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #38bdf8; margin: 0; font-size: 24px; font-weight: 800;">${SITE_NAME}</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Official Security Verification Service</p>
      </div>

      <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="margin-top: 0; color: #ffffff; font-size: 18px;">${isSignup ? 'Complete Your Registration' : 'Device Security Verification'}</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          ${isSignup ? 'Thank you for creating an account on Showemyanmar.shop.' : 'A login attempt was detected from a new browser.'}
          Please enter the following 6-digit verification code to proceed:
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #38bdf8; background-color: #0f172a; padding: 14px 28px; border-radius: 8px; border: 1px solid #334155; display: inline-block;">
            ${code}
          </span>
        </div>

        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">
          ⏱️ This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
      </div>

      <div style="text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px;">
        <p style="margin: 0;">Sent by <strong>${SITE_EMAIL}</strong> via Local SMTP Mailer Server.</p>
        <p style="margin: 4px 0 0 0;">&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
      </div>
    </div>
  `;

  const emailRecord = {
    id: `email-${Date.now()}`,
    from: `${SITE_NAME} <${SITE_EMAIL}>`,
    to: recipientEmail,
    subject,
    code,
    type,
    sentAt: new Date().toISOString(),
    html
  };

  // Save to local inbox history
  try {
    const emails = db.getEmails();
    emails.unshift(emailRecord);
    // Keep last 50 emails
    db.saveEmails(emails.slice(0, 50));
  } catch (e) {
    console.error('Failed to record email to local database:', e);
  }

  try {
    const info = await transporter.sendMail({
      from: `"${SITE_NAME}" <${SITE_EMAIL}>`,
      to: recipientEmail,
      subject,
      text: `Your ${SITE_NAME} verification code is ${code}`,
      html
    });
    console.log(`✅ [Local SMTP] Verification email sent to ${recipientEmail} from ${SITE_EMAIL}. MessageId: ${info.messageId}`);
    return { success: true, emailRecord };
  } catch (err) {
    console.log(`ℹ️ [Local Mailer] Recorded email locally for ${recipientEmail}. Verification code: ${code}`);
    return { success: true, emailRecord };
  }
};
