import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.ORDER_TOKEN_SECRET || process.env.JWT_SECRET || 'argyros-order-privacy-salt-2026';

export function generateOrderAccessToken(orderNumber: string, email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  return createHmac('sha256', SECRET)
    .update(`${orderNumber}:${normalizedEmail}`)
    .digest('hex')
    .slice(0, 32);
}

export function verifyOrderAccessToken(orderNumber: string, email: string, token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const expected = generateOrderAccessToken(orderNumber, email);
  try {
    const a = Buffer.from(token, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
