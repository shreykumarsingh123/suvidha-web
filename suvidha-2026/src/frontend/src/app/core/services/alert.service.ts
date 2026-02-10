import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Alert {
    id: number;
    alert_type: string;
    title: string;
    message: string;
    severity: string;
    service_type?: string;
    active: boolean;
    created_at: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/alerts`;

    /**
     * Get active alerts
     */
    getActiveAlerts(serviceType?: string): Observable<{ success: boolean; data: Alert[] }> {
        const options = serviceType ? { params: { serviceType } } : {};
        return this.http.get<{ success: boolean; data: Alert[] }>(
            `${this.apiUrl}/active`,
            options
        );
    }
}
