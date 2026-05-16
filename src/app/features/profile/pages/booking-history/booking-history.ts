import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth as CoreAuth } from '../../../../core/services/auth';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.scss',
})
export class BookingHistory {
  seatCodes(booking: any): string {
    return booking?.seats?.map((seat: any) => seat.seatCode).join(', ') || 'Chưa có ghế';
  }

  private authService = inject(Auth);
  private coreAuth = inject(CoreAuth);

  bookings = signal<any[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    if (!this.coreAuth.isLoggedIn()) {
      this.errorMessage.set('Vui lòng đăng nhập để xem lịch sử đặt vé.');
      return;
    }

    this.loading.set(true);
    this.authService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Không tải được lịch sử đặt vé.');
        this.loading.set(false);
      },
    });
  }
}
