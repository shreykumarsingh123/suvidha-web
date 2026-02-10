import { Pool } from 'pg';
import { config } from '../config';
import logger from '../utils/logger';

export const pool = new Pool({
    connectionString: config.postgres.url,
    max: config.postgres.poolMax,
    idleTimeoutMillis: config.postgres.idleTimeoutMs,
    connectionTimeoutMillis: config.postgres.connectionTimeoutMs,
    ssl: config.postgres.sslEnabled
        ? {
            rejectUnauthorized: config.postgres.sslRejectUnauthorized,
        }
        : undefined,
});

export const connectPostgres = async (): Promise<void> => {
    try {
        await pool.query('SELECT 1');
        logger.info('PostgreSQL connected');
    } catch (error) {
        logger.error('PostgreSQL connection error:', error);
        throw error;
    }
};

export const query = <T>(text: string, params?: Array<unknown>) => {
    return pool.query(text, params) as unknown as { rows: T[]; rowCount: number | null };
};
