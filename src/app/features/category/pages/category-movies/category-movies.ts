import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../../core/services/movie.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-category-movies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-movies.html',
  styleUrl: './category-movies.scss',
})
export class CategoryMovies {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  // Tab lọc trạng thái phim
  activeTab = signal<'all' | 'now-showing' | 'coming-soon'>('all');

  // Lấy data phim và danh mục từ Backend thông qua Slug trên URL
  private categoryData$ = this.route.paramMap.pipe(
    switchMap(params => {
      const slug = params.get('slug') || '';
      this.activeTab.set('all'); // Reset tab khi load thể loại mới
      return this.movieService.getMoviesByCategory(slug);
    })
  );

  categoryData = toSignal(this.categoryData$);

  // Computed Movies list
  movies = computed(() => {
    const allMovies = this.categoryData()?.movies || [];
    const tab = this.activeTab();
    if (tab === 'all') return allMovies;
    return allMovies.filter(m => m.status === tab);
  });
  
  // Tên hiển thị thể loại
  categoryName = computed(() => this.categoryData()?.category?.name || 'Đang tải...');

  switchTab(tab: 'all' | 'now-showing' | 'coming-soon') {
    this.activeTab.set(tab);
  }
}
