import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  // Inputs
  currentPage = input.required<number>();
  totalPages  = input.required<number>();

  // Output: emit trang mới khi user bấm
  pageChange = output<number>();

  // Tính danh sách các trang để hiển thị (có dấu "..." nếu nhiều trang)
  pages = computed(() => {
    const total   = this.totalPages();
    const current = this.currentPage();
    const delta   = 2; // số trang hiển thị xung quanh trang hiện tại

    const range: (number | '...')[] = [];
    const rangeWithDots: (number | '...')[] = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    let prev: number | '...' | null = null;
    for (const i of range) {
      if (prev !== null) {
        if (typeof i === 'number' && typeof prev === 'number' && i - prev > 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  });

  goTo(page: number | '...') {
    if (page === '...') return;
    if (page < 1 || page > this.totalPages()) return;
    this.pageChange.emit(page);
  }

  prev() { this.goTo(this.currentPage() - 1); }
  next() { this.goTo(this.currentPage() + 1); }
}
