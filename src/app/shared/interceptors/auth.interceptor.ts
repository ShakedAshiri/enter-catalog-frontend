import { HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LocalStorageKeys } from '../constants/localStorage.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    withCredentials: true,
  });

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as { message?: string };

        if (body?.message === 'Cleared cookie successfully') {
          localStorage.removeItem(LocalStorageKeys.USER_INFO);
          window.location.reload();
        }
      }
    }),
  );
};
