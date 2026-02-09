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
    MUNICIPAL = 'municipal'
}

export enum ComplaintType {
    STREET_LIGHT = 'street_light',
    POTHOLE = 'pothole',
    SEWER = 'sewer',
    GARBAGE = 'garbage',
    WATER_SUPPLY = 'water_supply',
    ROAD_DAMAGE = 'road_damage',
    OTHER = 'other'
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    userId: number;
    complaintType?: ComplaintType;
    location?: string;
    assignedOfficerId?: number;
    notificationSent?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTicketDto {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    userId: number;
    complaintType?: ComplaintType;
    location?: string;
}

export interface UpdateTicketDto {
    title?: string;
    description?: string;
    category?: TicketCategory;
    priority?: TicketPriority;
    status?: TicketStatus;
    complaintType?: ComplaintType;
    location?: string;
    assignedOfficerId?: number;
    notificationSent?: boolean;
}