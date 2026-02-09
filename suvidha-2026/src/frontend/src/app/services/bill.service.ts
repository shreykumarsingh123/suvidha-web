import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bill, CreateBillDto } from '../models/bill.model';

@Injectable({
    providedIn: 'root'
})
export class BillService {
    private apiUrl = `${environment.apiUrl}/bills`;

    constructor(private http: HttpClient) { }

    /**
     * Get all bills for the authenticated user
     */
    getUserBills(): Observable<{ message: string; bills: Bill[]; count: number }> {
        return this.http.get<{ message: string; bills: Bill[]; count: number }>(this.apiUrl);
    }

    /**
     * Get bills by service type
     */
    getBillsByServiceType(serviceType: string): Observable<{ message: string; bills: Bill[]; count: number }> {
        return this.http.get<{ message: string; bills: Bill[]; count: number }>(`${this.apiUrl}/service/${serviceType}`);
    }

    /**
     * Get bill by ID
     */
    getBillById(id: number): Observable<{ message: string; bill: Bill }> {
        return this.http.get<{ message: string; bill: Bill }>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create a new bill
     */
    createBill(billData: CreateBillDto): Observable<{ message: string; bill: Bill }> {
        return this.http.post<{ message: string; bill: Bill }>(this.apiUrl, billData);
    }

    /**
     * Update a bill
     */
    updateBill(id: number, billData: Partial<Bill>): Observable<{ message: string; bill: Bill }> {
        return this.http.put<{ message: string; bill: Bill }>(`${this.apiUrl}/${id}`, billData);
    }

    /**
     * Delete a bill
     */
    deleteBill(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }

    /**
     * Mark bill as paid
     */
    markBillAsPaid(id: number, paymentId: string): Observable<{ message: string; bill: Bill }> {
        return this.http.post<{ message: string; bill: Bill }>(`${this.apiUrl}/${id}/pay`, { paymentId });
    }
}
