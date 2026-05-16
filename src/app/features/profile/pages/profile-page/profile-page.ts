import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth as CoreAuth } from '../../../../core/services/auth';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  private authService = inject(Auth);
  private coreAuth = inject(CoreAuth);

  profile = signal<any>(this.coreAuth.getCurrentUser());
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    if (this.coreAuth.isLoggedIn()) {
      this.loading.set(true);
      this.authService.getMe().subscribe({
        next: (user) => {
          this.profile.set(user);
          this.coreAuth.setCurrentUser(user);
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Không tải được hồ sơ.');
          this.loading.set(false);
        },
      });
    }
  }

  logout() {
    this.coreAuth.logout();
    this.profile.set(null);
  }
}
