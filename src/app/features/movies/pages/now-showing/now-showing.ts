import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-now-showing',
  standalone: true,
  imports: [CommonModule, RouterModule, Pagination],
  templateUrl: './now-showing.html',
  styleUrl: './now-showing.scss',
})
export class NowShowing {
  private movieService = inject(MovieService);

  currentPage  = signal(1);
  totalPages   = signal(1);
  movies       = signal<any[]>([]);
  isLoading    = signal(true);

  constructor() {
    this.loadMovies(1);
  }

  loadMovies(page: number) {
    this.isLoading.set(true);
    this.movieService.getNowShowingMovies(page).subscribe(res => {
      this.movies.set(res.movies);
      this.currentPage.set(res.page);
      this.totalPages.set(res.totalPages);
      this.isLoading.set(false);
      // Scroll về đầu danh sách khi đổi trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onPageChange(page: number) {
    this.loadMovies(page);
  }
}
