import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-interaccion',
  imports: [RouterOutlet],
  templateUrl: './interaccion.html',
  styleUrl: './interaccion.css',
})
export class Interaccion {
constructor(public route:ActivatedRoute){}
}
