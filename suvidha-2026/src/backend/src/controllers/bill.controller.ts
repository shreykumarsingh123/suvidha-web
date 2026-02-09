import { Request, Response } from 'express';
import {
    createBillService,
    getBillByIdService,
    getBillsByUserIdService,
    getBillsByServiceTypeService,
    updateBillService,
    deleteBillService,
    markBillAsPaidService
} from '../services/bill.service';
import { CreateBillDto, UpdateBillDto } from '../models/bill.model';
import logger from '../utils/logger';

interface AuthRequest extends Request {
    user?: {
        id: number;
        mobile: string;
    };
}

export class BillController {
    /**
     * Create a new bill
     */
    public async createBill(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const billData: CreateBillDto = {
                ...req.body,
                userId,
            };

            const result = await createBillService(billData);

            if (result.success) {
                res.status(201).json({
                    message: result.message,
                    bill: result.data,
                });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in createBill controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get bill by ID
     */
    public async getBill(req: AuthRequest, res: Response) {
        try {
            const billId = parseInt(req.params.id, 10);
            if (isNaN(billId)) {
                res.status(400).json({ message: 'Invalid bill ID' });
                return;
            }

            const result = await getBillByIdService(billId);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    bill: result.data,
                });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in getBill controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all bills for authenticated user
     */
    public async getUserBills(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const result = await getBillsByUserIdService(userId);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    bills: result.data,
                    count: result.data?.length || 0,
                });
            } else {
                res.status(500).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in getUserBills controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get bills by service type for authenticated user
     */
    public async getBillsByServiceType(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const serviceType = req.params.serviceType;
            if (!['electricity', 'water', 'gas'].includes(serviceType)) {
                res.status(400).json({ message: 'Invalid service type' });
                return;
            }

            const result = await getBillsByServiceTypeService(userId, serviceType);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    bills: result.data,
                    count: result.data?.length || 0,
                });
            } else {
                res.status(500).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in getBillsByServiceType controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update a bill
     */
    public async updateBill(req: AuthRequest, res: Response) {
        try {
            const billId = parseInt(req.params.id, 10);
            if (isNaN(billId)) {
                res.status(400).json({ message: 'Invalid bill ID' });
                return;
            }

            const updateData: UpdateBillDto = req.body;
            const result = await updateBillService(billId, updateData);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    bill: result.data,
                });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in updateBill controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a bill
     */
    public async deleteBill(req: AuthRequest, res: Response) {
        try {
            const billId = parseInt(req.params.id, 10);
            if (isNaN(billId)) {
                res.status(400).json({ message: 'Invalid bill ID' });
                return;
            }

            const result = await deleteBillService(billId);

            if (result.success) {
                res.status(200).json({ message: result.message });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in deleteBill controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Mark bill as paid (for future payment integration)
     */
    public async markBillAsPaid(req: AuthRequest, res: Response) {
        try {
            const billId = parseInt(req.params.id, 10);
            if (isNaN(billId)) {
                res.status(400).json({ message: 'Invalid bill ID' });
                return;
            }

            const { paymentId } = req.body;
            if (!paymentId) {
                res.status(400).json({ message: 'Payment ID is required' });
                return;
            }

            const result = await markBillAsPaidService(billId, paymentId);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    bill: result.data,
                });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in markBillAsPaid controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
