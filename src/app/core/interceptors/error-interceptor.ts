import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ModalService } from '../services/modal';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const modal = inject(ModalService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // error for Blob when the pdf report generation fails.
      if (err.error instanceof Blob) {
        return from(err.error.text())
          .pipe(
            switchMap(text => {
              let message = 'An unexpected error occurred.';
              try {
                const parsed = JSON.parse(text);
                if (parsed.message) {
                  message = parsed.message;
                }
              } catch {
                if (text) message = text;
              }
              modal.error(message)
              return throwError(() => err);
            })
          );
      }

      // error for normal JSON responses
      let message = 'An unexpected error occurred.';

      if (err.error?.message) {
        message = err.error.message;
      } else if (err.status === 0) {
        message = 'Could not connect to the server';
      } else if (err.message) {
        message = err.message;
      }

      modal.error(message);
      return throwError(() => err);
    }),
  );
};
