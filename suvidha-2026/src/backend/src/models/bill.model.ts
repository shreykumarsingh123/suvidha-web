export interface Bill {
    id: number;
    userId: number;
    serviceType: 'electricity' | 'water' | 'gas';
    providerName: string;
    consumerNumber: string;
    amount: number;
    dueDate?: Date;
    status: 'unpaid' | 'paid';
    paymentId?: string;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBillDto {
    userId: number;
    serviceType: 'electricity' | 'water' | 'gas';
    providerName: string;
    consumerNumber: string;
    amount: number;
    dueDate?: Date;
}

export interface UpdateBillDto {
    providerName?: string;
    consumerNumber?: string;
    amount?: number;
    dueDate?: Date;
    status?: 'unpaid' | 'paid';
    paymentId?: string;
    paidAt?: Date;
}
