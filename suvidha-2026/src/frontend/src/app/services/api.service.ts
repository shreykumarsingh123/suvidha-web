import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private handleError(operation = 'request') {
    return (error: HttpErrorResponse) => {
      console.error(`${operation} failed:`, error);
      const msg = error?.error?.message || error.message || 'Server error';
      return throwError(() => new Error(msg));
    };
  }

  // 👤 User APIs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
      .pipe(catchError(this.handleError('getUsers')));
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user)
      .pipe(catchError(this.handleError('createUser')));
  }

  // 🔧 Generic helpers
  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${path}`)
      .pipe(catchError(this.handleError(`GET ${path}`)));
  }

  post<T, R = T>(path: string, body: T): Observable<R> {
    return this.http.post<R>(`${this.apiUrl}/${path}`, body)
      .pipe(catchError(this.handleError(`POST ${path}`)));
  }

  // 🔑 OTP Auth APIs
  requestOtp(mobileNumber: string): Observable<any> {
    return this.post<{ mobileNumber: string }, any>('auth/request-otp', { mobileNumber });
  }

  verifyOtp(mobileNumber: string, otp: string): Observable<any> {
    return this.post<{ mobileNumber: string; otp: string }, any>('auth/verify-otp', { mobileNumber, otp });
  }
}
