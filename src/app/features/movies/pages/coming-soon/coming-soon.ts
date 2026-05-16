import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule, Pagination],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
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
    this.movieService.getComingSoonMovies(page).subscribe(res => {
      this.movies.set(res.movies);
      this.currentPage.set(res.page);
      this.totalPages.set(res.totalPages);
      this.isLoading.set(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onPageChange(page: number) {
    this.loadMovies(page);
  }
}
