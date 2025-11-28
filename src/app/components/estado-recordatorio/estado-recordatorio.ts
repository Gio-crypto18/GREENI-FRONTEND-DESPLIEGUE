import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Estadorecordatoriolistar } from './estadorecordatoriolistar/estadorecordatoriolistar';

@Component({
  selector: 'app-estado-recordatorio',
  imports: [RouterOutlet,Estadorecordatoriolistar],
  templateUrl: './estado-recordatorio.html',
  styleUrl: './estado-recordatorio.css',
})
export class EstadoRecordatorio {
constructor(public route:ActivatedRoute) {}
}
