import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WeatherData } from '../../models/weather';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiKey: string = '8268328e05f604b61b36772ae0075bed';
  

  private NETLIFY_PROXY_BASE = '/api-weather'; 

  constructor(private httpClient: HttpClient) {
  }


  getWeather(cityName: string, countryCode: string) {

    const url = `${this.NETLIFY_PROXY_BASE}/weather?&appid=${this.apiKey}&units=metric&q=${cityName},${countryCode}&lang=es`;

    return this.httpClient.get(url);
  }

  getWeatherByCity(city: string): Observable<WeatherData> {

    const url = `${this.NETLIFY_PROXY_BASE}/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;
    
    return this.httpClient.get<any>(url).pipe(
      map(data => this.transformWeatherData(data))
    );
  }


  private transformWeatherData(data: any): WeatherData {
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