import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-medicion',
  imports: [RouterOutlet],
  templateUrl: './medicion.html',
  styleUrl: './medicion.css',
})
export class Medicion {
constructor(public route:ActivatedRoute){}
}
