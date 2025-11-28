import { Component, OnInit } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { Recordatorioservice } from '../../services/recordatorioservice';
import { QuantityRecordatorioDTO } from '../../models/QuantityRecordatorioDTO';

@Component({
  selector: 'app-recordatorio-reporte',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './reportecantidadtiporecordatorio.html',
  styleUrl: './reportecantidadtiporecordatorio.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class ReportecantidoTipoRecordatorio implements OnInit {
 hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'radar'
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];

  constructor(private rS: Recordatorioservice) {}
  ngOnInit(): void {
  this.rS.getQuantity().subscribe((data) => {
    if (data.length > 0) {
      this.hasData = true;
      this.barChartLabels = data.map((item) => item.tipo); 
      this.barChartData = [
        {
          data: data.map(item => item.quantity),
          label: 'Cantidad de tipos de recordatorios', 
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
