import { query } from '../db/postgres';
import { Notification, CreateNotificationDto } from '../models/officer.model';

export class NotificationRepository {
    /**
     * Create a new notification
     */
    async create(notificationData: CreateNotificationDto): Promise<Notification> {
        const result = await query(
            `INSERT INTO notifications (officer_id, ticket_id, message)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                notificationData.officerId,
                notificationData.ticketId || null,
                notificationData.message
            ]
        );

        return this.mapToNotification(result.rows[0]);
    }

    /**
     * Find notification by ID
     */
    async findById(id: number): Promise<Notification | null> {
        const result = await query(
            `SELECT * FROM notifications WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapToNotification(result.rows[0]);
    }

    /**
     * Find all notifications for an officer
     */
    async findByOfficerId(officerId: number): Promise<Notification[]> {
        const result = await query(
            `SELECT * FROM notifications WHERE officer_id = $1 ORDER BY created_at DESC`,
            [officerId]
        );

        return result.rows.map(row => this.mapToNotification(row));
    }

    /**
     * Find unread notifications for an officer
     */
    async findUnreadByOfficerId(officerId: number): Promise<Notification[]> {
        const result = await query(
            `SELECT * FROM notifications WHERE officer_id = $1 AND read = FALSE ORDER BY created_at DESC`,
            [officerId]
        );

        return result.rows.map(row => this.mapToNotification(row));
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: number): Promise<Notification | null> {
        const result = await query(
            `UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapToNotification(result.rows[0]);
    }

    /**
     * Mark all notifications as read for an officer
     */
    async markAllAsRead(officerId: number): Promise<number> {
        const result = await query(
            `UPDATE notifications SET read = TRUE WHERE officer_id = $1 AND read = FALSE`,
            [officerId]
        );

        return result.rowCount || 0;
    }

    /**
     * Map database row to Notification model
     */
    private mapToNotification(row: any): Notification {
        return {
            id: row.id,
            officerId: row.officer_id,
            ticketId: row.ticket_id,
            message: row.message,
            read: row.read,
            createdAt: new Date(row.created_at)
        };
    }
}

export const notificationRepository = new NotificationRepository();
