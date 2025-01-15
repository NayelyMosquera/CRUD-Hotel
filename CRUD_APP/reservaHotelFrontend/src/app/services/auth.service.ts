import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/user'; // Asegúrate de que esta URL coincida con tu backend

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    console.log('Intentando login con:', credentials);
    return this.http.post(`${this.apiUrl}/sign-Up`, credentials).pipe(
      tap(
        response => console.log('Respuesta exitosa:', response),
        error => console.error('Error en login:', error)
      )
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}