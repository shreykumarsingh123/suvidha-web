import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const rateLimitStore: RateLimitStore = {};

setInterval(() => {
    const now = Date.now();
    for (const key in rateLimitStore) {
        if (rateLimitStore[key].resetTime < now) {
            delete rateLimitStore[key];
        }
    }
}, 60 * 1000);

interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
    message?: string;
    keyGenerator?: (req: Request) => string;
}

export const rateLimit = (options: RateLimitOptions) => {
    const { windowMs, maxRequests, message = 'Too many requests. Please try again later.', keyGenerator } = options;

    return (req: Request, res: Response, next: NextFunction) => {
        const key = keyGenerator ? keyGenerator(req) : req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();

        if (!rateLimitStore[key]) {
            rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
        } else if (rateLimitStore[key].resetTime < now) {
            rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
        } else {
            rateLimitStore[key].count++;
        }

        if (rateLimitStore[key].count > maxRequests) {
            const resetTime = new Date(rateLimitStore[key].resetTime).toISOString();
            logger.warn(`Rate limit exceeded for ${key}. Reset at ${resetTime}`);
            res.status(429).json({
                message,
                retryAfter: Math.ceil((rateLimitStore[key].resetTime - now) / 1000),
            });
            return;
        }

        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - rateLimitStore[key].count);
        res.setHeader('X-RateLimit-Reset', rateLimitStore[key].resetTime);

        next();
    };
};

export const otpRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    maxRequests: 3,
    message: 'Too many OTP requests. Please try again in 5 minutes.',
    keyGenerator: (req: Request) => {
        const mobileNumber = (req.body?.mobileNumber as string) || (req.ip as string);
        return `otp:${mobileNumber}`;
    },
});

export const verifyOtpRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many verification attempts. Please try again later.',
    keyGenerator: (req: Request) => {
        const mobileNumber = (req.body?.mobileNumber as string) || (req.ip as string);
        return `verify:${mobileNumber}`;
    },
});

export const resendOtpRateLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    maxRequests: 2,
    message: 'Too many resend requests. Please wait before trying again.',
    keyGenerator: (req: Request) => {
        const mobileNumber = (req.body?.mobileNumber as string) || (req.ip as string);
        return `resend:${mobileNumber}`;
    },
});