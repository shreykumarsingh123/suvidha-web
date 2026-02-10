import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
    createPaymentOrder,
    getPaymentStatus,
    generateOrderId,
} from '../utils/cashfree';
import {
    createPayment,
    updatePaymentSession,
    updatePaymentStatus,
    getPaymentByOrderId,
    getUserPayments,
} from '../services/payment.service';
import { generateReceipt } from '../services/receipt.service';
import { findUserById } from '../db/user.db';
import logger from '../utils/logger';

const router = Router();

/**
 * Create payment order
 */
router.post('/create-order', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { amount, billId, customerName, customerPhone } = req.body;

        if (!amount || !customerName || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        // Create payment record in database
        const orderId = generateOrderId();
        const payment = await createPayment(userId, billId || null, parseFloat(amount), orderId);

        if (!payment) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create payment record',
            });
        }

        // Create Cashfree order
        const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/payment/callback`;

        const cashfreeOrder = await createPaymentOrder({
            orderId: payment.order_id,
            orderAmount: parseFloat(amount),
            customerName,
            customerPhone,
            returnUrl,
        });

        if (!cashfreeOrder) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create payment order',
            });
        }

        // Update payment with session ID
        await updatePaymentSession(payment.order_id, cashfreeOrder.paymentSessionId);

        res.json({
            success: true,
            data: {
                orderId: cashfreeOrder.orderId,
                paymentSessionId: cashfreeOrder.paymentSessionId,
                orderStatus: cashfreeOrder.orderStatus,
            },
        });
    } catch (error) {
        logger.error('Error creating payment order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

/**
 * Payment webhook from Cashfree
 */
router.post('/webhook', async (req: Request, res: Response) => {
    try {
        const { orderId, orderAmount, txStatus, txMsg, txTime, referenceId, paymentMode } = req.body;

        logger.info(`Payment webhook received for order: ${orderId}`);

        const status = txStatus === 'SUCCESS' ? 'success' : 'failed';

        await updatePaymentStatus(orderId, status, {
            transactionId: referenceId,
            cashfreePaymentId: referenceId,
            paymentMethod: paymentMode,
            failureReason: txStatus !== 'SUCCESS' ? txMsg : undefined,
        });

        res.json({ success: true });
    } catch (error) {
        logger.error('Error processing payment webhook:', error);
        res.status(500).json({ success: false });
    }
});

/**
 * Verify payment status
 */
router.get('/verify/:orderId', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const payment = await getPaymentByOrderId(orderId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        // Fetch latest status from Cashfree
        const cashfreeStatus = await getPaymentStatus(orderId);

        if (cashfreeStatus && cashfreeStatus.length > 0) {
            const latestPayment = cashfreeStatus[0];
            const status = latestPayment.payment_status === 'SUCCESS' ? 'success' : 'failed';

            await updatePaymentStatus(orderId, status, {
                transactionId: latestPayment.cf_payment_id,
                cashfreePaymentId: latestPayment.cf_payment_id,
                paymentMethod: latestPayment.payment_method,
            });
        }

        // Get updated payment
        const updatedPayment = await getPaymentByOrderId(orderId);

        res.json({
            success: true,
            data: updatedPayment,
        });
    } catch (error) {
        logger.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

/**
 * Get user's payment history
 */
router.get('/history', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const payments = await getUserPayments(userId);

        res.json({
            success: true,
            data: payments,
        });
    } catch (error) {
        logger.error('Error fetching payment history:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

/**
 * Download payment receipt
 */
router.get('/receipt/:orderId', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const userId = (req as any).user.id;

        const payment = await getPaymentByOrderId(orderId);

        if (!payment || payment.user_id !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        if (payment.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Receipt only available for successful payments',
            });
        }

        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const receiptPath = await generateReceipt({
            orderId: payment.order_id,
            transactionId: payment.transaction_id || 'N/A',
            amount: parseFloat(payment.amount.toString()),
            paymentMethod: payment.payment_method || 'N/A',
            paymentTime: payment.payment_time || new Date(),
            customerName: user.mobile,
            customerPhone: user.mobile,
        });

        if (!receiptPath) {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate receipt',
            });
        }

        res.download(receiptPath);
    } catch (error) {
        logger.error('Error downloading receipt:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

export default router;
