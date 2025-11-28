import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { Especieservice } from '../../services/especieservice';
@Component({
  selector: 'app-cantidad-especie',
  imports: [BaseChartDirective,MatIconModule],
  templateUrl: './cantidad-especie.html',
  styleUrl: './cantidad-especie.css',
   providers: [provideCharts(withDefaultRegisterables())],
})
export class CantidadEspecie {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'polarArea';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
    constructor(private sS: Especieservice) {}

      ngOnInit(): void {
    this.sS.getQuantity().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.nombreC);
        this.barChartData=[
          {
            data:data.map(item=>item.quantityEspecie),
            label:'Cantidad de Epecies por nombre',
            backgroundColor:[
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
