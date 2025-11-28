import { Component } from '@angular/core';
import { GiovanniReporte } from "../giovanni-reporte/giovanni-reporte";
import { GiovanniReporte2 } from "../giovanni-reporte2/giovanni-reporte2";
import { RouterLink, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';





@Component({
  selector: 'app-reportes',
  imports: [GiovanniReporte, GiovanniReporte2,RouterLink,MatIcon,RouterModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class ReportesUsuario {

}
