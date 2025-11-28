import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from '../chatbot/chatbot';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [
    CommonModule,
    ChatbotComponent,
    ReactiveFormsModule,
    RouterLink,
    MatIcon,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './plantazona.html',
  styleUrl: './plantazona.css',
})
export class Plantazona {
  previewUrl: string | null = null;
   role: string = '';
  constructor(public route: ActivatedRoute,private loginService: Loginservice) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.previewUrl = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
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
