import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../models/categories.model';

// Re-export để các file cũ đang import từ đây không bị lỗi
export type { Category };
// Alias giữ tương thích nếu có nơi dùng tên 'category' (lowercase)
export type { Category as category };

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/categories';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Category>(url).pipe(
      catchError(this.handleError<Category>(`getCategoryById id=${id}`))
    );
  }

  searchCategoriesByName(name: string): Observable<Category[]> {
    const url = `${this.apiUrl}?name=${encodeURIComponent(name)}`;
    return this.http.get<Category[]>(url).pipe(
        catchError(this.handleError<Category[]>('searchCategoriesByName', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
