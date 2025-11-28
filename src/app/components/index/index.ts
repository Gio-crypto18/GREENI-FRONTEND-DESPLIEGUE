import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink,MatSnackBarModule,MatIconModule],
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
})
export class Index implements OnInit {
  role=""
  showLogin = false;
  showRegister = false;

  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerPasswordConfirm = '';
  registerRole = 'Plant Lover';

  tab: 'manual' | 'foto' = 'manual';
  temperatura = 25;
  humedad = 50;
  ph = 7;
  tipoPlanta = '';

  showGuidesList = false;

  constructor(private router: Router,    private loginService: Loginservice,
    private snackBar: MatSnackBar,) {}

    isAdmin() {
    return this.role === 'ADMIN';
  }

  isVoluntario() {
    return this.role === 'PLANTLOVER';
  }

  isEcologista() {
    return this.role === 'CIENTIFICO';
  }
  
  // 7. LÓGICA DE INICIALIZACIÓN (SNACKBAR Y CARGA DE ROL)
  ngOnInit(): void {
    // Verificar si el usuario ya está logueado al cargar la página (útil si hay recarga)
    if (this.loginService.verificar()) {
        this.role = this.loginService.showRole();

    
    }
  }
  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openLogin(): void {
    this.showRegister = false;
    this.showLogin = true;
  }

  openRegister(): void {
    this.showLogin = false;
    this.showRegister = true;
  }

  switchToRegister(): void {
    this.showLogin = false;
    this.showRegister = true;
  }

  switchToLogin(): void {
    this.showRegister = false;
    this.showLogin = true;
  }

  closeAuth(): void {
    this.showLogin = false;
    this.showRegister = false;
  }

  login(): void {
    localStorage.setItem('userName', 'Fressia');
    localStorage.setItem('userEmail', this.loginEmail);
    this.closeAuth();
    this.router.navigate(['/app/home']);
  }

  register(): void {
    localStorage.setItem('userName', this.registerName);
    localStorage.setItem('userEmail', this.registerEmail);
    this.closeAuth();
    this.router.navigate(['/app/home']);
  }

  goToGuide(id: string): void {

    const el = document.getElementById('guides-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    console.log('Guía seleccionada:', id);
  }
}
