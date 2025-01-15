import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    
    if (token) {
      console.log('Ya hay token, redirigiendo a inicio');
      this.router.navigate(['/inicio']);
      return false;
    }
    
    return true;
  }
}