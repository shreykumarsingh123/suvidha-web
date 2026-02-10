import { Router } from 'express';
import { requestOtp, verifyOtp, resendOtp, logout } from '../controllers/auth.controller';
import { verifyMSG91AccessToken } from '../controllers/msg91.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import {
    otpRateLimit,
    verifyOtpRateLimit,
    resendOtpRateLimit,
} from '../middleware/rateLimit.middleware';

const router = Router();

// Public authentication routes
router.post('/request-otp', otpRateLimit, requestOtp);
router.post('/verify-otp', verifyOtpRateLimit, verifyOtp);
router.post('/resend-otp', resendOtpRateLimit, resendOtp);

// MSG91 Widget verification route
router.post('/verify-msg91-token', verifyMSG91AccessToken);

// Protected logout route
router.post('/logout', authenticateToken, logout);

export default router;

