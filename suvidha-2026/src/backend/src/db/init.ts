import { query } from './postgres';
import logger from '../utils/logger';

export const initializeDatabase = async (): Promise<void> => {
    // Create users table
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

    // Create tickets table
    await query(`
        CREATE TABLE IF NOT EXISTS tickets (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            priority TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'open',
            user_id INTEGER NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // Create indexes for better query performance
    await query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    `);

    await query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
    `);

    logger.info('Database schema ensured');
};
