import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        mobileNumber: string;
    };
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as {
            id: number;
            mobileNumber: string;
        };

        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        logger.warn('Invalid or expired token:', error);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
