import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { Tratamientoservice } from '../../services/tratamientoservice';
@Component({
  selector: 'app-reportevencimiento',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './reportevencimiento.html',
  styleUrl: './reportevencimiento.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class Reportevencimiento {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  constructor(private tS: Tratamientoservice) {}

  ngOnInit(): void {
    this.tS.getvenci().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.nombre);
        this.barChartData = [
          {
            data: data.map((item) => item.dias),
            label: 'Días Restantes para Vencer',
            backgroundColor: ['#75ddfcff', '#aeacf7ff', 'rgba(252, 157, 117, 1)'],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
