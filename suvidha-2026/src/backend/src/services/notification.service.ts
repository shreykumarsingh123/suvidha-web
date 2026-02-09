import { notificationRepository } from '../repositories/notification.repository';
import { officerRepository } from '../repositories/officer.repository';
import { CreateNotificationDto, Notification } from '../models/officer.model';
import logger from '../utils/logger';

interface ServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

/**
 * Create a notification for an officer
 */
export async function createNotificationService(notificationData: CreateNotificationDto): Promise<ServiceResponse<Notification>> {
    try {
        // Verify officer exists
        const officer = await officerRepository.findById(notificationData.officerId);
        if (!officer) {
            return {
                success: false,
                message: 'Officer not found'
            };
        }

        const notification = await notificationRepository.create(notificationData);
        logger.info(`Notification created for officer ${notificationData.officerId}`);

        return {
            success: true,
            message: 'Notification created successfully',
            data: notification
        };
    } catch (error) {
        logger.error('Error creating notification:', error);
        return {
            success: false,
            message: 'Failed to create notification'
        };
    }
}

/**
 * Get all notifications for an officer
 */
export async function getOfficerNotificationsService(officerId: number): Promise<ServiceResponse<Notification[]>> {
    try {
        const notifications = await notificationRepository.findByOfficerId(officerId);

        return {
            success: true,
            message: `Retrieved ${notifications.length} notifications`,
            data: notifications
        };
    } catch (error) {
        logger.error('Error retrieving notifications:', error);
        return {
            success: false,
            message: 'Failed to retrieve notifications'
        };
    }
}

/**
 * Get unread notifications for an officer
 */
export async function getUnreadNotificationsService(officerId: number): Promise<ServiceResponse<Notification[]>> {
    try {
        const notifications = await notificationRepository.findUnreadByOfficerId(officerId);

        return {
            success: true,
            message: `Retrieved ${notifications.length} unread notifications`,
            data: notifications
        };
    } catch (error) {
        logger.error('Error retrieving unread notifications:', error);
        return {
            success: false,
            message: 'Failed to retrieve unread notifications'
        };
    }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsReadService(id: number): Promise<ServiceResponse<Notification>> {
    try {
        const notification = await notificationRepository.markAsRead(id);

        if (!notification) {
            return {
                success: false,
                message: 'Notification not found'
            };
        }

        return {
            success: true,
            message: 'Notification marked as read',
            data: notification
        };
    } catch (error) {
        logger.error('Error marking notification as read:', error);
        return {
            success: false,
            message: 'Failed to mark notification as read'
        };
    }
}

/**
 * Mark all notifications as read for an officer
 */
export async function markAllNotificationsAsReadService(officerId: number): Promise<ServiceResponse<number>> {
    try {
        const count = await notificationRepository.markAllAsRead(officerId);

        return {
            success: true,
            message: `Marked ${count} notifications as read`,
            data: count
        };
    } catch (error) {
        logger.error('Error marking all notifications as read:', error);
        return {
            success: false,
            message: 'Failed to mark notifications as read'
        };
    }
}
