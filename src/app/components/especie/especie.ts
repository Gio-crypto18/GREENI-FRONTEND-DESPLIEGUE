import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Especielistar } from './especielistar/especielistar';

@Component({
  selector: 'app-especie',
  imports: [RouterOutlet,Especielistar],
  templateUrl: './especie.html',
  styleUrl: './especie.css',
})
export class Especie {
 constructor(public route:ActivatedRoute) {}
}
