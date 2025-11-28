// layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  imports: [CommonModule, RouterOutlet, RouterLink,RouterLink,CommonModule,MatIconModule,MatMenuModule,RouterModule,MatButtonModule,MatToolbarModule],
})
export class LayoutComponent {
   role: string = '';
  userName = 'Fressia';
  userEmail = 'fressia@greeni.com';

  constructor(private router: Router,private loginService: Loginservice) {}

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
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
  ngOnInit(): void {
  if (this.loginService.verificar()) {
    this.role = this.loginService.showRole();
    }
  }
}
