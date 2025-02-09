import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  router = inject(Router);

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Optionally, add more checks here
      return true;
    } else {
      localStorage.removeItem('access_token');
      window.location.href = '/';
      return false;
    }
  }
}
