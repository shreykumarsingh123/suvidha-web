import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/auth.types';
import logger from '../utils/logger';
import {
    requestOtpService,
    verifyOtpService,
    resendOtpService,
} from '../services/otp.service';
import { clearUserOtp } from '../repositories/user.repository';

/**
 * Request OTP for mobile number
 * Generates and sends OTP via SMS
 */
export const requestOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber } = req.body;
        const result = await requestOtpService(mobileNumber);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        logger.error('Error in requestOtp:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Verify OTP and authenticate user
 * Returns JWT token on successful verification
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber, otp } = req.body;
        if (!mobileNumber || !otp) {
            res.status(400).json({
                success: false,
                message: 'Mobile number and OTP are required'
            });
            return;
        }

        const result = await verifyOtpService(mobileNumber, otp);

        if (!result.success || !result.user) {
            res.status(400).json({
                success: false,
                message: result.message
            });
            return;
        }

        const token = jwt.sign(
            { id: result.user.id, mobileNumber: result.user.mobileNumber },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: result.user,
        });
    } catch (error) {
        logger.error('Error in verifyOtp:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Resend OTP to mobile number
 * Sends the same OTP again via SMS
 */
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber } = req.body;
        const result = await resendOtpService(mobileNumber);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        logger.error('Error in resend OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Logout user and clear any pending OTP data
 * Provides clean session termination
 * 
 * Note: This clears OTP data from the database. JWT token invalidation
 * requires additional infrastructure (token blacklist/Redis) which can
 * be implemented in future iterations.
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const mobileNumber = req.user?.mobileNumber;

        if (!userId || !mobileNumber) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        // Clear any pending OTP data for security
        await clearUserOtp(mobileNumber);

        logger.info(`User logged out successfully: ${mobileNumber}`);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        logger.error('Error in logout:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

