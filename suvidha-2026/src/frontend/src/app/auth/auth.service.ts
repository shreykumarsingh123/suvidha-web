import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface VerifyResponse {
  accessToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'suvidha_token';
  private token: string | null = sessionStorage.getItem(this.tokenKey);
  isAuthenticated$ = new BehaviorSubject<boolean>(!!this.token);

  constructor(private http: HttpClient) {}

  // Request OTP from backend (expected: POST /auth/request-otp { mobile })
  requestOtp(mobile: string): Observable<void> {
    if (!mobile) return of(void 0);
    return this.http.post<void>(`${environment.apiUrl}/auth/request-otp`, { mobile }).pipe(
      catchError(() => of(void 0))
    );
  }

  // Verify OTP (expected: POST /auth/verify-otp { mobile, otp }) returns accessToken
  verifyOtp(mobile: string, otp: string): Observable<boolean> {
    if (!mobile || !otp) return of(false);
    return this.http.post<VerifyResponse>(`${environment.apiUrl}/auth/verify-otp`, { mobile, otp }).pipe(
      map((res) => {
        const token = res?.accessToken ?? null;
        if (token) {
          this.setToken(token);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  private setToken(token: string) {
    this.token = token;
    sessionStorage.setItem(this.tokenKey, token);
    this.isAuthenticated$.next(true);
  }

  getToken(): string | null {
    return this.token;
  }

  logout(): void {
    this.token = null;
    sessionStorage.removeItem(this.tokenKey);
    this.isAuthenticated$.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
