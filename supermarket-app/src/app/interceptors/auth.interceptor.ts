// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Füge XSRF-TOKEN hinzu für Form-basierte Auth, falls nötig
  return next(req);
};
