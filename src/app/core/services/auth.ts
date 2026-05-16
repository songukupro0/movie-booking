import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Storage } from './storage';

interface DecodedToken {
  exp?: number;
  role?: string;
  sub?: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'current_user';
  private storage = inject(Storage);

  getToken(): string | null {
    return this.storage.get<string>(this.tokenKey);
  }

  setToken(token: string): void {
    this.storage.set(this.tokenKey, token);
  }

  getCurrentUser<T = unknown>(): T | null {
    return this.storage.get<T>(this.userKey);
  }

  setCurrentUser(user: unknown): void {
    this.storage.set(this.userKey, user);
  }

  setSession(token: string, user: unknown): void {
    this.setToken(token);
    this.setCurrentUser(user);
  }

  clearToken(): void {
    this.storage.remove(this.tokenKey);
  }

  clearSession(): void {
    this.clearToken();
    this.storage.remove(this.userKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded.exp) return true;
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return typeof decoded.sub === 'string' ? decoded.sub : null;
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return typeof decoded.role === 'string' ? decoded.role : null;
    } catch {
      return null;
    }
  }

  logout(): void {
    this.clearSession();
  }
}
