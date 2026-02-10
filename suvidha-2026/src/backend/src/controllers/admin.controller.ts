import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { pool } from '../db/postgres';
import logger from '../utils/logger';

/**
 * Get comprehensive revenue statistics with detailed bill information
 */
export const getRevenueStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Get total revenue and category breakdown
        const revenueQuery = `
            SELECT 
                COUNT(*) as total_bills,
                SUM(amount) as total_revenue,
                service_type,
                COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
                SUM(amount) FILTER (WHERE status = 'paid') as paid_amount,
                COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
                SUM(amount) FILTER (WHERE status = 'pending') as pending_amount
            FROM bills
            GROUP BY service_type
        `;

        const revenueResult = await pool.query(revenueQuery);

        // Get detailed bill list with all information
        const detailedBillsQuery = `
            SELECT 
                b.id,
                b.user_id,
                u.mobile_number,
                u.username as user_name,
                b.service_type,
                b.amount,
                b.status as payment_status,
                b.bill_number,
                b.due_date,
                b.created_at,
                b.updated_at,
                b.paid_at,
                p.transaction_id,
                p.payment_method,
                p.payment_gateway_response,
                p.status as payment_gateway_status
            FROM bills b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN payments p ON b.id = p.bill_id
            ORDER BY b.created_at DESC
            LIMIT 100
        `;

        const detailedBills = await pool.query(detailedBillsQuery);

        // Calculate category-wise statistics
        const byCategory: any = {};
        let totalRevenue = 0;
        let totalBills = 0;

        revenueResult.rows.forEach((row: any) => {
            const category = row.service_type || 'other';
            byCategory[category] = {
                totalBills: parseInt(row.total_bills),
                totalRevenue: parseFloat(row.total_revenue) || 0,
                paidBills: parseInt(row.paid_count),
                paidAmount: parseFloat(row.paid_amount) || 0,
                pendingBills: parseInt(row.pending_count),
                pendingAmount: parseFloat(row.pending_amount) || 0
            };
            totalRevenue += parseFloat(row.paid_amount) || 0;
            totalBills += parseInt(row.paid_count);
        });

        // Get monthly trend (last 6 months)
        const monthlyTrendQuery = `
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                service_type,
                COUNT(*) as bill_count,
                SUM(amount) FILTER (WHERE status = 'paid') as revenue
            FROM bills
            WHERE created_at >= NOW() - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', created_at), service_type
            ORDER BY month DESC
        `;

        const monthlyTrend = await pool.query(monthlyTrendQuery);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalRevenue,
                    totalBills,
                    byCategory
                },
                detailedBills: detailedBills.rows,
                monthlyTrend: monthlyTrend.rows
            }
        });
    } catch (error) {
        logger.error('Error fetching revenue stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue statistics'
        });
    }
};

/**
 * Get all complaints for admin with detailed information
 */
export const getAllComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, type, search } = req.query;

        let query = `
            SELECT 
                t.id,
                t.user_id,
                u.mobile_number,
                u.username as user_name,
                t.title,
                t.description,
                t.category,
                t.priority,
                t.status,
                t.complaint_type,
                t.location,
                t.assigned_officer_id,
                o.name as assigned_officer_name,
                t.created_at,
                t.updated_at,
                t.resolved_at
            FROM tickets t
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN officers o ON t.assigned_officer_id = o.id
            WHERE 1=1
        `;

        const params: any[] = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND t.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (type) {
            query += ` AND t.complaint_type = $${paramIndex}`;
            params.push(type);
            paramIndex++;
        }

        if (search) {
            query += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY t.created_at DESC`;

        const result = await pool.query(query, params);

        // Get complaint statistics
        const statsQuery = `
            SELECT 
                status,
                COUNT(*) as count
            FROM tickets
            GROUP BY status
        `;
        const stats = await pool.query(statsQuery);

        res.status(200).json({
            success: true,
            data: {
                complaints: result.rows,
                statistics: stats.rows
            }
        });
    } catch (error) {
        logger.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch complaints'
        });
    }
};

/**
 * Update complaint status
 */
export const updateComplaintStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, assignedOfficerId, notes } = req.body;

        const validStatuses = ['submitted', 'under_review', 'in_progress', 'assigned', 'resolved', 'rejected'];

        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
            return;
        }

        let query = `
            UPDATE tickets 
            SET status = $1, updated_at = NOW()
        `;
        const params: any[] = [status];
        let paramIndex = 2;

        if (assignedOfficerId) {
            query += `, assigned_officer_id = $${paramIndex}`;
            params.push(assignedOfficerId);
            paramIndex++;
        }

        if (status === 'resolved') {
            query += `, resolved_at = NOW()`;
        }

        query += ` WHERE id = $${paramIndex} RETURNING *`;
        params.push(id);

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
            return;
        }

        logger.info(`Complaint ${id} status updated to ${status}`);

        res.status(200).json({
            success: true,
            message: 'Complaint status updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        logger.error('Error updating complaint status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update complaint status'
        });
    }
};

/**
 * Get detailed bill information by ID
 */
export const getBillDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                b.*,
                u.mobile_number,
                u.username as user_name,
                u.email as user_email,
                p.transaction_id,
                p.payment_method,
                p.payment_gateway_response,
                p.status as payment_status,
                p.created_at as payment_created_at,
                p.updated_at as payment_updated_at
            FROM bills b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN payments p ON b.id = p.bill_id
            WHERE b.id = $1
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        logger.error('Error fetching bill details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bill details'
        });
    }
};
