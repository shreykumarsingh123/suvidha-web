import twilio from 'twilio';
import logger from './logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send OTP via SMS using Twilio
 * @param mobileNumber - The recipient's mobile number in E.164 format (e.g., +91XXXXXXXXXX)
 * @param otp - The one-time password to send
 * @returns Promise<boolean> - Returns true if SMS was sent successfully, false otherwise
 */
export const sendOtp = async (mobileNumber: string, otp: string): Promise<boolean> => {
    try {
        if (!accountSid || !authToken || !fromNumber) {
            logger.error('Twilio credentials are not configured properly');
            return false;
        }

        const message = `Your OTP is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;

        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: mobileNumber,
        });

        logger.info(`OTP sent successfully to ${mobileNumber}. Message SID: ${result.sid}`);
        return true;
    } catch (error) {
        logger.error(`Failed to send OTP to ${mobileNumber}:`, error);
        return false;
    }
};

/**
 * Send custom message via SMS using Twilio
 * @param mobileNumber - The recipient's mobile number in E.164 format
 * @param message - The message content to send
 * @returns Promise<boolean> - Returns true if SMS was sent successfully, false otherwise
 */
export const sendSMS = async (mobileNumber: string, message: string): Promise<boolean> => {
    try {
        if (!accountSid || !authToken || !fromNumber) {
            logger.error('Twilio credentials are not configured properly');
            return false;
        }

        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: mobileNumber,
        });

        logger.info(`SMS sent successfully to ${mobileNumber}. Message SID: ${result.sid}`);
        return true;
    } catch (error) {
        logger.error(`Failed to send SMS to ${mobileNumber}:`, error);
        return false;
    }
};
