export enum ComplaintType {
    STREET_LIGHT = 'street_light',
    POTHOLE = 'pothole',
    SEWER = 'sewer',
    GARBAGE = 'garbage',
    WATER_SUPPLY = 'water_supply',
    ROAD_DAMAGE = 'road_damage',
    OTHER = 'other'
}

export interface Complaint {
    id: number;
    userId: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    complaintType?: ComplaintType;
    location?: string;
    assignedOfficerId?: number;
    notificationSent?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateComplaintDto {
    userId?: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    complaintType?: ComplaintType;
    location?: string;
}
