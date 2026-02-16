import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // If user and token exist, clone the request and add the Authorization header
  if (user && user.token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${user.token}`)
    });
    return next(cloned);
  }

  // If no token, just pass the request through
  return next(req);
};