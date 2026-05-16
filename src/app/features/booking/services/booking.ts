import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SeatMapSeat {
  id: string;
  type: 'standard' | 'vip' | 'sweetbox';
  price: number;
  status: 'available' | 'occupied' | 'maintenance' | 'selected';
}

export interface SeatMapResponse {
  showtime: {
    id: string;
    startTime: string;
    endTime: string;
    format: string;
    language: string;
    basePrice: number;
  };
  movie: {
    id: string;
    title: string;
    image: string;
    ageRating: string;
  } | null;
  cinema: {
    id: string;
    name: string;
    address: string;
  } | null;
  room: {
    id: string;
    name: string;
    capacity: number;
  };
  seats: SeatMapSeat[];
}

export interface CreateBookingPayload {
  showtimeId: string;
  seats: string[];
  paymentMethod: 'momo' | 'zalopay' | 'atm' | 'visa';
}

export interface BookingResponse {
  _id: string;
  bookingCode: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled';
  ticketBarcode?: string;
  seats: Array<{ seatCode: string; seatType: string; price: number }>;
  expiresAt?: string;
  movieId?: { _id?: string; title: string; image?: string; ageRating?: string } | string;
  cinemaId?: { _id?: string; name: string; address?: string } | string;
  showtimeId?: { _id?: string; startTime: string; endTime: string; format: string; language: string; roomId?: string } | string;
  room?: { id: string; name: string } | null;
}

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/bookings';

  seedSampleData(): Observable<{ message: string; showtimeId: string }> {
    return this.http.post<{ message: string; showtimeId: string }>(`${this.apiUrl}/seed`, {});
  }

  getSeatMap(showtimeId: string): Observable<SeatMapResponse> {
    return this.http.get<SeatMapResponse>(`${this.apiUrl}/showtimes/${showtimeId}/seats`);
  }

  createBooking(payload: CreateBookingPayload): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, payload);
  }

  getBookingById(bookingId: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/${bookingId}`);
  }
}
