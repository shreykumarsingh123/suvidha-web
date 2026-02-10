import { pool } from '../db/postgres';
import logger from '../utils/logger';

export interface ConnectionApplication {
    id: number;
    user_id: number;
    service_type: string;
    application_number: string;
    applicant_name: string;
    mobile_number: string;
    email?: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
    id_proof_type?: string;
    id_proof_number?: string;
    status: string;
    documents?: any;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * Generate application number
 */
export const generateApplicationNumber = (serviceType: string): string => {
    const prefix = serviceType.substring(0, 3).toUpperCase();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}${random}`;
};

/**
 * Create new connection application
 */
export const createConnectionApplication = async (
    data: Partial<ConnectionApplication>
): Promise<ConnectionApplication | null> => {
    try {
        const applicationNumber = generateApplicationNumber(data.service_type || 'GEN');

        const result = await pool.query(
            `INSERT INTO connection_applications 
             (user_id, service_type, application_number, applicant_name, mobile_number, 
              email, address, city, state, pincode, id_proof_type, id_proof_number, documents)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING *`,
            [
                data.user_id,
                data.service_type,
                applicationNumber,
                data.applicant_name,
                data.mobile_number,
                data.email,
                data.address,
                data.city,
                data.state,
                data.pincode,
                data.id_proof_type,
                data.id_proof_number,
                JSON.stringify(data.documents || {}),
            ]
        );

        logger.info(`Connection application created: ${applicationNumber}`);
        return result.rows[0];
    } catch (error) {
        logger.error('Error creating connection application:', error);
        return null;
    }
};

/**
 * Get user's connection applications
 */
export const getUserApplications = async (userId: number): Promise<ConnectionApplication[]> => {
    try {
        const result = await pool.query(
            'SELECT * FROM connection_applications WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        return result.rows;
    } catch (error) {
        logger.error('Error fetching user applications:', error);
        return [];
    }
};

/**
 * Get application by number
 */
export const getApplicationByNumber = async (
    applicationNumber: string
): Promise<ConnectionApplication | null> => {
    try {
        const result = await pool.query(
            'SELECT * FROM connection_applications WHERE application_number = $1',
            [applicationNumber]
        );

        return result.rows[0] || null;
    } catch (error) {
        logger.error('Error fetching application:', error);
        return null;
    }
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (
    applicationNumber: string,
    status: string,
    remarks?: string
): Promise<boolean> => {
    try {
        await pool.query(
            `UPDATE connection_applications 
             SET status = $1, remarks = COALESCE($2, remarks), updated_at = CURRENT_TIMESTAMP
             WHERE application_number = $3`,
            [status, remarks, applicationNumber]
        );

        logger.info(`Application status updated: ${applicationNumber} -> ${status}`);
        return true;
    } catch (error) {
        logger.error('Error updating application status:', error);
        return false;
    }
};

/**
 * Get all applications (admin)
 */
export const getAllApplications = async (): Promise<ConnectionApplication[]> => {
    try {
        const result = await pool.query(
            'SELECT * FROM connection_applications ORDER BY created_at DESC'
        );

        return result.rows;
    } catch (error) {
        logger.error('Error fetching all applications:', error);
        return [];
    }
};
