import axios from 'axios';
import logger from './logger';
import crypto from 'crypto';

const CASHFREE_BASE_URL = process.env.CASHFREE_ENV === 'PRODUCTION'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';

export interface PaymentOrderRequest {
    orderId: string;
    orderAmount: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    returnUrl: string;
}

export interface PaymentOrder {
    orderId: string;
    paymentSessionId: string;
    orderStatus: string;
}

/**
 * Create a payment order with Cashfree
 */
export const createPaymentOrder = async (
    request: PaymentOrderRequest
): Promise<PaymentOrder | null> => {
    try {
        const orderData = {
            order_id: request.orderId,
            order_amount: request.orderAmount,
            order_currency: 'INR',
            customer_details: {
                customer_id: request.customerPhone,
                customer_name: request.customerName,
                customer_email: request.customerEmail || `${request.customerPhone}@suvidha.gov.in`,
                customer_phone: request.customerPhone,
            },
            order_meta: {
                return_url: request.returnUrl,
            },
        };

        logger.info(`Creating Cashfree order: ${request.orderId}`);

        const response = await axios.post(
            `${CASHFREE_BASE_URL}/orders`,
            orderData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-version': '2023-08-01',
                    'x-client-id': CASHFREE_APP_ID,
                    'x-client-secret': CASHFREE_SECRET_KEY,
                },
            }
        );

        if (response.data && response.data.payment_session_id) {
            logger.info(`Cashfree order created successfully: ${request.orderId}`);
            return {
                orderId: response.data.order_id || request.orderId,
                paymentSessionId: response.data.payment_session_id,
                orderStatus: response.data.order_status || 'ACTIVE',
            };
        }

        logger.error('Failed to create Cashfree order:', response.data);
        return null;
    } catch (error: any) {
        logger.error('Error creating Cashfree payment order:', error.response?.data || error.message);
        return null;
    }
};

/**
 * Verify payment signature from Cashfree webhook
 */
export const verifyPaymentSignature = (
    orderId: string,
    orderAmount: string,
    signature: string
): boolean => {
    try {
        const expectedSignature = crypto
            .createHmac('sha256', CASHFREE_SECRET_KEY)
            .update(`${orderId}${orderAmount}`)
            .digest('base64');

        return expectedSignature === signature;
    } catch (error) {
        logger.error('Error verifying payment signature:', error);
        return false;
    }
};

/**
 * Get payment status from Cashfree
 */
export const getPaymentStatus = async (orderId: string): Promise<any> => {
    try {
        logger.info(`Fetching payment status for order: ${orderId}`);

        const response = await axios.get(
            `${CASHFREE_BASE_URL}/orders/${orderId}/payments`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-version': '2023-08-01',
                    'x-client-id': CASHFREE_APP_ID,
                    'x-client-secret': CASHFREE_SECRET_KEY,
                },
            }
        );

        if (response.data) {
            return response.data;
        }

        logger.error('Failed to fetch payment status:', response.data);
        return null;
    } catch (error: any) {
        logger.error('Error fetching payment status:', error.response?.data || error.message);
        return null;
    }
};

/**
 * Generate unique order ID
 */
export const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD_${timestamp}_${random}`;
};
