import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { Loginservice } from '../../services/loginservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-sidebar',
  standalone: true, 
  imports: [RouterLink,CommonModule,MatIconModule,MatMenuModule,RouterModule,MatButtonModule,MatToolbarModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {
  role: string = '';
constructor(private loginService: Loginservice,
    private snackBar: MatSnackBar){}
/* /logout(event: Event): void {
    event.preventDefault();
    console.log('Cerrando sesión...');
}
*/
verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
  isAdmin() {
    return this.role === 'ADMIN';
  }

  isCientifico() {
    return this.role === 'CIENTIFICO';
  }

  isPlantLover() {
    return this.role === 'PLANTLOVER';
  }

logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('motivacionMostrada'); // Limpia también
    location.href = '/login'; // Fuerza recarga total
    
  }
  ngOnInit(): void {
  if (this.loginService.verificar()) {
    this.role = this.loginService.showRole();
    }
  }
}

