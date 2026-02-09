import { Router } from 'express';
import { HelpdeskController } from '../controllers/helpdesk.controller';
import authRoutes from './auth.routes';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const helpdeskController = new HelpdeskController();

// Auth Routes (no authentication required)
router.use('/auth', authRoutes);

// Ticket Routes (authentication required)
router.get('/tickets', authenticateToken, helpdeskController.getAllTickets.bind(helpdeskController));
router.get('/tickets/user/:userId', authenticateToken, helpdeskController.getTicketsByUserId.bind(helpdeskController));
router.post('/tickets', authenticateToken, helpdeskController.createTicket.bind(helpdeskController));
router.get('/tickets/:id', authenticateToken, helpdeskController.getTicket.bind(helpdeskController));
router.put('/tickets/:id', authenticateToken, helpdeskController.updateTicket.bind(helpdeskController));
router.delete('/tickets/:id', authenticateToken, helpdeskController.deleteTicket.bind(helpdeskController));

export default router;