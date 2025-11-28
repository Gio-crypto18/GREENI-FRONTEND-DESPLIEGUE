import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Usuarioservice } from '../../services/usuarioservice';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-giovanni-reporte',
  imports: [MatIconModule,BaseChartDirective],
  templateUrl: './giovanni-reporte.html',
  styleUrl: './giovanni-reporte.css',
    providers: [provideCharts(withDefaultRegisterables())],
})
export class GiovanniReporte implements OnInit {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];

   constructor(private uS: Usuarioservice) {}

ngOnInit(): void {
    this.uS.getQuantity().subscribe((data) => {

      
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.rol);
        this.barChartData=[
          {
            data:data.map(item=>item.cantidadUsuarios),
            label:'Cantidad de usuarios por rol',
            
            backgroundColor:[
              '#a10ac6ff',
              '#f4bb00ff',
              'rgba(35, 166, 9, 1)'
            ]
          }
        ]
      } else {
        this.hasData = false;
      }
    });
  }
}
