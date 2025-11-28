import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Interaccionservice } from '../../services/interaccionservice';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-top-interaccion',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './top-interaccion.html',
  styleUrl: './top-interaccion.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class TopInteraccion implements OnInit {

  hasData = false;
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y', 
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'right',
        formatter: (value: number, context: any) => {
          const dataset = context.chart.data.datasets[0].data;
          const totalSum = dataset
            .filter((v: any): v is number => typeof v === 'number')
            .reduce((sum: number, v: number) => sum + v, 0);

          const valNum = typeof value === 'number' ? value : 0;
          const porcentaje = totalSum > 0 ? (valNum / totalSum) * 100 : 0;
          return `${valNum} (${porcentaje.toFixed(2)}%)`; 
        }
      }
    }
  };
     barChartType:  'bar' = 'bar'; 
     barChartLegend = false;
     barChartLabels: string[] = [];
     barChartData: ChartDataset<'bar'>[] = [];
     barChartPlugins = [ChartDataLabels]
     constructor(private iS: Interaccionservice) { }

  ngOnInit(): void {
    this.iS.top().subscribe(data => {
      if (data.length > 0) {
        this.hasData = true;
        

        this.barChartLabels = data.map(item => item.tipoInteraccion);
        this.barChartData = [
          {
            data: data.map(item => item.totalInteracciones),
            label: 'Total Interacciones',
            backgroundColor: ['#2e7d32', '#43a047', '#66bb6a', '#81c784']
          }
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
