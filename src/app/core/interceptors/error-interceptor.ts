import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Notification } from '../services/notification';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(Notification);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.error?.message ||
        error.message ||
        'Đã xảy ra lỗi khi kết nối máy chủ.';

      notification.error(message);
      return throwError(() => error);
    }),
  );
};
