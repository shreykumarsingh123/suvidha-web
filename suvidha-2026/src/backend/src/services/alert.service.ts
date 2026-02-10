import { pool } from '../db/postgres';
import logger from '../utils/logger';

export interface Alert {
    id: number;
    alert_type: string;
    title: string;
    message: string;
    severity: string;
    service_type?: string;
    active: boolean;
    start_time: Date;
    end_time?: Date;
    created_at: Date;
}

/**
 * Create new alert
 */
export const createAlert = async (
    alertType: string,
    title: string,
    message: string,
    severity: string,
    serviceType?: string,
    endTime?: Date
): Promise<Alert | null> => {
    try {
        const result = await pool.query(
            `INSERT INTO alerts (alert_type, title, message, severity, service_type, end_time)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [alertType, title, message, severity, serviceType, endTime]
        );

        logger.info(`Alert created: ${title}`);
        return result.rows[0];
    } catch (error) {
        logger.error('Error creating alert:', error);
        return null;
    }
};

/**
 * Get active alerts
 */
export const getActiveAlerts = async (serviceType?: string): Promise<Alert[]> => {
    try {
        let query = `
            SELECT * FROM alerts 
            WHERE active = true 
            AND (end_time IS NULL OR end_time > CURRENT_TIMESTAMP)
        `;
        const params: any[] = [];

        if (serviceType) {
            query += ' AND (service_type IS NULL OR service_type = $1)';
            params.push(serviceType);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        logger.error('Error fetching active alerts:', error);
        return [];
    }
};

/**
 * Deactivate alert
 */
export const deactivateAlert = async (alertId: number): Promise<boolean> => {
    try {
        await pool.query('UPDATE alerts SET active = false WHERE id = $1', [alertId]);
        logger.info(`Alert deactivated: ${alertId}`);
        return true;
    } catch (error) {
        logger.error('Error deactivating alert:', error);
        return false;
    }
};

/**
 * Get all alerts (admin)
 */
export const getAllAlerts = async (): Promise<Alert[]> => {
    try {
        const result = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        logger.error('Error fetching all alerts:', error);
        return [];
    }
};
