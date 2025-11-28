
import { Component } from '@angular/core';
import { PlantApiService } from '../../services/apidiagnostico';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-plant-identifier',
  imports: [CommonModule],
  templateUrl: './apidiagnostico.html',
  styleUrls: ['./apidiagnostico.css']
})
export class PlantIdentifierComponent {
  selectedFile: File | null = null;
  processedPlantData: any = null;
  isLoading = false;
  errorMessage = '';

  constructor(private apidiagnostico: PlantApiService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.errorMessage = '';
    this.processedPlantData = null;
  }

  identifyPlant(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor selecciona una imagen';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apidiagnostico.identifyPlant(this.selectedFile).subscribe({
      next: (result) => {
        console.log('✅ Datos procesados:', result);
        this.processedPlantData = result;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.errorMessage = error.message || 'Error al identificar la planta';
        this.isLoading = false;
      }
    });
  }
}