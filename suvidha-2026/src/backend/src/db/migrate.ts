import { pool } from './postgres';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * Run database migration
 */
export const runMigration = async () => {
    try {
        const migrationPath = path.join(__dirname, '../../migrations/002_add_payment_and_features.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        await pool.query(sql);
        logger.info('✅ Payment and features migration completed successfully');
    } catch (error) {
        logger.error('❌ Migration failed:', error);
        throw error;
    }
};

// Run migration if executed directly
if (require.main === module) {
    runMigration()
        .then(() => {
            logger.info('Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Migration failed:', error);
            process.exit(1);
        });
}
