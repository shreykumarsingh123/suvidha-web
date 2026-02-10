import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../utils/logger';
import { AuthRequest, AuthUser } from '../types/auth.types';

// Re-export for backward compatibility
export { AuthRequest, AuthUser };


/**
 * Authentication middleware to verify JWT tokens
 * Extracts and validates the Bearer token from the Authorization header
 * Attaches decoded user information to the request object
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access token required'
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as AuthUser;

        // Validate decoded token structure
        if (!decoded.id || !decoded.mobileNumber) {
            throw new Error('Invalid token payload');
        }

        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        logger.warn('Invalid or expired token:', error);
        res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

