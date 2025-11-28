import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtRequestDTO } from "../models/jwtRequestDTO";
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})

export class Loginservice {
  
  private apiUrl = environment.apiUrl; 
  
constructor(private http: HttpClient) {}
  login(request: JwtRequestDTO) {
    return this.http.post(`${this.apiUrl}/login`, request); 
  }
  logout() {
  sessionStorage.removeItem('token');
  location.href = '/login'; // PRUEBA
  }
  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }
  showRole() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return null; 
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }

  





//logica del perfil de usuario:D
  getUsuarioCompleto(): Observable<any> {
    const token = sessionStorage.getItem('token');
    
    console.log(' Token enviado al backend:', token); 
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/usuarios/perfil`, { headers })
      .pipe(
        tap((userData: any) => {
          console.log(' Datos recibidos del backend:', userData);
          sessionStorage.setItem('userData', JSON.stringify(userData));
        }),
        catchError((error) => {
          console.error(' Error del backend:', error);
          console.error(' Status:', error.status);
          console.error(' Mensaje:', error.message);
          return throwError(error);
        })
      );
  }

  getUsuarioData(): any {
    const cachedData = sessionStorage.getItem('userData');
    if (cachedData) {
      const userData = JSON.parse(cachedData);
      console.log(' Datos desde cache:', userData);
      return userData;
    }

    let token = sessionStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    
    console.log(' Token decodificado:', decodedToken);
    
    return {
      id: decodedToken?.id,
      nombre: decodedToken?.nombre,
      email: decodedToken?.sub, 
      activo: decodedToken?.activo,
      fechaIni: decodedToken?.fechaIni,
      biografia: decodedToken?.biografia,
      notificaciones: decodedToken?.notificaciones,
      rol: decodedToken?.role
    };
  }
}
