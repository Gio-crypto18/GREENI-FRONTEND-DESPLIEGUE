import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlantIdentifierComponent } from "../apidiagnostico/apidiagnostico";
import { MatIcon } from '@angular/material/icon';
import { Diagnosticolistar } from '../diagnostico/diagnosticolistar/diagnosticolistar';
import { Loginservice } from '../../services/loginservice';
import { Reportecantidaddiagnostico } from '../reportecantidaddiagnostico/reportecantidaddiagnostico';

@Component({
  selector: 'app-diagnostico',
  imports: [CommonModule, PlantIdentifierComponent, RouterLink,Reportecantidaddiagnostico],
  templateUrl: './diagnosticozona.html',
  styleUrl: './diagnosticozona.css',
})
export class Diagnosticozona {
constructor(public route:ActivatedRoute,private loginService: Loginservice) {}

 role: string = '';

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
