import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Tipointeraccionlistar } from './tipointeraccionlistar/tipointeraccionlistar';

@Component({
  selector: 'app-tipo-interaccion',
  imports: [RouterOutlet,Tipointeraccionlistar],
  templateUrl: './tipo-interaccion.html',
  styleUrl: './tipo-interaccion.css',
})
export class TipoInteraccion {
 constructor(public route:ActivatedRoute) {}
}
