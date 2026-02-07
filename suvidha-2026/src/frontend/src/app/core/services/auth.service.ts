import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, of, delay, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    currentUser = signal<any>(null);
    
    // Demo mode flag (set to true for testing without backend)
    private demoMode = true;

    constructor(private http: HttpClient, private router: Router) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUser.set(JSON.parse(savedUser));
        }
    }

    requestOtp(mobileNumber: string): Observable<any> {
        if (this.demoMode) {
            // Demo mode - simulate OTP request
            console.log('Demo: OTP request for', mobileNumber);
            return of({ success: true, message: 'OTP sent (Demo)' }).pipe(delay(500));
        }
        return this.http.post(`${this.apiUrl}/request-otp`, { mobileNumber });
    }

    verifyOtp(mobileNumber: string, otp: string): Observable<any> {
        if (this.demoMode) {
            // Demo mode - accept any 4-digit OTP
            console.log('Demo: OTP verification for', mobileNumber, otp);
            const demoUser = {
                id: '1',
                name: 'Arjun Sharma',
                mobile: mobileNumber
            };
            
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(demoUser));
            this.currentUser.set(demoUser);
            
            return of({ success: true, token: 'demo-token', user: demoUser }).pipe(delay(500));
        }
        
        return this.http.post(`${this.apiUrl}/verify-otp`, { mobileNumber, otp }).pipe(
            tap((response: any) => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    this.currentUser.set(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/welcome']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}

