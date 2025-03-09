import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  req = req.clone({
    withCredentials: true,
  });

  if (token) {
    req.headers.append('Authorization', `Bearer ${token}`);
  }

  return next(req);
};
