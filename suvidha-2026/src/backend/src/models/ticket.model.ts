export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in-progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export enum TicketCategory {
    BILLING = 'billing',
    TECHNICAL = 'technical',
    GENERAL = 'general',
    COMPLAINT = 'complaint',
    REQUEST = 'request',
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTicketDto {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    userId: number;
}

export interface UpdateTicketDto {
    title?: string;
    description?: string;
    category?: TicketCategory;
    priority?: TicketPriority;
    status?: TicketStatus;
}