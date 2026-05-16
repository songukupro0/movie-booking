import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cinema-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cinema-list.html',
  styleUrl: './cinema-list.scss'
})
export class CinemaList {
  cities = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];
  activeCity = 'Hồ Chí Minh';

  cinemas = [
    { name: 'Galaxy Nguyễn Du', address: '116 Nguyễn Du, Quận 1', city: 'Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800' },
    { name: 'Galaxy Tân Bình', address: '246 Nguyễn Hồng Đào, Tân Bình', city: 'Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800' },
    { name: 'Galaxy Kinh Dương Vương', address: '718bis Kinh Dương Vương, Q6', city: 'Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800' },
    { name: 'Galaxy Sala', address: 'Thiso Mall Sala, Quận 2', city: 'Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800' },
    { name: 'Galaxy Mipec Long Biên', address: 'Khu Mipec Riverside, Long Biên', city: 'Hà Nội', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800' },
    { name: 'Galaxy Đà Nẵng', address: 'Tầng 3 CoopMart Đà Nẵng', city: 'Đà Nẵng', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800' }
  ];

  get filteredCinemas() {
    return this.cinemas.filter(c => c.city === this.activeCity);
  }

  setCity(c: string) {
    this.activeCity = c;
  }
}