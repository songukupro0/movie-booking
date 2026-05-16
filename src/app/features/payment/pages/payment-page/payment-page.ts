import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking, BookingResponse } from '../../../booking/services/booking';
import { Payment } from '../../services/payment';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss',
})
export class PaymentPage implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private bookingService = inject(Booking);
  private paymentService = inject(Payment);

  bookingId = '';
  booking: BookingResponse | null = null;
  paymentMethod: 'momo' | 'zalopay' | 'atm' | 'visa' = 'momo';
  loading = true;
  paying = false;
  errorMessage = '';

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state?.['bookingId']) {
      this.bookingId = state['bookingId'];
    }
  }

  ngOnInit(): void {
    if (!this.bookingId) {
      const state = isPlatformBrowser(this.platformId) ? history.state : null;
      this.bookingId = state?.bookingId ?? '';
    }

    if (!this.bookingId) {
      this.errorMessage = 'Không tìm thấy đơn đặt vé để thanh toán.';
      this.loading = false;
      return;
    }

    this.loadBooking();
  }

  loadBooking() {
    this.loading = true;
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.paymentMethod = (booking.paymentMethod as any) || 'momo';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Không thể tải thông tin đơn đặt vé.';
        this.loading = false;
      },
    });
  }

  confirmPayment() {
    if (!this.booking) return;

    this.paying = true;
    this.errorMessage = '';

    this.paymentService.payBooking(this.booking._id, this.paymentMethod).subscribe({
      next: (result) => {
        this.paying = false;
        this.router.navigate(['/payment/success'], {
          state: { booking: result },
        });
      },
      error: (error) => {
        this.paying = false;
        this.router.navigate(['/payment/fail'], {
          state: {
            message: error.error?.message || 'Thanh toán thất bại.',
            bookingId: this.booking?._id,
          },
        });
      },
    });
  }
}
