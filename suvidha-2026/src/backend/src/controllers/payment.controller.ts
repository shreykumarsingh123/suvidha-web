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
import { userRepository } from '../repositories/user.repository';
import { sanitizeObject, validatePaymentData, sanitizeWebhookData } from '../utils/security';
import logger from '../utils/logger';


const router = Router();

/**
 * Create payment order
 */
router.post('/create-order', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        logger.info(`Payment order creation request received. UserId: ${userId}`);
        logger.info(`Request body:`, JSON.stringify(req.body));

        // Sanitize incoming data to prevent prototype pollution
        const sanitizedBody = sanitizeObject(req.body);
        const { amount, billId, customerName, customerPhone } = sanitizedBody;

        // Validate payment data - handle amount as it comes (could be number or string)
        const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        logger.info(`Validating payment: amount=${numericAmount}, customerName=${customerName}, customerPhone=${customerPhone}`);
        const validation = validatePaymentData({ amount: numericAmount, customerName, customerPhone });
        if (!validation.valid) {
            logger.error(`Payment validation failed:`, validation.errors);
            return res.status(400).json({
                success: false,
                message: 'Invalid payment data',
                errors: validation.errors,
            });
        }

        // Create payment record in database
        const orderId = generateOrderId();
        const payment = await createPayment(userId, billId || null, numericAmount, orderId);

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
            orderAmount: numericAmount,
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
        // Sanitize webhook data to prevent prototype pollution attacks
        const sanitizedData = sanitizeWebhookData(req.body);
        const { orderId, orderAmount, txStatus, txMsg, txTime, referenceId, paymentMode } = sanitizedData;

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
 * Get payment history for authenticated user
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
            message: 'Failed to fetch payment history',
        });
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

        const user = await userRepository.findById(userId);

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
            customerName: user.mobileNumber,
            customerPhone: user.mobileNumber,
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
