import { Router } from 'express';
import { requestOtp, verifyOtp, resendOtp } from '../controllers/auth.controller';
import {
    otpRateLimit,
    verifyOtpRateLimit,
    resendOtpRateLimit,
} from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/request-otp', otpRateLimit, requestOtp);
router.post('/verify-otp', verifyOtpRateLimit, verifyOtp);
router.post('/resend-otp', resendOtpRateLimit, resendOtp);

export default router;
