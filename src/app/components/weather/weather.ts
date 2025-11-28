import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather/weather';
import { WeatherData } from '../../models/weather';


@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="weather-container">
      <h3>🌤️ Componente del Clima </h3>
      
      <!-- Estados visibles -->
      <div *ngIf="loading" class="loading">
        <p>🔄 Cargando datos del clima...</p>
      </div>

      <div *ngIf="error" class="error">
        <p>❌ Error: {{ error }}</p>
      </div>

      <div *ngIf="!weatherData && !loading && !error" class="no-data">
        <p>⚠️ No hay datos del clima disponibles</p>
        <button (click)="getDefaultWeather()">Intentar de nuevo</button>
      </div>

      <!-- Datos del clima -->
      <div *ngIf="weatherData" class="weather-card">
        <h4> {{ weatherData.location }}</h4>
        <div class="weather-main">
          <img [src]="weatherData.icon" [alt]="weatherData.description" class="weather-icon">
          <div class="temperature">{{ weatherData.temperature }}°C</div>
        </div>
        <p class="description">{{ weatherData.description }}</p>
        <div class="weather-details">
          <div class="detail">
            <span>Sensación:</span>
            <span>{{ weatherData.feelsLike }}°C</span>
          </div>
          <div class="detail">
            <span>Humedad:</span>
            <span>{{ weatherData.humidity }}%</span>
          </div>
        </div>
      </div>

      <!-- Búsqueda -->
      <div class="search-section">
        <input 
          type="text" 
          [(ngModel)]="citySearch" 
          placeholder="Buscar ciudad..."
          (keyup.enter)="searchWeather()"
          class="search-input">
        <button (click)="searchWeather()" class="search-btn">🔍 Buscar</button>
      </div>
    </div>
  `,
  styleUrls: ['./weather.css']
})
export class WeatherComponent implements OnInit {
  weatherData: WeatherData| null = null;
  loading = false;
  error = '';
  citySearch = '';

  constructor(private weatherService: WeatherService) {
    console.log(' WeatherComponent construido');
  }

  ngOnInit() {
    console.log(' ngOnInit ejecutado');
    this.getDefaultWeather();
  }

  getDefaultWeather() {
    console.log(' Llamando a getWeather para Lima, Perú...');
    this.loading = true;
    this.error = '';
    this.weatherData = null;

    this.weatherService.getWeather('Lima', 'pe').subscribe({
      next: (data: any) => {
        console.log(' Datos recibidos de la API:', data);
        this.weatherData = this.transformWeatherData(data);
        this.loading = false;
        console.log(' Datos transformados:', this.weatherData);
      },
      error: (err: any) => {
        console.error(' Error en la API:', err);
        console.error(' Detalles del error:', err.message, err.status);
        this.error = `Error: ${err.message || 'No se pudo cargar el clima'}`;
        this.loading = false;
      },
      complete: () => {
        console.log(' Llamada a API completada');
      }
    });
  }

  searchWeather() {
  if (!this.citySearch || this.citySearch.trim() === '') {
    this.error = 'Por favor ingresa una ciudad antes de buscar.';
    return;
  }

  console.log('🔍 Buscando ciudad:', this.citySearch);
  this.loading = true;
  this.error = '';

  this.weatherService.getWeather(this.citySearch, '').subscribe({
    next: (data: any) => {
      this.weatherData = this.transformWeatherData(data);
      this.loading = false;
    },
    error: (err: any) => {
      this.error = 'Ciudad no encontrada';
      this.loading = false;
    }
  });
}


  private transformWeatherData(data: any): WeatherData {
    console.log(' Transformando datos...', data);
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      windSpeed: data.wind.speed
    };
  }
}