// d:\angular\movie-booking\src\app\features\showtimes\pages\showtime-list\showtime-list.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-showtime-list',
  templateUrl: './showtime-list.html',
  styleUrls: ['./showtime-list.scss'],
  standalone: false
})
export class ShowtimeListComponent implements OnInit {
  dates: any[] = [];
  selectedDate: any;
  
  // Mock Data: Danh sách rạp và suất chiếu
  cinemas = [
    {
      id: 1,
      name: 'Galaxy Nguyễn Du',
      address: '116 Nguyễn Du, Q.1, TP.HCM',
      movies: [
        {
          title: 'Thỏ ơi',
          poster: 'https://cdn.galaxycine.vn/media/2026/2/10/tho-oi-500_1770696594579.jpg',
          format: '2D Phụ Đề',
          rating: 'T13',
          times: ['10:00', '12:15', '14:30', '16:45', '19:00', '21:15', '23:30']
        },
        {
          title: 'Quỷ Nhập Tràng 2',
          poster: 'https://cdn.galaxycine.vn/media/2026/2/26/quy-nhap-trang-2-500_1772097817869.jpg',
          format: '2D Lồng Tiếng',
          rating: 'T18',
          times: ['11:00', '13:30', '18:00', '20:30', '22:45']
        }
      ]
    },
    {
      id: 2,
      name: 'Galaxy Tân Bình',
      address: '246 Nguyễn Hồng Đào, Q.TB, TP.HCM',
      movies: [
        {
          title: 'Dune: Hành Tinh Cát 2',
          poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh2nn2sCworwC6hABlfMrlbvqZ1BXMAH6vnA&s',
          format: 'IMAX 2D',
          rating: 'T16',
          times: ['09:00', '12:00', '15:00', '18:00', '21:00']
        },
        {
          title: 'Kung Fu Panda 4',
          poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5rcKFQqqI0CN0sdES-7htbSUsMB-9fHmSjQ&s',
          format: '2D Lồng Tiếng',
          rating: 'P',
          times: ['08:30', '10:30', '14:00', '16:00']
        }
      ]
    }
  ];

  ngOnInit() {
    this.generateDates();
  }

  // Tạo danh sách 7 ngày tới
  generateDates() {
    const today = new Date();
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      this.dates.push({
        fullDate: date,
        dayName: i === 0 ? 'Hôm nay' : days[date.getDay()],
        dayNumber: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
    }
    // Mặc định chọn ngày đầu tiên
    this.selectedDate = this.dates[0];
  }

  selectDate(date: any) {
    this.selectedDate = date;
    // Logic gọi API lấy lịch chiếu theo ngày sẽ đặt ở đây
    console.log('Đã chọn ngày:', date);
  }
}
