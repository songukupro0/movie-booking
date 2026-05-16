import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Booking, SeatMapResponse, SeatMapSeat } from '../../services/booking';

interface DisplaySeat extends SeatMapSeat {
  rowLabel: string;
  seatNumber: number;
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.scss',
})
export class SeatSelection {
  private router = inject(Router);
  private bookingService = inject(Booking);

  movieId = input<string>();
  cinemaId = input<string>();
  date = input<string>();
  time = input<string>();
  room = input<string>();
  showtimeId = input<string>();

  readonly seatMap = signal<SeatMapResponse | null>(null);
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');
  readonly selectedSeatIds = signal<string[]>([]);

  readonly seats = computed<DisplaySeat[][]>(() => {
    const seatMap = this.seatMap();
    if (!seatMap) return [];

    const grouped = new Map<string, DisplaySeat[]>();

    seatMap.seats.forEach(seat => {
      const rowLabel = seat.id.charAt(0);
      const seatNumber = Number(seat.id.slice(1));
      const status = this.selectedSeatIds().includes(seat.id) ? 'selected' : seat.status;

      if (!grouped.has(rowLabel)) grouped.set(rowLabel, []);
      grouped.get(rowLabel)?.push({ ...seat, rowLabel, seatNumber, status });
    });

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, rowSeats]) => rowSeats.sort((a, b) => a.seatNumber - b.seatNumber));
  });

  readonly movieInfo = computed(() => {
    const seatMap = this.seatMap();
    return {
      title: seatMap?.movie?.title || 'Đang cập nhật',
      cinema: seatMap?.cinema?.name || 'Đang cập nhật',
      room: seatMap?.room?.name || this.room() || 'Đang cập nhật',
      showtime: seatMap?.showtime?.startTime
        ? new Date(seatMap.showtime.startTime).toLocaleString('vi-VN')
        : `${this.time() || 'N/A'} - ${this.date() || 'N/A'}`,
      showtimeId: seatMap?.showtime?.id || this.showtimeId() || '',
    };
  });

  readonly selectedSeats = computed(() =>
    this.seatMap()?.seats.filter(seat => this.selectedSeatIds().includes(seat.id)) ?? []
  );

  readonly totalPrice = computed(() =>
    this.selectedSeats().reduce((sum, seat) => sum + seat.price, 0)
  );

  readonly selectedSeatLabel = computed(() => this.selectedSeatIds().join(', '));

  constructor() {
    effect(() => {
      const showtimeId = this.showtimeId();
      if (showtimeId) {
        this.loadSeatMap(showtimeId);
      }
    });
  }

  loadSeatMap(showtimeId: string) {
    this.loading.set(true);
    this.errorMessage.set('');
    this.selectedSeatIds.set([]);

    this.bookingService.getSeatMap(showtimeId).subscribe({
      next: (data) => {
        this.seatMap.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Không thể tải sơ đồ ghế.');
        this.loading.set(false);
      },
    });
  }

  toggleSeat(seat: DisplaySeat) {
    if (seat.status === 'occupied' || seat.status === 'maintenance') return;

    const current = this.selectedSeatIds();
    this.selectedSeatIds.set(
      current.includes(seat.id)
        ? current.filter(id => id !== seat.id)
        : [...current, seat.id],
    );
  }

  bookSeats() {
    if (this.selectedSeatIds().length === 0 || !this.movieInfo().showtimeId) return;

    this.router.navigate(['/booking/booking-confirm'], {
      state: {
        movieInfo: this.movieInfo(),
        selectedSeats: this.selectedSeatIds(),
        totalPrice: this.totalPrice(),
        showtimeId: this.movieInfo().showtimeId,
      },
    });
  }
}
