import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { billRepository } from '../repositories/bill.repository';
import { findTicketsByUserId } from '../repositories/ticket.repository';
import logger from '../utils/logger';

interface AuthRequest extends Request {
    user?: {
        id: number;
        mobile: string;
    };
}

export class UserController {
    /**
     * Get user profile with bills and complaints
     */
    public async getUserProfile(req: Request, res: Response) {
        try {
            const mobileNumber = req.params.mobileNumber;

            if (!mobileNumber) {
                res.status(400).json({ message: 'Mobile number is required' });
                return;
            }

            // Find user by mobile number
            const user = await userRepository.findByMobileNumber(mobileNumber);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Get user's bills
            const bills = await billRepository.findByUserId(user.id);

            // Get user's complaints/tickets
            const complaints = await findTicketsByUserId(user.id);

            const profile = {
                id: user.id,
                mobileNumber: user.mobileNumber,
                username: user.username || 'username',
                bills: bills,
                complaints: complaints,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt
            };

            res.status(200).json({
                message: 'User profile retrieved successfully',
                profile: profile
            });
        } catch (error) {
            logger.error('Error in getUserProfile controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update user profile (username)
     */
    public async updateUserProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { username } = req.body;

            if (!username) {
                res.status(400).json({ message: 'Username is required' });
                return;
            }

            const updatedUser = await userRepository.updateUsername(userId, username);

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser.id,
                    mobileNumber: updatedUser.mobileNumber,
                    username: updatedUser.username
                }
            });
        } catch (error) {
            logger.error('Error in updateUserProfile controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get current authenticated user
     */
    public async getCurrentUser(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const user = await userRepository.findById(userId);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                message: 'User retrieved successfully',
                user: {
                    id: user.id,
                    mobileNumber: user.mobileNumber,
                    username: user.username || 'username',
                    lastLogin: user.lastLogin
                }
            });
        } catch (error) {
            logger.error('Error in getCurrentUser controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
