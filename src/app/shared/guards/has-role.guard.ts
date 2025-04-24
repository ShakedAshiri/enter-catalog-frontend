import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../constants/role';
import { AuthService } from '../services/auth.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const userRole: Role = inject(AuthService).getCurrentUser()?.userRole.id;
  const expectedRoles: Role[] = route.data['roles'];

  const hasRole: boolean = expectedRoles.some((role) => userRole === role);

  return hasRole || router.navigate(['home']);
};