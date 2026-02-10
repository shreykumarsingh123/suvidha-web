import axios from 'axios';
import logger from './logger';

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || 'SUVIDH';
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_DLT_ENTITY_ID = process.env.MSG91_DLT_ENTITY_ID;

/**
 * Send OTP via SMS using MSG91
 * @param mobileNumber - The recipient's mobile number (10 digits without +91)
 * @param otp - The one-time password to send
 * @returns Promise<boolean> - Returns true if SMS was sent successfully, false otherwise
 */
export const sendOtp = async (mobileNumber: string, otp: string): Promise<boolean> => {
    try {
        if (!MSG91_AUTH_KEY) {
            logger.error('MSG91 Auth Key is not configured');
            logger.info('Development mode: OTP would be sent via MSG91');
            return true; // Return true in development to allow testing
        }

        // Remove +91 if present and ensure 10 digits
        const cleanNumber = mobileNumber.replace(/^\+91/, '').replace(/\D/g, '');

        if (cleanNumber.length !== 10) {
            logger.error(`Invalid mobile number format: ${mobileNumber}`);
            return false;
        }

        // MSG91 OTP API endpoint
        const url = 'https://control.msg91.com/api/v5/otp';

        const payload = {
            template_id: MSG91_TEMPLATE_ID,
            mobile: `91${cleanNumber}`, // MSG91 expects country code + number
            authkey: MSG91_AUTH_KEY,
            otp: otp,
            // Optional: Add DLT Entity ID for compliance
            ...(MSG91_DLT_ENTITY_ID && { DLT_TE_ID: MSG91_DLT_ENTITY_ID })
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'authkey': MSG91_AUTH_KEY
            }
        });

        if (response.data.type === 'success') {
            logger.info(`OTP sent successfully to ${cleanNumber} via MSG91`);
            return true;
        } else {
            logger.error(`MSG91 API error: ${JSON.stringify(response.data)}`);
            return false;
        }
    } catch (error: any) {
        logger.error(`Failed to send OTP via MSG91 to ${mobileNumber}:`, error.response?.data || error.message);
        return false;
    }
};

/**
 * Verify OTP using MSG91 (Optional - if using MSG91's verification)
 * @param mobileNumber - The recipient's mobile number
 * @param otp - The OTP to verify
 * @returns Promise<boolean>
 */
export const verifyOtpWithMSG91 = async (mobileNumber: string, otp: string): Promise<boolean> => {
    try {
        if (!MSG91_AUTH_KEY) {
            logger.warn('MSG91 Auth Key not configured, skipping MSG91 verification');
            return true;
        }

        const cleanNumber = mobileNumber.replace(/^\+91/, '').replace(/\D/g, '');

        const url = `https://control.msg91.com/api/v5/otp/verify`;

        const payload = {
            authkey: MSG91_AUTH_KEY,
            mobile: `91${cleanNumber}`,
            otp: otp
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'authkey': MSG91_AUTH_KEY
            }
        });

        if (response.data.type === 'success') {
            logger.info(`OTP verified successfully via MSG91 for ${cleanNumber}`);
            return true;
        } else {
            logger.error(`MSG91 verification failed: ${JSON.stringify(response.data)}`);
            return false;
        }
    } catch (error: any) {
        logger.error(`MSG91 OTP verification error:`, error.response?.data || error.message);
        return false;
    }
};

/**
 * Send custom message via SMS using MSG91
 * @param mobileNumber - The recipient's mobile number
 * @param message - The message content to send
 * @returns Promise<boolean>
 */
export const sendSMS = async (mobileNumber: string, message: string): Promise<boolean> => {
    try {
        if (!MSG91_AUTH_KEY) {
            logger.error('MSG91 Auth Key is not configured');
            return false;
        }

        const cleanNumber = mobileNumber.replace(/^\+91/, '').replace(/\D/g, '');

        const url = 'https://control.msg91.com/api/v5/flow/';

        const payload = {
            authkey: MSG91_AUTH_KEY,
            sender: MSG91_SENDER_ID,
            mobiles: `91${cleanNumber}`,
            message: message
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'authkey': MSG91_AUTH_KEY
            }
        });

        if (response.data.type === 'success') {
            logger.info(`SMS sent successfully to ${cleanNumber} via MSG91`);
            return true;
        } else {
            logger.error(`MSG91 SMS error: ${JSON.stringify(response.data)}`);
            return false;
        }
    } catch (error: any) {
        logger.error(`Failed to send SMS via MSG91:`, error.response?.data || error.message);
        return false;
    }
};
