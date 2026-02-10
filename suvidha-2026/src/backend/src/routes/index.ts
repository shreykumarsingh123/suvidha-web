import { Router } from 'express';
import { HelpdeskController } from '../controllers/helpdesk.controller';
import { BillController } from '../controllers/bill.controller';
import { UserController } from '../controllers/user.controller';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import paymentRoutes from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const helpdeskController = new HelpdeskController();
const billController = new BillController();
const userController = new UserController();

// Auth Routes (no authentication required)
router.use('/auth', authRoutes);

// Admin Routes (authentication required)
router.use('/admin', adminRoutes);

// Payment Routes
router.use('/payments', paymentRoutes);

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

// Ticket Routes (PUBLIC - no authentication required for complaints)
router.get('/tickets', helpdeskController.getAllTickets.bind(helpdeskController));
router.post('/tickets', helpdeskController.createTicket.bind(helpdeskController));
router.get('/tickets/:id', helpdeskController.getTicket.bind(helpdeskController));

// Authenticated ticket routes
router.get('/tickets/user/:userId', authenticateToken, helpdeskController.getTicketsByUserId.bind(helpdeskController));
router.put('/tickets/:id', authenticateToken, helpdeskController.updateTicket.bind(helpdeskController));
router.delete('/tickets/:id', authenticateToken, helpdeskController.deleteTicket.bind(helpdeskController));

export default router;