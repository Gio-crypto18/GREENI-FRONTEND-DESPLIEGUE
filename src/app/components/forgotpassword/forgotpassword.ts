import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class ForgotPasswordComponent {

  step: 'check' | 'reset' = 'check';


  email = '';
  newPassword = '';
  confirmPassword = '';


  userId: string | null = null;


  checkErrorMessage = '';
  resetErrorMessage = '';


  private readonly API_URL =
    'https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users';


  async onCheckEmailSubmit(): Promise<void> {
    this.checkErrorMessage = '';

    const email = this.email.trim();
    if (!email) {
      this.checkErrorMessage = 'Por favor, ingresa un correo electrónico.';
      return;
    }

    try {
      const response = await fetch(
        `${this.API_URL}?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error('Error al conectar con la API.');
      }

      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        this.userId = user.id;
        this.step = 'reset';
      } else {
        this.checkErrorMessage =
          'No se encontró ninguna cuenta con ese correo.';
      }
    } catch (err) {
      console.error('Error verificando email:', err);
      this.checkErrorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }

  async onResetPasswordSubmit(): Promise<void> {
    this.resetErrorMessage = '';

    if (!this.userId) {
      this.resetErrorMessage =
        'Primero verifica tu correo antes de cambiar la contraseña.';
      return;
    }

    const newPassword = this.newPassword;
    const confirmPassword = this.confirmPassword;

    if (newPassword.length < 8) {
      this.resetErrorMessage =
        'La nueva contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (newPassword !== confirmPassword) {
      this.resetErrorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      const response = await fetch(`${this.API_URL}/${this.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la contraseña.');
      }

      alert(
        '¡Contraseña actualizada con éxito! Serás redirigido para iniciar sesión.'
      );
      window.location.href = '/login';
    } catch (err) {
      console.error('Error actualizando la contraseña:', err);
      this.resetErrorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }
}
