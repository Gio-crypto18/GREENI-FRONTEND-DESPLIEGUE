import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { PlantaService } from '../../services/plantaservice';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cantidad-planta',
  imports: [BaseChartDirective,MatIconModule],
  templateUrl: './cantidad-planta.html',
  styleUrl: './cantidad-planta.css',
   providers: [provideCharts(withDefaultRegisterables())],
})
export class CantidadPlanta {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'radar';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  constructor(private dS: PlantaService) {}

   ngOnInit(): void {
    this.dS.getSum().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.nombrePlanta);
        this.barChartData=[
          {
            data:data.map(item=>item.quantityPlanta),
            label:'Cantidad de Plantas por Nombre ',
            backgroundColor:[
              '#f78cf9ff',
              '#ecf7acff',
              'rgba(128, 250, 222, 1)'
            ]
          }
        ]
      } else {
        this.hasData = false;
      }
    });
  }
}
