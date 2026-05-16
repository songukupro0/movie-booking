import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth } from './auth';
import { AuthUser } from '../../features/auth/services/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private coreAuth = inject(Auth);

  // Signal lưu user hiện tại
  private _currentUser = signal<AuthUser | null>(this.coreAuth.getCurrentUser<AuthUser>());

  // Public computed signals
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoggedIn = computed(() => this.coreAuth.isLoggedIn() && !!this._currentUser());
  readonly userRole = computed(() => this._currentUser()?.role ?? null);

  /** Gọi sau khi login/register thành công */
  setUser(user: AuthUser): void {
    this.coreAuth.setCurrentUser(user);
    this._currentUser.set(user);
  }

  /** Gọi khi logout */
  clearUser(): void {
    this._currentUser.set(null);
    this.coreAuth.clearSession();
  }

  /** Đọc lại user từ localStorage (dùng khi reload trang) */
  refresh(): void {
    const user = this.coreAuth.getCurrentUser<AuthUser>();
    this._currentUser.set(user);
  }
}
