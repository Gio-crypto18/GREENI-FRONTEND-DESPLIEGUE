import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  private readonly API_URL = 'https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { email, password } = this.loginForm.value;

    try {
      const apiUrl = `${this.API_URL}?email=${encodeURIComponent(email)}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Hubo un problema al conectar con el servidor.');
      }

      const users = await response.json();
      const user = users[0]; // MockAPI devuelve array

      if (user && user.password === password) {
        const userData = {
          name: user.name,
          email: user.email
        };
        sessionStorage.setItem('currentUser', JSON.stringify(userData));

        // Redirección equivalente a home.html, pero en Angular:
        window.location.href = '/home';
      } else {
        this.showError('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
      }
    } catch (err: any) {
      console.error('Error en el inicio de sesión:', err);
      this.showError('Ocurrió un error inesperado. Verifica tu conexión.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;
  }
}
