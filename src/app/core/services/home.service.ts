import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { Category } from '../models/categories.model';
import { HomeData } from '../models/home.model';

// Re-export để các file khác vẫn import được từ đây nếu cần
export type { HomeData };

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/home';

  // Cache toàn bộ trang chủ trong 1 request duy nhất
  private homeData$: Observable<HomeData> | null = null;

  /** Lấy toàn bộ dữ liệu trang chủ từ 1 API call duy nhất */
  getHomeData(): Observable<HomeData> {
    if (!this.homeData$) {
      this.homeData$ = this.http.get<{ success: boolean; data: HomeData }>(`${this.apiUrl}`).pipe(
        map(res => res.data),
        catchError(err => {
          console.error('getHomeData failed:', err.message);
          return of({
            banners: [],
            nowShowing: [],
            comingSoon: [],
            topTrending: [],
            categories: [],
            posts: [],
            promotions: []
          } as HomeData);
        }),
        shareReplay(1)
      );
    }
    return this.homeData$;
  }

  // ── Convenience methods — lấy từng phần từ cache chung ──────────────

  getBannerMovies(): Observable<Movie[]> {
    return this.getHomeData().pipe(map(d => d.banners));
  }

  getNowShowing(): Observable<Movie[]> {
    return this.getHomeData().pipe(map(d => d.nowShowing));
  }

  getComingSoon(): Observable<Movie[]> {
    return this.getHomeData().pipe(map(d => d.comingSoon));
  }

  getTopTrending(): Observable<Movie[]> {
    return this.getHomeData().pipe(map(d => d.topTrending));
  }

  getCategories(): Observable<Category[]> {
    return this.getHomeData().pipe(map(d => d.categories));
  }

  getPosts(): Observable<any[]> {
    return this.getHomeData().pipe(map(d => d.posts));
  }

  getPromotions(): Observable<any[]> {
    return this.getHomeData().pipe(map(d => d.promotions));
  }

  // ── Quick Booking (vẫn gọi API riêng theo params) ──────────────────

  getQuickMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quick/movies`).pipe(
      catchError(this.handleError<any[]>('getQuickMovies', []))
    );
  }

  getQuickCinemas(movieId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quick/cinemas/${movieId}`).pipe(
      catchError(this.handleError<any[]>('getQuickCinemas', []))
    );
  }

  getQuickDates(movieId: string, cinemaId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/quick/dates/${movieId}/${cinemaId}`).pipe(
      catchError(this.handleError<string[]>('getQuickDates', []))
    );
  }

  getQuickShowtimes(movieId: string, cinemaId: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quick/showtimes/${movieId}/${cinemaId}/${date}`).pipe(
      catchError(this.handleError<any[]>('getQuickShowtimes', []))
    );
  }

  clearCache(): void {
    this.homeData$ = null;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
