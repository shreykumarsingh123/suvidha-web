import { billRepository } from '../repositories/bill.repository';
import { CreateBillDto, UpdateBillDto, Bill } from '../models/bill.model';
import logger from '../utils/logger';

interface ServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

/**
 * Create a new bill
 */
export async function createBillService(billData: CreateBillDto): Promise<ServiceResponse<Bill>> {
    try {
        // Validation
        if (!billData.userId || !billData.serviceType || !billData.providerName || !billData.consumerNumber || !billData.amount) {
            return {
                success: false,
                message: 'Missing required fields: userId, serviceType, providerName, consumerNumber, amount'
            };
        }

        if (billData.amount <= 0) {
            return {
                success: false,
                message: 'Bill amount must be greater than 0'
            };
        }

        if (!['electricity', 'water', 'gas'].includes(billData.serviceType)) {
            return {
                success: false,
                message: 'Invalid service type. Must be electricity, water, or gas'
            };
        }

        const bill = await billRepository.create(billData);
        logger.info(`Bill created successfully: ID ${bill.id} for user ${bill.userId}`);

        return {
            success: true,
            message: 'Bill created successfully',
            data: bill
        };
    } catch (error) {
        logger.error('Error creating bill:', error);
        return {
            success: false,
            message: 'Failed to create bill'
        };
    }
}

/**
 * Get bill by ID
 */
export async function getBillByIdService(id: number): Promise<ServiceResponse<Bill>> {
    try {
        const bill = await billRepository.findById(id);

        if (!bill) {
            return {
                success: false,
                message: 'Bill not found'
            };
        }

        return {
            success: true,
            message: 'Bill retrieved successfully',
            data: bill
        };
    } catch (error) {
        logger.error('Error retrieving bill:', error);
        return {
            success: false,
            message: 'Failed to retrieve bill'
        };
    }
}

/**
 * Get all bills for a user
 */
export async function getBillsByUserIdService(userId: number): Promise<ServiceResponse<Bill[]>> {
    try {
        const bills = await billRepository.findByUserId(userId);

        return {
            success: true,
            message: `Retrieved ${bills.length} bills`,
            data: bills
        };
    } catch (error) {
        logger.error('Error retrieving user bills:', error);
        return {
            success: false,
            message: 'Failed to retrieve bills'
        };
    }
}

/**
 * Get bills by user ID and service type
 */
export async function getBillsByServiceTypeService(userId: number, serviceType: string): Promise<ServiceResponse<Bill[]>> {
    try {
        if (!['electricity', 'water', 'gas'].includes(serviceType)) {
            return {
                success: false,
                message: 'Invalid service type'
            };
        }

        const bills = await billRepository.findByUserIdAndServiceType(userId, serviceType);

        return {
            success: true,
            message: `Retrieved ${bills.length} ${serviceType} bills`,
            data: bills
        };
    } catch (error) {
        logger.error('Error retrieving bills by service type:', error);
        return {
            success: false,
            message: 'Failed to retrieve bills'
        };
    }
}

/**
 * Update a bill
 */
export async function updateBillService(id: number, updateData: UpdateBillDto): Promise<ServiceResponse<Bill>> {
    try {
        const bill = await billRepository.update(id, updateData);

        if (!bill) {
            return {
                success: false,
                message: 'Bill not found'
            };
        }

        logger.info(`Bill updated successfully: ID ${id}`);

        return {
            success: true,
            message: 'Bill updated successfully',
            data: bill
        };
    } catch (error) {
        logger.error('Error updating bill:', error);
        return {
            success: false,
            message: 'Failed to update bill'
        };
    }
}

/**
 * Delete a bill
 */
export async function deleteBillService(id: number): Promise<ServiceResponse<null>> {
    try {
        const deleted = await billRepository.delete(id);

        if (!deleted) {
            return {
                success: false,
                message: 'Bill not found'
            };
        }

        logger.info(`Bill deleted successfully: ID ${id}`);

        return {
            success: true,
            message: 'Bill deleted successfully'
        };
    } catch (error) {
        logger.error('Error deleting bill:', error);
        return {
            success: false,
            message: 'Failed to delete bill'
        };
    }
}

/**
 * Mark bill as paid
 */
export async function markBillAsPaidService(id: number, paymentId: string): Promise<ServiceResponse<Bill>> {
    try {
        const bill = await billRepository.update(id, {
            status: 'paid',
            paymentId: paymentId,
            paidAt: new Date()
        });

        if (!bill) {
            return {
                success: false,
                message: 'Bill not found'
            };
        }

        logger.info(`Bill marked as paid: ID ${id}, Payment ID ${paymentId}`);

        return {
            success: true,
            message: 'Bill marked as paid successfully',
            data: bill
        };
    } catch (error) {
        logger.error('Error marking bill as paid:', error);
        return {
            success: false,
            message: 'Failed to mark bill as paid'
        };
    }
}
