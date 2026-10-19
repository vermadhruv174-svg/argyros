import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { getMfaEncryptionKey } from '../config/runtime';

const AES_ALGORITHM = 'aes-256-gcm';
const AES_VERSION = 'v1';
const AES_IV_BYTES = 12;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function encodeBase32(input: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of input) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function decodeBase32(value: string): Buffer {
  const normalized = value.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase();
  if (!normalized || !/^[A-Z2-7]+$/.test(normalized)) throw new Error('Invalid TOTP secret.');

  let bits = 0;
  let buffer = 0;
  const output: number[] = [];
  for (const character of normalized) {
    buffer = (buffer << 5) | BASE32_ALPHABET.indexOf(character);
    bits += 5;
    if (bits >= 8) {
      output.push((buffer >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

export function generateTotpSecret(): string {
  return encodeBase32(randomBytes(20));
}

export function createTotpUri(secret: string, email: string): string {
  const label = encodeURIComponent(`Argyros:${email}`);
  const issuer = encodeURIComponent('Argyros');
  return `otpauth://totp/${label}?secret=${encodeURIComponent(secret)}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

function codeForCounter(secret: string, counter: number): string {
  const key = decodeBase32(secret);
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac('sha1', key).update(message).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24)
    | ((digest[offset + 1] & 0xff) << 16)
    | ((digest[offset + 2] & 0xff) << 8)
    | (digest[offset + 3] & 0xff);
  return String(binary % 1_000_000).padStart(6, '0');
}

/** Testable/internal code generator used to verify enrollment fixtures. */
export function createTotpCode(secret: string, now = Date.now()): string {
  return codeForCounter(secret, Math.floor(now / 1000 / 30));
}

export function verifyTotpCode(
  secret: string,
  code: string,
  now = Date.now(),
  window = 1,
): boolean {
  if (!/^\d{6}$/.test(code) || !Number.isInteger(window) || window < 0) return false;
  const currentCounter = Math.floor(now / 1000 / 30);
  const supplied = Buffer.from(code, 'utf8');

  for (let offset = -window; offset <= window; offset += 1) {
    const expected = Buffer.from(codeForCounter(secret, currentCounter + offset), 'utf8');
    if (expected.length === supplied.length && timingSafeEqual(expected, supplied)) return true;
  }
  return false;
}

export function encryptMfaSecret(secret: string, key = getMfaEncryptionKey()): string {
  if (!key || key.length !== 32) throw new Error('MFA encryption is not configured.');
  const iv = randomBytes(AES_IV_BYTES);
  const cipher = createCipheriv(AES_ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [AES_VERSION, iv.toString('hex'), authTag.toString('hex'), ciphertext.toString('base64')].join('.');
}

export function decryptMfaSecret(envelope: string, key = getMfaEncryptionKey()): string {
  if (!key || key.length !== 32) throw new Error('MFA encryption is not configured.');
  const [version, ivHex, authTagHex, ciphertextBase64] = envelope.split('.');
  if (version !== AES_VERSION || !ivHex || !authTagHex || !ciphertextBase64) throw new Error('Invalid MFA secret envelope.');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextBase64, 'base64');
  if (iv.length !== AES_IV_BYTES || authTag.length !== 16 || ciphertext.length === 0) {
    throw new Error('Invalid MFA secret envelope.');
  }

  const decipher = createDecipheriv(AES_ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
