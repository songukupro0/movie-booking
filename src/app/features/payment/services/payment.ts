import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingResponse } from '../../booking/services/booking';

@Injectable({
  providedIn: 'root',
})
export class Payment {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/bookings';

  payBooking(bookingId: string, paymentMethod: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/${bookingId}/pay`, {
      paymentMethod,
    });
  }
}
