import { query } from '../db/postgres';
import { Bill, CreateBillDto, UpdateBillDto } from '../models/bill.model';

export class BillRepository {
    /**
     * Create a new bill
     */
    async create(billData: CreateBillDto): Promise<Bill> {
        const result = await query(
            `INSERT INTO bills (user_id, service_type, provider_name, consumer_number, amount, due_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                billData.userId,
                billData.serviceType,
                billData.providerName,
                billData.consumerNumber,
                billData.amount,
                billData.dueDate || null
            ]
        );

        return this.mapToBill(result.rows[0]);
    }

    /**
     * Find bill by ID
     */
    async findById(id: number): Promise<Bill | null> {
        const result = await query(
            `SELECT * FROM bills WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapToBill(result.rows[0]);
    }

    /**
     * Find all bills for a user
     */
    async findByUserId(userId: number): Promise<Bill[]> {
        const result = await query(
            `SELECT * FROM bills WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        return result.rows.map(row => this.mapToBill(row));
    }

    /**
     * Find bills by user ID and service type
     */
    async findByUserIdAndServiceType(userId: number, serviceType: string): Promise<Bill[]> {
        const result = await query(
            `SELECT * FROM bills WHERE user_id = $1 AND service_type = $2 ORDER BY created_at DESC`,
            [userId, serviceType]
        );

        return result.rows.map(row => this.mapToBill(row));
    }

    /**
     * Find bills by status
     */
    async findByStatus(status: string): Promise<Bill[]> {
        const result = await query(
            `SELECT * FROM bills WHERE status = $1 ORDER BY created_at DESC`,
            [status]
        );

        return result.rows.map(row => this.mapToBill(row));
    }

    /**
     * Update a bill
     */
    async update(id: number, updateData: UpdateBillDto): Promise<Bill | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.providerName !== undefined) {
            fields.push(`provider_name = $${paramIndex++}`);
            values.push(updateData.providerName);
        }
        if (updateData.consumerNumber !== undefined) {
            fields.push(`consumer_number = $${paramIndex++}`);
            values.push(updateData.consumerNumber);
        }
        if (updateData.amount !== undefined) {
            fields.push(`amount = $${paramIndex++}`);
            values.push(updateData.amount);
        }
        if (updateData.dueDate !== undefined) {
            fields.push(`due_date = $${paramIndex++}`);
            values.push(updateData.dueDate);
        }
        if (updateData.status !== undefined) {
            fields.push(`status = $${paramIndex++}`);
            values.push(updateData.status);
        }
        if (updateData.paymentId !== undefined) {
            fields.push(`payment_id = $${paramIndex++}`);
            values.push(updateData.paymentId);
        }
        if (updateData.paidAt !== undefined) {
            fields.push(`paid_at = $${paramIndex++}`);
            values.push(updateData.paidAt);
        }

        if (fields.length === 0) {
            const existing = await this.findById(id);
            return existing;
        }

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await query(
            `UPDATE bills SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapToBill(result.rows[0]);
    }

    /**
     * Delete a bill
     */
    async delete(id: number): Promise<boolean> {
        const result = await query(
            `DELETE FROM bills WHERE id = $1`,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Map database row to Bill model
     */
    private mapToBill(row: any): Bill {
        return {
            id: row.id,
            userId: row.user_id,
            serviceType: row.service_type,
            providerName: row.provider_name,
            consumerNumber: row.consumer_number,
            amount: parseFloat(row.amount),
            dueDate: row.due_date ? new Date(row.due_date) : undefined,
            status: row.status,
            paymentId: row.payment_id,
            paidAt: row.paid_at ? new Date(row.paid_at) : undefined,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        };
    }
}

export const billRepository = new BillRepository();
