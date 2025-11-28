import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-guiafav',
  imports: [  RouterOutlet],
  templateUrl: './guiafav.html',
  styleUrl: './guiafav.css',
})
export class Guiafav {
constructor(public route:ActivatedRoute){}
}
