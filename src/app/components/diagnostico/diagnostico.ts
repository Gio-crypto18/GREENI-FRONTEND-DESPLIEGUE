import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Diagnosticolistar } from './diagnosticolistar/diagnosticolistar';
import { CommonModule } from '@angular/common';
import { PlantIdentifierComponent } from "../apidiagnostico/apidiagnostico";
import { MatIcon } from '@angular/material/icon';
import { Diagnosticorinsertar } from './diagnosticorinsertar/diagnosticorinsertar';

@Component({
  selector: 'app-diagnostico',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './diagnostico.html',
  styleUrl: './diagnostico.css',
})
export class Diagnostico {
constructor(public route:ActivatedRoute) {}


}
