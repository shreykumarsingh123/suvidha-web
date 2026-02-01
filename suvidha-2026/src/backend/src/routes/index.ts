import { Router } from 'express';
import HelpdeskController from '../controllers/helpdesk.controller';
import authRoutes from './auth.routes';

const router = Router();
const helpdeskController = new HelpdeskController();

// Auth Routes
router.use('/auth', authRoutes);

// Define routes for helpdesk operations
router.post('/tickets', helpdeskController.createTicket.bind(helpdeskController));
router.get('/tickets/:id', helpdeskController.getTicket.bind(helpdeskController));
router.put('/tickets/:id', helpdeskController.updateTicket.bind(helpdeskController));
router.delete('/tickets/:id', helpdeskController.deleteTicket.bind(helpdeskController));

export default router;