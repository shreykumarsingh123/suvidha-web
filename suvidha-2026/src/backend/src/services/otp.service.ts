import crypto from 'crypto';
import logger from '../utils/logger';
import { sendOtp as sendOtpViaTwilio } from '../utils/twilio';
import { decryptValue, encryptValue } from '../utils/encryption';
import {
    clearUserOtp,
    findUserByMobileNumber,
    upsertUserOtp,
    UserRecord,
} from '../repositories/user.repository';

/**
 * Generate a random 4-digit OTP
 */
const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const isOtpMatch = (storedOtp: string, providedOtp: string): boolean => {
    const storedBuffer = Buffer.from(storedOtp, 'utf8');
    const providedBuffer = Buffer.from(providedOtp, 'utf8');

    if (storedBuffer.length !== providedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(storedBuffer, providedBuffer);
};

const buildUserResponse = (user: UserRecord) => ({
    id: user.id,
    mobileNumber: user.mobileNumber,
    lastLogin: user.lastLogin,
});

/**
 * Request OTP for a given mobile number
 * Generates OTP, saves to database, and sends via SMS
 *
 * @param mobileNumber - The mobile number to send OTP to
 * @returns Promise<{success: boolean, message: string, otp?: string}>
 */
export const requestOtpService = async (mobileNumber: string): Promise<{
    success: boolean;
    message: string;
    otp?: string;
}> => {
    try {
        if (!mobileNumber) {
            return {
                success: false,
                message: 'Mobile number is required',
            };
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const encryptedOtp = encryptValue(otp);

        await upsertUserOtp(mobileNumber, encryptedOtp, otpExpires);

        const smsSent = await sendOtpViaTwilio(mobileNumber, otp);

        if (!smsSent) {
            logger.warn(
                `Failed to send OTP via SMS to ${mobileNumber}, but OTP stored in database`
            );
            return {
                success: true,
                message: 'OTP generated but SMS delivery failed. Please try again.',
                otp: process.env.NODE_ENV === 'development' ? otp : undefined,
            };
        }

        logger.info(`OTP requested and sent successfully to ${mobileNumber}`);
        return {
            success: true,
            message: 'OTP sent successfully',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        };
    } catch (error) {
        logger.error('Error in requestOtpService:', error);
        return {
            success: false,
            message: 'Failed to request OTP',
        };
    }
};

/**
 * Verify OTP for a given mobile number
 * Validates OTP and expiration time
 *
 * @param mobileNumber - The mobile number
 * @param otp - The OTP to verify
 * @returns Promise<{success: boolean, message: string, user?: any}>
 */
export const verifyOtpService = async (
    mobileNumber: string,
    otp: string
): Promise<{
    success: boolean;
    message: string;
    user?: any;
}> => {
    try {
        if (!mobileNumber || !otp) {
            return {
                success: false,
                message: 'Mobile number and OTP are required',
            };
        }

        const user = await findUserByMobileNumber(mobileNumber);
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        if (!user.otpEncrypted) {
            return {
                success: false,
                message: 'No OTP found. Please request a new OTP.',
            };
        }

        const storedOtp = decryptValue(user.otpEncrypted);

        if (!isOtpMatch(storedOtp, otp)) {
            logger.warn(`Invalid OTP attempt for ${mobileNumber}`);
            return {
                success: false,
                message: 'Invalid OTP',
            };
        }

        if (user.otpExpires && user.otpExpires < new Date()) {
            logger.warn(`Expired OTP used for ${mobileNumber}`);
            return {
                success: false,
                message: 'OTP expired',
            };
        }

        const updatedUser = await clearUserOtp(mobileNumber);
        if (!updatedUser) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        logger.info(`OTP verified successfully for ${mobileNumber}`);
        return {
            success: true,
            message: 'OTP verified successfully',
            user: buildUserResponse(updatedUser),
        };
    } catch (error) {
        logger.error('Error in verifyOtpService:', error);
        return {
            success: false,
            message: 'Failed to verify OTP',
        };
    }
};

/**
 * Resend OTP for a given mobile number
 * Useful when user clicks "Resend OTP"
 *
 * @param mobileNumber - The mobile number
 * @returns Promise<{success: boolean, message: string}>
 */
export const resendOtpService = async (mobileNumber: string): Promise<{
    success: boolean;
    message: string;
}> => {
    try {
        const user = await findUserByMobileNumber(mobileNumber);
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        if (!user.otpEncrypted) {
            return {
                success: false,
                message: 'No pending OTP found. Please request a new OTP.',
            };
        }

        const otp = decryptValue(user.otpEncrypted);
        const smsSent = await sendOtpViaTwilio(mobileNumber, otp);

        if (!smsSent) {
            logger.warn(`Failed to resend OTP to ${mobileNumber}`);
            return {
                success: false,
                message: 'Failed to resend OTP. Please try again later.',
            };
        }

        logger.info(`OTP resent successfully to ${mobileNumber}`);
        return {
            success: true,
            message: 'OTP resent successfully',
        };
    } catch (error) {
        logger.error('Error in resendOtpService:', error);
        return {
            success: false,
            message: 'Failed to resend OTP',
        };
    }
};
