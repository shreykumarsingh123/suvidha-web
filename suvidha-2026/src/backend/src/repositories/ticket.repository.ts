import { query } from '../db/postgres';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketStatus } from '../models/ticket.model';

export interface TicketRecord {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    user_id: number;
    complaint_type?: string;
    location?: string;
    assigned_officer_id?: number;
    notification_sent?: boolean;
    created_at: Date;
    updated_at: Date;
}

const mapRecordToTicket = (record: TicketRecord): Ticket => ({
    id: record.id,
    title: record.title,
    description: record.description,
    category: record.category as any,
    priority: record.priority as any,
    status: record.status as any,
    userId: record.user_id,
    complaintType: record.complaint_type as any,
    location: record.location,
    assignedOfficerId: record.assigned_officer_id,
    notificationSent: record.notification_sent,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
});

export const createTicket = async (ticketData: CreateTicketDto): Promise<Ticket> => {
    const result = await query<TicketRecord>(
        `INSERT INTO tickets (title, description, category, priority, status, user_id, complaint_type, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
            ticketData.title,
            ticketData.description,
            ticketData.category,
            ticketData.priority,
            TicketStatus.OPEN,
            ticketData.userId,
            ticketData.complaintType || null,
            ticketData.location || null,
        ]
    );

    return mapRecordToTicket(result.rows[0]);
};

export const findTicketById = async (id: number): Promise<Ticket | null> => {
    const result = await query<TicketRecord>(
        'SELECT * FROM tickets WHERE id = $1',
        [id]
    );

    return result.rows.length > 0 ? mapRecordToTicket(result.rows[0]) : null;
};

export const findAllTickets = async (): Promise<Ticket[]> => {
    const result = await query<TicketRecord>(
        'SELECT * FROM tickets ORDER BY created_at DESC'
    );

    return result.rows.map(mapRecordToTicket);
};

export const findTicketsByUserId = async (userId: number): Promise<Ticket[]> => {
    const result = await query<TicketRecord>(
        'SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );

    return result.rows.map(mapRecordToTicket);
};

export const findTicketsByStatus = async (status: TicketStatus): Promise<Ticket[]> => {
    const result = await query<TicketRecord>(
        'SELECT * FROM tickets WHERE status = $1 ORDER BY created_at DESC',
        [status]
    );

    return result.rows.map(mapRecordToTicket);
};

export const updateTicket = async (
    id: number,
    updateData: UpdateTicketDto
): Promise<Ticket | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.title !== undefined) {
        fields.push(`title = $${paramIndex++}`);
        values.push(updateData.title);
    }
    if (updateData.description !== undefined) {
        fields.push(`description = $${paramIndex++}`);
        values.push(updateData.description);
    }
    if (updateData.category !== undefined) {
        fields.push(`category = $${paramIndex++}`);
        values.push(updateData.category);
    }
    if (updateData.priority !== undefined) {
        fields.push(`priority = $${paramIndex++}`);
        values.push(updateData.priority);
    }
    if (updateData.status !== undefined) {
        fields.push(`status = $${paramIndex++}`);
        values.push(updateData.status);
    }
    if (updateData.complaintType !== undefined) {
        fields.push(`complaint_type = $${paramIndex++}`);
        values.push(updateData.complaintType);
    }
    if (updateData.location !== undefined) {
        fields.push(`location = $${paramIndex++}`);
        values.push(updateData.location);
    }
    if (updateData.assignedOfficerId !== undefined) {
        fields.push(`assigned_officer_id = $${paramIndex++}`);
        values.push(updateData.assignedOfficerId);
    }
    if (updateData.notificationSent !== undefined) {
        fields.push(`notification_sent = $${paramIndex++}`);
        values.push(updateData.notificationSent);
    }

    if (fields.length === 0) {
        return findTicketById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query<TicketRecord>(
        `UPDATE tickets SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
    );

    return result.rows.length > 0 ? mapRecordToTicket(result.rows[0]) : null;
};

export const deleteTicket = async (id: number): Promise<boolean> => {
    const result = await query<TicketRecord>(
        'DELETE FROM tickets WHERE id = $1 RETURNING *',
        [id]
    );

    return result.rows.length > 0;
};
