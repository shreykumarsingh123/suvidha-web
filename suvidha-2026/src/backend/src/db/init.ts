import { query } from './postgres';
import logger from '../utils/logger';

export const initializeDatabase = async (): Promise<void> => {
    await query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            mobile_number TEXT UNIQUE NOT NULL,
            otp_encrypted TEXT,
            otp_expires TIMESTAMPTZ,
            last_login TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    logger.info('Database schema ensured');
};
