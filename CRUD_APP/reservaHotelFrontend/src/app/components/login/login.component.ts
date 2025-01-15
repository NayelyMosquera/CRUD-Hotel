
// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { authService } from './auth.service';
import { Router } from '@angular/router';

interface LoginData {
  email: string;
  password: string;
}

interface RegistrationData {
  full_name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showRegistrationForm: boolean = false;
  loginData: LoginData = { email: '', password: '' };
  registrationData: RegistrationData = { full_name: '', email: '', password: '' };
  notification: { message: string; type: 'error' | 'success' } | null = null;
  loading: boolean = false;

  constructor(
    private AuthService: authService,
    private router: Router,
  ) {}

  showNotification(message: string, type: 'error' | 'success') {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 5000);
  }

  login() {
    this.loading = true;
    this.notification = null;
    
    this.AuthService.login(this.loginData).subscribe({
      next: (response: any) => {
        console.log('Respuesta de login:', response);
        
        if (response.status) {
          this.showNotification('Inicio de sesión exitoso', 'success');
          localStorage.setItem('token', response.token);
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 1000);
        } else {
          this.showNotification('Credenciales incorrectas', 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.showNotification('Error al intentar iniciar sesión', 'error');
        this.loading = false;
      }
    });
  }

  register() {
    if (!this.registrationData.full_name || !this.registrationData.email || !this.registrationData.password) {
      this.showNotification('Por favor, complete todos los campos del formulario.', 'error');
      return;
    }

    this.loading = true;
    this.notification = null;

    this.AuthService.register(this.registrationData).subscribe({
      next: (response: any) => {
        console.log('Respuesta de registro:', response);
        if (response.status) {
          this.showNotification('Registro exitoso', 'success');
          localStorage.setItem('token', response.token);
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 1000);
        } else {
          this.showNotification('Error al registrar el usuario', 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.showNotification('Error al intentar registrar el usuario', 'error');
        this.loading = false;
      }
    });
  }
}