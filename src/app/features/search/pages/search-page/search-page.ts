import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Movie } from '../../../../core/services/movie.service';
import { SearchBar } from '../../components/search-bar/search-bar';
import { SearchService, SearchState, StatusFilter } from '../../services/search.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchBar],
  providers: [SearchService], // ← Provider scoped ở đây
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage implements OnInit {
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** Toàn bộ state từ provider */
  readonly state$: Observable<SearchState> = this.searchService.state;

  /** Kết quả đã filter */
  readonly filteredResults$: Observable<Movie[]> = this.searchService.filteredResults$;

  /** Keyword ban đầu từ query param ?q= */
  initialKeyword = '';

  readonly filterOptions: { label: string; value: StatusFilter }[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang chiếu', value: 'now-showing' },
    { label: 'Sắp chiếu', value: 'coming-soon' },
  ];

  ngOnInit(): void {
    // Đọc query param ?q= khi vào trang
    this.route.queryParams
      .pipe(map((params) => params['q'] ?? ''))
      .subscribe((q) => {
        this.initialKeyword = q;
        if (q) {
          this.searchService.search(q);
        }
      });
  }

  /** Cập nhật URL khi keyword thay đổi */
  onSearchChange(keyword: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: keyword || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  setFilter(filter: StatusFilter): void {
    this.searchService.setFilter(filter);
  }

  trackByMovieId(_: number, movie: Movie): string {
    return movie._id;
  }

  getStatusLabel(status: string): string {
    return status === 'now-showing' ? 'Đang chiếu' : 'Sắp chiếu';
  }
}
