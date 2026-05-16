import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movie, PagedResponse } from '../models/movie.model';

// Re-export để các file cũ đang import từ đây không bị lỗi
export type { Movie, PagedResponse };

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/movies';

  getNowShowingMovies(page = 1, limit = 8): Observable<PagedResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PagedResponse>(`${this.apiUrl}/now-showing`, { params }).pipe(
      catchError(this.handleError<PagedResponse>('getNowShowingMovies', { movies: [], total: 0, page: 1, totalPages: 1 }))
    );
  }

  getComingSoonMovies(page = 1, limit = 8): Observable<PagedResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<PagedResponse>(`${this.apiUrl}/coming-soon`, { params }).pipe(
      catchError(this.handleError<PagedResponse>('getComingSoonMovies', { movies: [], total: 0, page: 1, totalPages: 1 }))
    );
  }

  getMoviesByCategory(slug: string): Observable<{category: any, movies: Movie[]}> {
    return this.http.get<{category: any, movies: Movie[]}>(`${this.apiUrl}/category/${slug}`).pipe(
      catchError(this.handleError<{category: any, movies: Movie[]}>('getMoviesByCategory'))
    );
  }

  getMovieBySlug(slug: string): Observable<Movie | undefined> {
    return this.http.get<Movie>(`${this.apiUrl}/${slug}`).pipe(
      catchError(this.handleError<Movie>(`getMovieBySlug slug=${slug}`))
    );
  }

  searchMovies(keyword: string): Observable<Movie[]> {
    if (!keyword.trim()) {
      return of([]);
    }

    return this.http.get<Movie[]>(`${this.apiUrl}/search/${encodeURIComponent(keyword.trim())}`).pipe(
      catchError(this.handleError<Movie[]>('searchMovies', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
