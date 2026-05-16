import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthState } from '../../../core/services/auth-state';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authState = inject(AuthState);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  dropdownOpen = signal(false);

  constructor() {
    this.authState.refresh();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.dropdownOpen.set(false);
        this.authState.refresh();
      });
  }

  @HostListener('document:click')
  closeDropdownOnOutsideClick(): void {
    this.dropdownOpen.set(false);
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownOpen.update(value => !value);
  }

  keepDropdownOpen(event: MouseEvent): void {
    event.stopPropagation();
  }

  logout(): void {
    this.authState.clearUser();
    this.dropdownOpen.set(false);
    this.router.navigateByUrl('/');
  }

  getAvatarLetter(): string {
    const user = this.authState.currentUser();
    if (!user) return '?';
    return (user.fullName || user.email || '?').charAt(0).toUpperCase();
  }
}
