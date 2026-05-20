import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

// In-memory OTP store: email (lowercase) -> { otp, expires }
interface OtpEntry {
  otp: string;
  expires: number;
}
const otpStore = new Map<string, OtpEntry>();

// Send OTP Endpoint
router.post('/send-otp', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Valid email ID is required' });
  }

  const lowercaseEmail = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes valid

  otpStore.set(lowercaseEmail, { otp, expires });

  console.log(`[OTP SYSTEM] Generated OTP ${otp} for email ${lowercaseEmail}. Expires in 10 minutes.`);

  try {
    let transporter;

    // Use SMTP environment variables if they exist
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      // Fallback: Create dynamic test account with ethereal.email
      console.log('[OTP SYSTEM] No SMTP environment variables found. Generating test SMTP account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"NCH Parivar Portal" <no-reply@nchgroup.com>',
      to: lowercaseEmail,
      subject: 'NCH Parivar Portal - Password Reset OTP',
      text: `Hello,

You requested a password reset for your account on NCH Parivar Portal.

Your 6-digit OTP is: ${otp}

This OTP is valid for 10 minutes. If you did not make this request, please ignore this email.

Best regards,
NCH Parivar Portal Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E2E3EF; border-radius: 12px;">
          <h2 style="color: #333788; text-align: center;">NCH Parivar Portal</h2>
          <hr style="border: 0; border-top: 1px solid #E2E3EF; margin: 20px 0;" />
          <p>Hello,</p>
          <p>You requested a password reset for your account on NCH Parivar Portal.</p>
          <div style="background-color: #F5F6FA; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
            <p style="font-size: 14px; color: #6B6B80; margin: 0 0 10px 0;">Your 6-digit One-Time Password (OTP)</p>
            <span style="font-size: 32px; font-weight: bold; color: #333788; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #9E9EB8;">This OTP is valid for 10 minutes. If you did not make this request, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #E2E3EF; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9E9EB8; text-align: center;">© ${new Date().getFullYear()} NCH Group. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[OTP SYSTEM] Email sent successfully: ${info.messageId}`);
    
    // Log preview URL if using Ethereal fake service
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[OTP SYSTEM] Test Inbox Preview URL: ${previewUrl}`);
      return res.status(200).json({ 
        message: 'OTP sent successfully (Test Mode)', 
        previewUrl,
        info: 'Check the terminal console output for the OTP and test inbox preview link!'
      });
    }

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('[OTP SYSTEM] Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send OTP email: ' + error.message });
  }
});

// Verify OTP Endpoint
router.post('/verify-otp', (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const lowercaseEmail = email.toLowerCase().trim();
  const stored = otpStore.get(lowercaseEmail);

  if (!stored) {
    return res.status(400).json({ error: 'No OTP requested for this email' });
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(lowercaseEmail);
    return res.status(400).json({ error: 'OTP has expired (10-minute limit)' });
  }

  if (stored.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid 6-digit OTP' });
  }

  // OTP successfully verified
  otpStore.delete(lowercaseEmail);
  return res.status(200).json({ message: 'OTP verified successfully' });
});

export default router;
