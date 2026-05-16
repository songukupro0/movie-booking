import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-fail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-fail.html',
  styleUrl: './payment-fail.scss',
})
export class PaymentFail implements OnInit {
  private router = inject(Router);

  message = 'Thanh toán thất bại.';
  bookingId = '';

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.message = state['message'] ?? this.message;
      this.bookingId = state['bookingId'] ?? '';
    }
  }

  ngOnInit(): void {
    if (!this.bookingId && typeof history !== 'undefined') {
      this.message = history.state?.message ?? this.message;
      this.bookingId = history.state?.bookingId ?? '';
    }
  }
}
