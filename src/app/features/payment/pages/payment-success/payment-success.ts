import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookingResponse } from '../../../booking/services/booking';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccess implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  booking: BookingResponse | null = null;

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state?.['booking']) {
      this.booking = state['booking'];
    }
  }

  ngOnInit(): void {
    if (!this.booking && typeof history !== 'undefined') {
      this.booking = history.state?.booking ?? null;
    }
  }
}
