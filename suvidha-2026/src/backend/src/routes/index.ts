import { Router } from 'express';
import HelpdeskController from '../controllers/helpdesk.controller';

const router = Router();
const helpdeskController = new HelpdeskController();

// Define routes for helpdesk operations
router.post('/tickets', helpdeskController.createTicket.bind(helpdeskController));
router.get('/tickets/:id', helpdeskController.getTicket.bind(helpdeskController));
router.put('/tickets/:id', helpdeskController.updateTicket.bind(helpdeskController));
router.delete('/tickets/:id', helpdeskController.deleteTicket.bind(helpdeskController));

export default router;