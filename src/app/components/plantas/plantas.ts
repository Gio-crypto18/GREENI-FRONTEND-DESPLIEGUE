import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from "../chatbot/chatbot";
import { ReactiveFormsModule } from '@angular/forms'; 
import { Plantainsertar } from "./plantainsertar/plantainsertar";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './plantas.html',
  styleUrl: './plantas.css',
})
export class Planta {
constructor(public route:ActivatedRoute) {}

}



