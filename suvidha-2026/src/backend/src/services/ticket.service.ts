import logger from '../utils/logger';
import {
    createTicket as createTicketRepo,
    findTicketById,
    findAllTickets,
    findTicketsByUserId,
    updateTicket as updateTicketRepo,
    deleteTicket as deleteTicketRepo,
} from '../repositories/ticket.repository';
import { CreateTicketDto, UpdateTicketDto, Ticket, TicketCategory } from '../models/ticket.model';
import { officerRepository } from '../repositories/officer.repository';
import { createNotificationService } from './notification.service';
import { pool } from '../db/postgres';

interface ServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

/**
 * Validate ticket creation data
 */
const validateCreateTicket = (ticketData: CreateTicketDto): string | null => {
    if (!ticketData.title || ticketData.title.trim().length === 0) {
        return 'Title is required';
    }
    if (ticketData.title.length > 200) {
        return 'Title must be less than 200 characters';
    }
    if (!ticketData.description || ticketData.description.trim().length === 0) {
        return 'Description is required';
    }
    if (ticketData.description.length > 2000) {
        return 'Description must be less than 2000 characters';
    }
    if (!ticketData.category) {
        return 'Category is required';
    }
    if (!ticketData.priority) {
        return 'Priority is required';
    }
    if (!ticketData.userId) {
        return 'User ID is required';
    }
    return null;
};

/**
 * Create a new ticket
 */
export const createTicketService = async (
    ticketData: CreateTicketDto
): Promise<ServiceResponse<Ticket>> => {
    try {
        const validationError = validateCreateTicket(ticketData);
        if (validationError) {
            return {
                success: false,
                message: validationError,
            };
        }

        const ticket = await createTicketRepo(ticketData);
        logger.info(`Ticket created successfully: ${ticket.id}`);

        // If this is a municipal complaint, notify officers
        if (ticket.category === TicketCategory.MUNICIPAL && ticket.complaintType) {
            try {
                // Get all officers (in a real system, you might filter by zone)
                const officers = await officerRepository.findAll();

                // Create notifications for all officers
                for (const officer of officers) {
                    await createNotificationService({
                        officerId: officer.id,
                        ticketId: ticket.id,
                        message: `New municipal complaint: ${ticket.complaintType} - ${ticket.title}${ticket.location ? ` at ${ticket.location}` : ''}`
                    });
                }

                logger.info(`Created notifications for ${officers.length} officers for ticket ${ticket.id}`);
            } catch (notificationError) {
                // Log error but don't fail the ticket creation
                logger.error('Error creating officer notifications:', notificationError);
            }
        }

        return {
            success: true,
            message: 'Ticket created successfully',
            data: ticket,
        };
    } catch (error) {
        logger.error('Error in createTicketService:', error);
        return {
            success: false,
            message: 'Failed to create ticket',
        };
    }
};

/**
 * Get a ticket by ID
 */
export const getTicketByIdService = async (
    id: number
): Promise<ServiceResponse<Ticket>> => {
    try {
        const ticket = await findTicketById(id);
        if (!ticket) {
            return {
                success: false,
                message: 'Ticket not found',
            };
        }

        return {
            success: true,
            message: 'Ticket retrieved successfully',
            data: ticket,
        };
    } catch (error) {
        logger.error('Error in getTicketByIdService:', error);
        return {
            success: false,
            message: 'Failed to retrieve ticket',
        };
    }
};

// Service to get all tickets (PUBLIC - with user's tickets first if userId provided)
export async function getAllTicketsService(userId?: number | null): Promise<ServiceResponse<Ticket[]>> {
    try {
        let query = `
            SELECT 
                t.*,
                u.username as user_name,
                u.mobile_number as user_mobile
            FROM tickets t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY 
                ${userId ? `CASE WHEN t.user_id = $1 THEN 0 ELSE 1 END,` : ''}
                t.created_at DESC
        `;

        const params = userId ? [userId] : [];
        const result = await pool.query(query, params);

        return {
            success: true,
            message: 'Tickets retrieved successfully',
            data: result.rows,
        };
    } catch (error) {
        logger.error('Error in getAllTicketsService:', error);
        return {
            success: false,
            message: 'Failed to retrieve tickets',
        };
    }
}

/**
 * Get tickets by user ID
 */
export const getTicketsByUserIdService = async (
    userId: number
): Promise<ServiceResponse<Ticket[]>> => {
    try {
        const tickets = await findTicketsByUserId(userId);

        return {
            success: true,
            message: 'User tickets retrieved successfully',
            data: tickets,
        };
    } catch (error) {
        logger.error('Error in getTicketsByUserIdService:', error);
        return {
            success: false,
            message: 'Failed to retrieve user tickets',
        };
    }
};

/**
 * Update a ticket
 */
export const updateTicketService = async (
    id: number,
    updateData: UpdateTicketDto
): Promise<ServiceResponse<Ticket>> => {
    try {
        if (Object.keys(updateData).length === 0) {
            return {
                success: false,
                message: 'No update data provided',
            };
        }

        const ticket = await updateTicketRepo(id, updateData);
        if (!ticket) {
            return {
                success: false,
                message: 'Ticket not found',
            };
        }

        logger.info(`Ticket updated successfully: ${id}`);

        return {
            success: true,
            message: 'Ticket updated successfully',
            data: ticket,
        };
    } catch (error) {
        logger.error('Error in updateTicketService:', error);
        return {
            success: false,
            message: 'Failed to update ticket',
        };
    }
};

/**
 * Delete a ticket
 */
export const deleteTicketService = async (
    id: number
): Promise<ServiceResponse<null>> => {
    try {
        const deleted = await deleteTicketRepo(id);
        if (!deleted) {
            return {
                success: false,
                message: 'Ticket not found',
            };
        }

        logger.info(`Ticket deleted successfully: ${id}`);

        return {
            success: true,
            message: 'Ticket deleted successfully',
        };
    } catch (error) {
        logger.error('Error in deleteTicketService:', error);
        return {
            success: false,
            message: 'Failed to delete ticket',
        };
    }
};
