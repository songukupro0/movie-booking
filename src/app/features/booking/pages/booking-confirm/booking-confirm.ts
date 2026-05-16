import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../services/booking';

@Component({
  selector: 'app-booking-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-confirm.html',
  styleUrl: './booking-confirm.scss'
})
export class BookingConfirm implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private bookingService = inject(Booking);

  movieInfo: any;
  selectedSeats: string[] = [];
  totalPrice = 0;
  showtimeId = '';

  selectedPayment: 'momo' | 'zalopay' | 'atm' | 'visa' = 'momo';
  isProcessing = false;
  errorMessage = '';

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.movieInfo = state['movieInfo'];
      this.selectedSeats = state['selectedSeats'] ?? [];
      this.totalPrice = state['totalPrice'] ?? 0;
      this.showtimeId = state['showtimeId'] ?? '';
    }
  }

  ngOnInit() {
    if (!this.movieInfo) {
      const state = isPlatformBrowser(this.platformId) ? history.state : null;
      if (state?.movieInfo) {
        this.movieInfo = state.movieInfo;
        this.selectedSeats = state.selectedSeats ?? [];
        this.totalPrice = state.totalPrice ?? 0;
        this.showtimeId = state.showtimeId ?? '';
      }
    }
  }

  confirmPayment() {
    if (!this.showtimeId || this.selectedSeats.length === 0) {
      this.errorMessage = 'Thiếu thông tin suất chiếu hoặc ghế.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    this.bookingService.createBooking({
      showtimeId: this.showtimeId,
      seats: this.selectedSeats,
      paymentMethod: this.selectedPayment,
    }).subscribe({
      next: (booking) => {
        this.isProcessing = false;
        this.router.navigate(['/payment'], {
          state: {
            bookingId: booking._id,
            bookingCode: booking.bookingCode,
          },
        });
      },
      error: (error) => {
        this.isProcessing = false;
        this.errorMessage = error.error?.message || 'Không thể tạo đơn đặt vé.';
      },
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
