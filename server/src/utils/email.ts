import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } from '../config';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT || 587,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

export async function sendVerificationEmail(to: string, token: string, platformName = 'Wostup') {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4; color:#111;">
      <h2>Verify Your Email – ${platformName}</h2>
      <p>Thanks for registering. Use the one-time verification code below to verify your email address. This code expires in 24 hours.</p>
      <p style="text-align:center; margin:28px 0; font-size:22px; letter-spacing:4px;"><strong>${token}</strong></p>
      <p>If you didn't request this, ignore this email or contact support.</p>
      <hr />
      <p style="font-size:12px;color:#666">If you need help, reply to this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: `Verify Your Email – ${platformName}`,
    html,
  });
}
