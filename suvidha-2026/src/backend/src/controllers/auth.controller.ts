import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import User from '../models/user.model';
import {
    requestOtpService,
    verifyOtpService,
    resendOtpService,
} from '../services/otp.service';

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber } = req.body;
        const result = await requestOtpService(mobileNumber);

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        logger.error('Error in requestOtp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber, otp } = req.body;
        if (!mobileNumber || !otp) {
            res.status(400).json({ message: 'Mobile number and OTP are required' });
            return;
        }

        const user = await User.findOne({ mobileNumber });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        if (user.otp !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }

        if (user.otpExpires < new Date()) {
            res.status(400).json({ message: 'OTP expired' });
            return;
        }

        const result = await verifyOtpService(mobileNumber, otp);

        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }

        const token = jwt.sign(
            { id: result.user.id, mobileNumber: result.user.mobileNumber },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: result.user,
        });
    } catch (error) {
        logger.error('Error in verifyOtp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber } = req.body;
        const result = await resendOtpService(mobileNumber);

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        logger.error('Error in resend OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};