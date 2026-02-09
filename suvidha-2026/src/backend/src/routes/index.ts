import { Router } from 'express';
import { HelpdeskController } from '../controllers/helpdesk.controller';
import { BillController } from '../controllers/bill.controller';
import { UserController } from '../controllers/user.controller';
import authRoutes from './auth.routes';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const helpdeskController = new HelpdeskController();
const billController = new BillController();
const userController = new UserController();

// Auth Routes (no authentication required)
router.use('/auth', authRoutes);

// User Profile Routes
router.get('/users/profile/:mobileNumber', userController.getUserProfile.bind(userController));
router.get('/users/me', authenticateToken, userController.getCurrentUser.bind(userController));
router.put('/users/profile', authenticateToken, userController.updateUserProfile.bind(userController));

// Bill Routes (authentication required)
router.get('/bills', authenticateToken, billController.getUserBills.bind(billController));
router.get('/bills/service/:serviceType', authenticateToken, billController.getBillsByServiceType.bind(billController));
router.post('/bills', authenticateToken, billController.createBill.bind(billController));
router.get('/bills/:id', authenticateToken, billController.getBill.bind(billController));
router.put('/bills/:id', authenticateToken, billController.updateBill.bind(billController));
router.delete('/bills/:id', authenticateToken, billController.deleteBill.bind(billController));
router.post('/bills/:id/pay', authenticateToken, billController.markBillAsPaid.bind(billController));

// Ticket Routes (authentication required)
router.get('/tickets', authenticateToken, helpdeskController.getAllTickets.bind(helpdeskController));
router.get('/tickets/user/:userId', authenticateToken, helpdeskController.getTicketsByUserId.bind(helpdeskController));
router.post('/tickets', authenticateToken, helpdeskController.createTicket.bind(helpdeskController));
router.get('/tickets/:id', authenticateToken, helpdeskController.getTicket.bind(helpdeskController));
router.put('/tickets/:id', authenticateToken, helpdeskController.updateTicket.bind(helpdeskController));
router.delete('/tickets/:id', authenticateToken, helpdeskController.deleteTicket.bind(helpdeskController));

export default router;