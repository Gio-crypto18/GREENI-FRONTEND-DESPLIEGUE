import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Rollistar } from './rollistar/rollistar';


@Component({
  selector: 'app-rol',
  imports: [RouterOutlet,Rollistar],
  templateUrl: './rol.html',
  styleUrl: './rol.css',
})
export class Rol {
constructor(public route:ActivatedRoute) {}
}
