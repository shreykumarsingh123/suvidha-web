import { Router } from 'express';
import {
    getRevenueStats,
    getAllComplaints,
    updateComplaintStatus,
    getBillDetails
} from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication
router.use(authenticateToken);

// Revenue and analytics routes
router.get('/revenue-stats', getRevenueStats);
router.get('/bills/:id/details', getBillDetails);

// Complaint management routes
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);

export default router;
