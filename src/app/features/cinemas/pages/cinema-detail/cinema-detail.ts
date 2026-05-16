import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Showtime {
  time: string;
  room: string;
}

interface MovieShow {
  id: number;
  title: string;
  image: string;
  genre: string;
  showtimes: Showtime[];
}

@Component({
  selector: 'app-cinema-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cinema-detail.html',
  styleUrl: './cinema-detail.scss',
})
export class CinemaDetail {
  // Lấy 'id' từ route params bằng `input()`
  // Ví dụ: /cinemas/1 -> id() sẽ là '1'
  id = input.required<string>();

  // Trong thực tế, bạn sẽ dùng id() này để gọi API lấy chi tiết rạp

  // Mock data thông tin rạp
  cinema = signal({
    id: 1,
    name: 'Galaxy Nguyễn Du',
    address: '116 Nguyễn Du, Quận 1, TP.HCM',
    hotline: '1900 2224',
  });

  // Mock data danh sách phim và lịch chiếu tại rạp này
  movies = signal<MovieShow[]>([
    {
      id: 1,
      title: 'Dune: Hành Tinh Cát 2',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh2nn2sCworwC6hABlfMrlbvqZ1BXMAH6vnA&s',
      genre: 'Hành động, Viễn tưởng',
      showtimes: [{ time: '09:00', room: 'R1' }, { time: '11:30', room: 'R2' }, { time: '14:00', room: 'R1' }]
    },
    {
      id: 2,
      title: 'Godzilla x Kong',
      image: 'https://i.ytimg.com/vi/B2Jlyq_Tf3Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBsl4vJYQm-z7JXhdGKTxuNuEn2oQ',
      genre: 'Hành động, Quái vật',
      showtimes: [{ time: '10:00', room: 'R3' }, { time: '13:15', room: 'R4' }, { time: '16:45', room: 'R3' }]
    }
  ]);

  // Quản lý ngày xem phim
  selectedDate = signal<Date>(new Date());

  // Tạo danh sách 7 ngày tới để người dùng chọn
  nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  selectDate(date: Date) {
    this.selectedDate.set(date);
    // Sau này có thể gọi API fetch lại lịch chiếu theo ngày tại đây
  }
}
