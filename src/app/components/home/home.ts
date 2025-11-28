import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { WeatherComponent } from '../weather/weather';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MensajesapiService } from '../../services/mensajerandomservice';
import { CommonModule } from '@angular/common';
import { Loginservice } from '../../services/loginservice';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WeatherComponent, RouterModule, MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatChipsModule,
    MatExpansionModule,
    MatTabsModule,CommonModule ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
     role: string = '';
  constructor(
    private motivacionalService: MensajesapiService,
    private router: Router,
    private loginService: Loginservice
  ) {}
fraseMotivacional: string = '';

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
  this.mostrarFraseMotivacional();
if (this.loginService.verificar()) {
    this.role = this.loginService.showRole();
    }
}


  plantStats = [
    {
      label: 'Plantas registradas',
      subtitle: 'Total en tu jardín',
      value: 6,
      icon: 'local_florist',
      progress: 100,
    },
    {
      label: 'Con riego pendiente',
      subtitle: 'Para hoy y mañana',
      value: 3,
      icon: 'opacity',
      progress: 60,
    },
    {
      label: 'En observación',
      subtitle: 'Revisar hojas y plagas',
      value: 2,
      icon: 'bug_report',
      progress: 40,
    },
  ];
  healthGuides = [
    {
      icon: '💧',
      title: 'Detectar falta de riego',
      badge: 'Riego',
      description:
        'Introduce un dedo en la tierra unos 2 cm. Si está seca y se deshace fácil, es momento de regar.'
    },
    {
      icon: '🚿',
      title: 'Señales de exceso de agua',
      badge: 'Humedad',
      description:
        'Hojas amarillas y tierra encharcada indican exceso de riego. Deja secar el sustrato antes del siguiente riego.'
    },
    {
      icon: '🐛',
      title: 'Cuidado con las plagas comunes',
      badge: 'Plagas',
      description:
        'Si ves puntos, manchas o telitas, revisa el envés de las hojas y limpia con agua jabonosa suave.'
    }
  ];

  todaySummary = {
    tasks: 3,
    warnings: 1,
  };

  weekSummary = {
    waterings: 8,
    fertilizations: 2,
    newPlants: 1,
  };

  monthSummary = {
    healthPercent: 87,
  };

  upcomingDisplayedColumns: string[] = ['task', 'plant', 'date'];

  upcomingTasks = [
    { task: 'Revisar humedad del suelo', plant: 'Monstera', date: 'Hoy' },
    { task: 'Aplicar fertilizante líquido', plant: 'Suculentas', date: 'Mañana' },
    { task: 'Limpiar hojas secas', plant: 'Helecho', date: 'En 2 días' },
  ];
  toggleSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    }
  }

  
mostrarFraseMotivacional(): void {
  const yaMostrada = sessionStorage.getItem('motivacionMostrada');

  this.fraseMotivacional = this.motivacionalService.obtenerFraseAleatoria();

  if (!yaMostrada) {
    sessionStorage.setItem('motivacionMostrada', 'true');
  }
}

}
