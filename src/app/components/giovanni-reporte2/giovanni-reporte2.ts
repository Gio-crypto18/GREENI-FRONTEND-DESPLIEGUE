import { Component, OnInit } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Usuarioservice } from '../../services/usuarioservice';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-giovanni-reporte2',
  imports: [BaseChartDirective,MatIconModule],
  templateUrl: './giovanni-reporte2.html',
  styleUrl: './giovanni-reporte2.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class GiovanniReporte2 implements OnInit {
 hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'doughnut'
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];

  constructor(private uS: Usuarioservice) {}
  ngOnInit(): void {
  this.uS.getActive().subscribe((data) => {
    if (data.length > 0) {
      this.hasData = true;
      this.barChartLabels = data.map((item) => item.mes.toString()); 
      this.barChartData = [
        {
          data: data.map(item => item.cantidadUsuarios),
          label: 'Cantidad de usuarios activos por mes', 
          backgroundColor: [
            '#75ddfcff',
            '#aeacf7ff',
            'rgba(252, 157, 117, 1)'
          ]
        }
      ]
    } else {
      this.hasData = false;
    }
  });
}
}
