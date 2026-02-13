import crypto from 'crypto';

// Generate a numeric OTP (6 digits) securely and return raw OTP and its SHA-256 hash
export function generateVerificationToken() {
  // Generate 4 bytes and convert to number, then mod 1_000_000 to get 6 digits
  const buf = crypto.randomBytes(4);
  const num = buf.readUInt32BE(0) % 1000000;
  const token = num.toString().padStart(6, '0');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

export function hashToken(raw: string) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
