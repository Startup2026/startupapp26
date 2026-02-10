import express from 'express';
import rateLimit from 'express-rate-limit';
import { Student } from '../models/student';
import { Startup } from '../models/startup';
import { generateVerificationToken, hashToken } from '../utils/token';
import { sendVerificationEmail } from '../utils/email';

const router = express.Router();

const resendLimiter = rateLimit({ windowMs: 60 * 1000, max: 3, message: { error: 'Too many requests' } });

// POST /api/auth/resend-verification
router.post('/resend-verification', resendLimiter, async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(200).json({ success: true }); // Generic response to prevent enumeration

  try {
    const normalized = String(email).toLowerCase();

    const user = await Student.findOne({ email: normalized }) || await Startup.findOne({ email: normalized });
    if (!user) return res.status(200).json({ success: true });

    const { token, hash } = generateVerificationToken();
    user.verificationToken = hash;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // send OTP email (do not await to avoid leaking timing info)
    sendVerificationEmail(normalized, token).catch(console.error);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ success: true });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  const { email, token } = req.body || {};
  if (!email || !token) return res.status(400).json({ success: false, error: 'Invalid request' });

  try {
    const normalized = String(email).toLowerCase();
    const hashed = hashToken(String(token));

    const user = await Student.findOne({ email: normalized, verificationToken: hashed }) || await Startup.findOne({ email: normalized, verificationToken: hashed });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid token or expired' });

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      return res.status(400).json({ success: false, error: 'Token expired' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
import express from 'express';
import { Student } from '../models/student';
import { Startup } from '../models/startup';
import { generateVerificationToken, hashToken } from '../utils/token';
import { sendVerificationEmail } from '../utils/email';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Simple rate limiter for resend endpoint (per IP)
const resendLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 6, // allow a few attempts per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/resend-verification
router.post('/resend-verification', resendLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(200).json({ success: true }); // Generic response

    const lowered = String(email).toLowerCase();

    const user = await Student.findOne({ email: lowered }) || await Startup.findOne({ email: lowered });

    if (user && !user.isVerified) {
      const { token, hash } = generateVerificationToken();
      user.verificationToken = hash;
      user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      // send email (fire-and-forget)
      sendVerificationEmail(lowered, token).catch((err) => console.error('Email send error', err));
    }

    // Always return generic success to avoid enumeration
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.json({ success: true });
  }
});

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const raw = req.params.token;
    const hash = hashToken(raw);

    const now = new Date();

    const student = await Student.findOne({ verificationToken: hash });
    const startup = !student ? await Startup.findOne({ verificationToken: hash }) : null;

    const user = student || startup;
    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired token.' });

    if (!user.verificationTokenExpires || user.verificationTokenExpires < now) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
