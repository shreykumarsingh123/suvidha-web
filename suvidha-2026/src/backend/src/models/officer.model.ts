export interface Officer {
    id: number;
    name: string;
    mobileNumber: string;
    role: 'officer' | 'admin';
    zone?: string;
    createdAt: Date;
}

export interface CreateOfficerDto {
    name: string;
    mobileNumber: string;
    role?: 'officer' | 'admin';
    zone?: string;
}

export interface Notification {
    id: number;
    officerId: number;
    ticketId?: number;
    message: string;
    read: boolean;
    createdAt: Date;
}

export interface CreateNotificationDto {
    officerId: number;
    ticketId?: number;
    message: string;
}
