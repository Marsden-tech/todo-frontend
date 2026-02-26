import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip token for auth endpoints
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  const token = authService.getAccessToken();

  const authReq = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401) {
        // Try to refresh the token
        return authService.refresh().pipe(
          switchMap((response) => {
            // Retry the original request with new token
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // Refresh failed — logout and redirect to login
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        authService.logout();
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};