import crypto from 'crypto';

const SECRET_KEY = 'PathExplorer2025SecurityEnhancedKey2025';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 10000;

export function encryptId(id: number): string {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    const derivedKey = crypto.pbkdf2Sync(
      SECRET_KEY,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      'sha256',
    );

    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);

    const idBuffer = Buffer.from(id.toString(), 'utf-8');
    const encrypted = Buffer.concat([
      cipher.update(idBuffer),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    const result = Buffer.concat([
      salt,
      iv,
      authTag,
      encrypted,
    ]);

    return result.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt ID');
  }
}

export function decryptId(encryptedId: string): number {
  try {
    const base64 = encryptedId
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const data = Buffer.from(base64, 'base64');

    const salt = data.subarray(0, SALT_LENGTH);
    const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = data.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + 16);
    const encrypted = data.subarray(SALT_LENGTH + IV_LENGTH + 16);

    const derivedKey = crypto.pbkdf2Sync(
      SECRET_KEY,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      'sha256',
    );

    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return parseInt(decrypted.toString('utf-8'), 10);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt ID');
  }
}
