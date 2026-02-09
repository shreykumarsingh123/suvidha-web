import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
    createTicketService,
    getTicketByIdService,
    getAllTicketsService,
    getTicketsByUserIdService,
    updateTicketService,
    deleteTicketService,
} from '../services/ticket.service';
import { CreateTicketDto, UpdateTicketDto } from '../models/ticket.model';
import logger from '../utils/logger';

export class HelpdeskController {
    // Method to create a new ticket
    public async createTicket(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const ticketData: CreateTicketDto = {
                ...req.body,
                userId,
            };

            const result = await createTicketService(ticketData);

            if (result.success) {
                res.status(201).json({
                    message: result.message,
                    ticket: result.data,
                });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in createTicket controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Method to get a specific ticket
    public async getTicket(req: AuthRequest, res: Response) {
        try {
            const ticketId = parseInt(req.params.id, 10);
            if (isNaN(ticketId)) {
                res.status(400).json({ message: 'Invalid ticket ID' });
                return;
            }

            const result = await getTicketByIdService(ticketId);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    ticket: result.data,
                });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in getTicket controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Method to get all tickets
    public async getAllTickets(req: AuthRequest, res: Response) {
        try {
            const result = await getAllTicketsService();

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    tickets: result.data,
                    count: result.data?.length || 0,
                });
            } else {
                res.status(500).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in getAllTickets controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Method to get tickets by user ID
    public async getTicketsByUserId(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                res.status(400).json({ message: 'Invalid user ID' });
                return;
            }

            const result = await getTicketsByUserIdService(userId);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    tickets: result.data,
                    count: result.data?.length || 0,
                });
            } else {
                res.status(500).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in getTicketsByUserId controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Method to update a ticket
    public async updateTicket(req: AuthRequest, res: Response) {
        try {
            const ticketId = parseInt(req.params.id, 10);
            if (isNaN(ticketId)) {
                res.status(400).json({ message: 'Invalid ticket ID' });
                return;
            }

            const updateData: UpdateTicketDto = req.body;
            const result = await updateTicketService(ticketId, updateData);

            if (result.success) {
                res.status(200).json({
                    message: result.message,
                    ticket: result.data,
                });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in updateTicket controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Method to delete a ticket
    public async deleteTicket(req: AuthRequest, res: Response) {
        try {
            const ticketId = parseInt(req.params.id, 10);
            if (isNaN(ticketId)) {
                res.status(400).json({ message: 'Invalid ticket ID' });
                return;
            }

            const result = await deleteTicketService(ticketId);

            if (result.success) {
                res.status(200).json({ message: result.message });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            logger.error('Error in deleteTicket controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}