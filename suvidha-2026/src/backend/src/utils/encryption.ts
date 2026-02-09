import crypto from 'crypto';
import { config } from '../config';

const algorithm = 'aes-256-gcm';
const ivLength = 12;

const getKey = (): Buffer => {
    const key = config.encryption.key;
    if (!key) {
        throw new Error('DATA_ENCRYPTION_KEY is required');
    }

    const decoded = Buffer.from(key, 'base64');
    if (decoded.length !== 32) {
        throw new Error('DATA_ENCRYPTION_KEY must be a 32-byte base64-encoded value');
    }

    return decoded;
};

export const encryptValue = (plainText: string): string => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, getKey(), iv);

    const encrypted = Buffer.concat([
        cipher.update(plainText, 'utf8'),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
};

export const decryptValue = (cipherText: string): string => {
    const data = Buffer.from(cipherText, 'base64');
    const iv = data.subarray(0, ivLength);
    const authTag = data.subarray(ivLength, ivLength + 16);
    const encrypted = data.subarray(ivLength + 16);

    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
};
