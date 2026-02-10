import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import axios from 'axios';
import logger from '../utils/logger';

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;

/**
 * Verify MSG91 Widget Access Token
 * This endpoint receives the access token from MSG91's OTP widget
 * and verifies it with MSG91's server
 */
export const verifyMSG91AccessToken = async (req: any, res: Response): Promise<void> => {
    try {
        const { accessToken, mobileNumber } = req.body;

        if (!accessToken) {
            res.status(400).json({
                success: false,
                message: 'Access token is required'
            });
            return;
        }

        if (!MSG91_AUTH_KEY) {
            logger.error('MSG91 Auth Key not configured');
            res.status(500).json({
                success: false,
                message: 'MSG91 configuration error'
            });
            return;
        }

        // Verify access token with MSG91
        const verificationUrl = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';

        const response = await axios.post(verificationUrl, {
            authkey: MSG91_AUTH_KEY,
            'access-token': accessToken
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.data.type === 'success') {
            logger.info(`MSG91 access token verified successfully for ${mobileNumber}`);

            // Token is valid, return success
            res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                data: {
                    verified: true,
                    mobileNumber: response.data.mobile || mobileNumber
                }
            });
        } else {
            logger.warn(`MSG91 access token verification failed: ${JSON.stringify(response.data)}`);
            res.status(401).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }
    } catch (error: any) {
        logger.error('Error verifying MSG91 access token:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
};
