import User from '../models/user.model';
import { sendOtp as sendOtpViatwilio } from '../utils/twilio';
import logger from '../utils/logger';

/**
 * Generate a random 4-digit OTP
 */
const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

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

        let user = await User.findOne({ mobileNumber });
        if (!user) {
            user = new User({ mobileNumber });
        }

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via SMS using Twilio
        const smsSent = await sendOtpViatwilio(mobileNumber, otp);

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

        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        if (user.otp !== otp) {
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

        // Clear OTP
        user.otp = undefined as any;
        user.otpExpires = undefined as any;
        user.lastLogin = new Date();
        await user.save();

        logger.info(`OTP verified successfully for ${mobileNumber}`);
        return {
            success: true,
            message: 'OTP verified successfully',
            user: {
                id: user._id,
                mobileNumber: user.mobileNumber,
                lastLogin: user.lastLogin,
            },
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
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return {
                success: false,
                message: 'User not found',
            };
        }

        if (!user.otp) {
            return {
                success: false,
                message: 'No pending OTP found. Please request a new OTP.',
            };
        }

        // Send existing OTP again
        const smsSent = await sendOtpViatwilio(mobileNumber, user.otp);

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
