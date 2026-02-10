import { pool } from './postgres';
import logger from '../utils/logger';

export interface User {
    id: number;
    mobile: string;
    created_at: Date;
}

/**
 * Find user by ID
 */
export const findUserById = async (userId: number): Promise<User | null> => {
    try {
        const result = await pool.query(
            'SELECT id, mobile, created_at FROM users WHERE id = $1',
            [userId]
        );

        return result.rows[0] || null;
    } catch (error) {
        logger.error('Error finding user by ID:', error);
        return null;
    }
};

/**
 * Find user by mobile number
 */
export const findUserByMobile = async (mobile: string): Promise<User | null> => {
    try {
        const result = await pool.query(
            'SELECT id, mobile, created_at FROM users WHERE mobile = $1',
            [mobile]
        );

        return result.rows[0] || null;
    } catch (error) {
        logger.error('Error finding user by mobile:', error);
        return null;
    }
};
