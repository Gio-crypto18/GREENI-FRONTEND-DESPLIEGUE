import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './public.html',
  styleUrl: './public.css',
})
export class PublicarComponent {
  userName = 'Renzo Arteaga';
  previewUrl: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  publicar(): void {
    alert('¡Publicación realizada con éxito!');
  }
}
