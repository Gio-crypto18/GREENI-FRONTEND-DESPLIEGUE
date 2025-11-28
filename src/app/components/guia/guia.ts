import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router'; // Agregar imports


@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule],
  templateUrl: './guia.html',
  styleUrls: ['./guia.css']
})
export class GuidesComponent  {
 
constructor(public route:ActivatedRoute){}

}