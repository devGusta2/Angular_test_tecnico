import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const autorizadoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.autenticado()) return router.createUrlTree(['/login']);
  const allowedRoles = route.data['roles'] as string[] | undefined;
  if (!allowedRoles || allowedRoles.includes(authService.getRole() ?? '')) return true;
  return router.createUrlTree([authService.getRole() === 'ADMIN' ? '/admin/user' : '/perfil']);
};
