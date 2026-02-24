import axios from 'axios';
import { EMAIL_FROM, BREVO_API_KEY } from '../config';

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

  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is missing');
  }

  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: EMAIL_FROM, name: platformName },
        to: [{ email: to }],
        subject: `Verify Your Email – ${platformName}`,
        htmlContent: html,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Verification email sent to ${to} via Brevo`);
  } catch (error: any) {
    console.error('Brevo Email Error:', error.response?.data || error.message);
    throw error;
  }
}
