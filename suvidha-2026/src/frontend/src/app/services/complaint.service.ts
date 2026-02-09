import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Complaint, CreateComplaintDto } from '../models/complaint.model';

@Injectable({
    providedIn: 'root'
})
export class ComplaintService {
    private apiUrl = `${environment.apiUrl}/tickets`;

    constructor(private http: HttpClient) { }

    /**
     * Get all complaints/tickets
     */
    getAllComplaints(): Observable<{ message: string; tickets: Complaint[] }> {
        return this.http.get<{ message: string; tickets: Complaint[] }>(this.apiUrl);
    }

    /**
     * Get complaints for a specific user
     */
    getUserComplaints(userId: number): Observable<{ message: string; tickets: Complaint[] }> {
        return this.http.get<{ message: string; tickets: Complaint[] }>(`${this.apiUrl}/user/${userId}`);
    }

    /**
     * Get complaint by ID
     */
    getComplaintById(id: number): Observable<{ message: string; ticket: Complaint }> {
        return this.http.get<{ message: string; ticket: Complaint }>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create a new complaint
     */
    createComplaint(complaintData: CreateComplaintDto): Observable<{ message: string; ticket: Complaint }> {
        return this.http.post<{ message: string; ticket: Complaint }>(this.apiUrl, complaintData);
    }

    /**
     * Update a complaint
     */
    updateComplaint(id: number, complaintData: Partial<Complaint>): Observable<{ message: string; ticket: Complaint }> {
        return this.http.put<{ message: string; ticket: Complaint }>(`${this.apiUrl}/${id}`, complaintData);
    }

    /**
     * Delete a complaint
     */
    deleteComplaint(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
