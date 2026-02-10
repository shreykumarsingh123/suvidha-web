import { pool } from '../db/postgres';
import logger from '../utils/logger';
import { generateOrderId } from '../utils/cashfree';

export interface Payment {
    id: number;
    user_id: number;
    bill_id?: number;
    order_id: string;
    payment_session_id?: string;
    amount: number;
    currency: string;
    payment_method?: string;
    transaction_id?: string;
    cashfree_order_id?: string;
    cashfree_payment_id?: string;
    status: string;
    payment_time?: Date;
    failure_reason?: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * Create a new payment record
 */
export const createPayment = async (
    userId: number,
    billId: number | null,
    amount: number,
    orderId?: string
): Promise<Payment | null> => {
    try {
        const finalOrderId = orderId || generateOrderId();

        const result = await pool.query(
            `INSERT INTO payments (user_id, bill_id, order_id, amount, currency, status)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, billId, finalOrderId, amount, 'INR', 'pending']
        );

        logger.info(`Payment record created: ${finalOrderId}`);
        return result.rows[0];
    } catch (error) {
        logger.error('Error creating payment record:', error);
        return null;
    }
};

/**
 * Update payment with session ID
 */
export const updatePaymentSession = async (
    orderId: string,
    paymentSessionId: string
): Promise<boolean> => {
    try {
        await pool.query(
            `UPDATE payments 
             SET payment_session_id = $1, updated_at = CURRENT_TIMESTAMP
             WHERE order_id = $2`,
            [paymentSessionId, orderId]
        );

        logger.info(`Payment session updated: ${orderId}`);
        return true;
    } catch (error) {
        logger.error('Error updating payment session:', error);
        return false;
    }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
    orderId: string,
    status: string,
    paymentDetails?: {
        transactionId?: string;
        cashfreeOrderId?: string;
        cashfreePaymentId?: string;
        paymentMethod?: string;
        failureReason?: string;
    }
): Promise<boolean> => {
    try {
        const paymentTime = status === 'success' ? new Date() : null;

        await pool.query(
            `UPDATE payments 
             SET status = $1,
                 transaction_id = COALESCE($2, transaction_id),
                 cashfree_order_id = COALESCE($3, cashfree_order_id),
                 cashfree_payment_id = COALESCE($4, cashfree_payment_id),
                 payment_method = COALESCE($5, payment_method),
                 failure_reason = $6,
                 payment_time = COALESCE($7, payment_time),
                 updated_at = CURRENT_TIMESTAMP
             WHERE order_id = $8`,
            [
                status,
                paymentDetails?.transactionId,
                paymentDetails?.cashfreeOrderId,
                paymentDetails?.cashfreePaymentId,
                paymentDetails?.paymentMethod,
                paymentDetails?.failureReason,
                paymentTime,
                orderId,
            ]
        );

        logger.info(`Payment status updated: ${orderId} -> ${status}`);
        return true;
    } catch (error) {
        logger.error('Error updating payment status:', error);
        return false;
    }
};

/**
 * Get payment by order ID
 */
export const getPaymentByOrderId = async (orderId: string): Promise<Payment | null> => {
    try {
        const result = await pool.query(
            'SELECT * FROM payments WHERE order_id = $1',
            [orderId]
        );

        return result.rows[0] || null;
    } catch (error) {
        logger.error('Error fetching payment:', error);
        return null;
    }
};

/**
 * Get all payments for a user
 */
export const getUserPayments = async (userId: number): Promise<Payment[]> => {
    try {
        const result = await pool.query(
            `SELECT p.*, b.service_type, b.consumer_number, b.bill_month
             FROM payments p
             LEFT JOIN bills b ON p.bill_id = b.id
             WHERE p.user_id = $1
             ORDER BY p.created_at DESC`,
            [userId]
        );

        return result.rows;
    } catch (error) {
        logger.error('Error fetching user payments:', error);
        return [];
    }
};

/**
 * Get payment statistics
 */
export const getPaymentStats = async (): Promise<any> => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_transactions,
                SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_payments,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_payments,
                SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as total_amount
            FROM payments
        `);

        return result.rows[0];
    } catch (error) {
        logger.error('Error fetching payment stats:', error);
        return null;
    }
};
