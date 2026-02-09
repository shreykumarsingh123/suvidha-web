export interface Ticket {
    ticketId: string;
    userId: string;
    status: 'open' | 'in-progress' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}