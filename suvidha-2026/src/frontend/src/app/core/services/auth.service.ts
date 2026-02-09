import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    currentUser = signal<any>(null);

    constructor(private http: HttpClient, private router: Router) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUser.set(JSON.parse(savedUser));
        }
    }

    requestOtp(mobileNumber: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/request-otp`, { mobileNumber });
    }

    verifyOtp(mobileNumber: string, otp: string): Observable<any> {
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

    getCurrentUser(): any {
        return this.currentUser();
    }
}
