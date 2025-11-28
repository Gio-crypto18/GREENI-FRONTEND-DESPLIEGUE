import { Component } from '@angular/core';
import { GiovanniReporte } from "../giovanni-reporte/giovanni-reporte";
import { GiovanniReporte2 } from "../giovanni-reporte2/giovanni-reporte2";
import { CantidadPlanta } from '../cantidad-planta/cantidad-planta';
import { CantidadEspecie } from '../cantidad-especie/cantidad-especie';
import { Reportevencimiento } from '../reportevencimiento/reportevencimiento';
import { Reportecantidaddiagnostico } from "../reportecantidaddiagnostico/reportecantidaddiagnostico";
import { TopInteraccion } from "../top-interaccion/top-interaccion";
import { Reporteresumen } from "../reporteresumen/reporteresumen";

import { Reportecantidadrecordatorioporestado } from "../reportecantidadrecordatorioporestado/reportecantidadrecordatorioporestado";
import { ReportecantidoTipoRecordatorio } from "../reportecantidadtiporecordatorio/reportecantidadtiporecordatorio";
import { RouterLink, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/select';




@Component({
  selector: 'app-reportes',
  imports: [ CantidadPlanta, CantidadEspecie, Reportevencimiento, TopInteraccion, Reporteresumen, Reportecantidadrecordatorioporestado, ReportecantidoTipoRecordatorio,RouterModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes {

}
