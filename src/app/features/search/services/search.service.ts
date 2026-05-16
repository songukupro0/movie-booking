import { DestroyRef, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  combineLatest,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  map,
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Movie } from '../../../core/services/movie.service';

export type StatusFilter = 'all' | 'now-showing' | 'coming-soon';

export interface SearchState {
  keyword: string;
  results: Movie[];
  loading: boolean;
  searched: boolean;
  filter: StatusFilter;
  error: string | null;
}

const INITIAL_STATE: SearchState = {
  keyword: '',
  results: [],
  loading: false,
  searched: false,
  filter: 'all',
  error: null,
};

/**
 * SearchService — Provider quản lý toàn bộ luồng tìm kiếm phim:
 *  - Tiếp nhận keyword từ input stream
 *  - Debounce 400ms, bỏ qua giá trị trùng
 *  - Gọi API tìm kiếm và cập nhật state
 *  - Hỗ trợ filter theo trạng thái phim
 *  - Expose state dưới dạng Observable để component subscribe
 */
@Injectable()
export class SearchService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private apiUrl = 'http://localhost:3000/api/movies';

  // ── Internal Subjects ────────────────────────────────────────────────────
  private state$ = new BehaviorSubject<SearchState>(INITIAL_STATE);
  private searchInput$ = new Subject<string>();

  // ── Public Observables ───────────────────────────────────────────────────
  readonly state = this.state$.asObservable();

  /** Kết quả đã áp dụng filter */
  readonly filteredResults$: Observable<Movie[]> = combineLatest([
    this.state$.pipe(map((s) => s.results)),
    this.state$.pipe(map((s) => s.filter)),
  ]).pipe(
    map(([results, filter]) =>
      filter === 'all' ? results : results.filter((m) => m.status === filter)
    )
  );

  constructor() {
    // ── Reactive Search Pipeline ─────────────────────────────────────────
    this.searchInput$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap((keyword) => {
          this.patch({ keyword, searched: true, error: null });
          if (!keyword.trim()) {
            this.patch({ results: [], loading: false });
          }
        }),
        switchMap((keyword) => {
          const kw = keyword.trim();
          if (!kw) return of([] as Movie[]);
          this.patch({ loading: true });
          return this.http
            .get<Movie[]>(
              `${this.apiUrl}/search/${encodeURIComponent(kw)}`
            )
            .pipe(
              catchError((err) => {
                this.patch({
                  error: 'Không thể kết nối máy chủ. Vui lòng thử lại.',
                  loading: false,
                });
                return of([] as Movie[]);
              })
            );
        }),
        tap((results) => this.patch({ results, loading: false })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /** Gửi keyword vào pipeline (dùng cho cả form submit và real-time input) */
  search(keyword: string): void {
    this.searchInput$.next(keyword);
  }

  /** Thay đổi bộ lọc trạng thái phim */
  setFilter(filter: StatusFilter): void {
    this.patch({ filter });
  }

  /** Reset toàn bộ về trạng thái ban đầu */
  reset(): void {
    this.state$.next(INITIAL_STATE);
  }

  /** Snapshot state hiện tại */
  getSnapshot(): SearchState {
    return this.state$.getValue();
  }

  // ── Private Helpers ──────────────────────────────────────────────────────
  private patch(partial: Partial<SearchState>): void {
    this.state$.next({ ...this.state$.getValue(), ...partial });
  }
}
