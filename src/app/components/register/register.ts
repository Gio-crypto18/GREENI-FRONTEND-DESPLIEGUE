import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';


interface GreeniUser {
  userId: string;
  fullName: string;
  email: string;
  status: string;
  joinedAt: string;
  bio: string;
  avatar: string;
  role: 'plantlover' | 'cientifico' | 'admin';
  notifications: {
    reminders: boolean;
    interactions: boolean;
    friends: boolean;
    newsletter: boolean;
  };
  passwordHash: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  private readonly API_URL =
    'https://6862d10a96f0cc4e34bb10c3.mockapi.io/api/v1/users';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        role: ['plantlover', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ===== Validación de confirmación de contraseña =====
  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  // ===== Submit =====
  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.setError('Por favor, completa correctamente el formulario.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { name, email, password, role } = this.registerForm.value;

    try {
      // 1) Verificar que el correo no exista en la API (igual que tu JS)
      const checkResponse = await fetch(this.API_URL);
      if (!checkResponse.ok) {
        throw new Error('Error al verificar el email.');
      }

      const allUsers = await checkResponse.json();
      const existingUser = allUsers.find((u: any) => u.email === email);

      if (existingUser) {
        this.setError('Este correo electrónico ya está registrado.');
        return;
      }

      // 2) Crear en MockAPI
      const apiUser = { name, email, password, role };
      const createResponse = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiUser),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Error de MockAPI:', errorText);
        throw new Error(
          `No se pudo crear la cuenta en la API: ${createResponse.status}`
        );
      }

      const createdUser = await createResponse.json();
      console.log('Usuario creado en MockAPI:', createdUser);

      // 3) Guardar también en localStorage como en tu JS
      const passwordHash = await this.sha256(password);
      const newGreeniUser: GreeniUser = {
        userId: crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
        fullName: name,
        email,
        status: 'Activo',
        joinedAt: new Date().toISOString(),
        bio: '',
        avatar: '',
        role,
        notifications: {
          reminders: true,
          interactions: true,
          friends: true,
          newsletter: false,
        },
        passwordHash,
      };

      const USERS_KEY = 'greeni_users';
      const CURRENT_KEY = 'greeni_current_user_id';

      const users: GreeniUser[] = JSON.parse(
        localStorage.getItem(USERS_KEY) || '[]'
      );
      users.push(newGreeniUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_KEY, newGreeniUser.userId);

      // (Opcional) guardamos en sesión para usar inmediatamente
      sessionStorage.setItem('currentUser', JSON.stringify(newGreeniUser));

      alert('¡Cuenta creada con éxito! Serás redirigido para iniciar sesión.');
      window.location.href = 'login.html';
    } catch (err: any) {
      console.error('Error en el proceso de registro:', err);
      this.setError(`Ocurrió un error: ${err.message || err}`);
    }
  }

  // ===== Utilidades =====
  private setError(msg: string): void {
    this.errorMessage = msg;
    this.isSubmitting = false;
  }

  private async sha256(str: string): Promise<string> {
    const data = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
