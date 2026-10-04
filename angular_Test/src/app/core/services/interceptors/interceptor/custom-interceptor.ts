import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const authServices = inject(AuthService);
  const token = authServices.getToken();
  if(token){
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(req);
};
