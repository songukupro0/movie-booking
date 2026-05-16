import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Auth as CoreAuth } from '../../../core/services/auth';
import { AuthState } from '../../../core/services/auth-state';

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  loyaltyPoints?: number;
  membershipTier?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private coreAuth = inject(CoreAuth);
  private authState = inject(AuthState);
  private apiUrl = 'http://localhost:3000/api/auth';

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        this.coreAuth.setSession(response.token, response.user);
        this.authState.setUser(response.user);
      }),
    );
  }

  register(payload: { fullName: string; email: string; password: string; phone?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(response => {
        this.coreAuth.setSession(response.token, response.user);
        this.authState.setUser(response.user);
      }),
    );
  }

  getMe(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/me`);
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me/bookings`);
  }
}
