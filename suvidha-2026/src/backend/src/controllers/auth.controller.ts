import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';


// Mock function to generate OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobileNumber } = req.body;
        if (!mobileNumber) {
            res.status(400).json({ message: 'Mobile number is required' });
            return;
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

        logger.info(`OTP for ${mobileNumber} is ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully' });
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

        // Clear OTP
        user.otp = undefined as any;
        user.otpExpires = undefined as any;
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user._id, mobileNumber: user.mobileNumber },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                mobileNumber: user.mobileNumber,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        logger.error('Error in verifyOtp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
