import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartData, ChartOptions, ChartType, registerables } from 'chart.js';
import { BaseChartDirective, provideCharts } from 'ng2-charts';

import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { EstadoRecordatorioservice } from '../../services/estado_recordatorioservice';
import { CantidadRecordatorioPorEstadoDTO } from '../../models/CantidadRecordatorioPorEstadoDTO';

@Component({
  selector: 'app-reportecantidadrecordatorioporestado',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BaseChartDirective
  ],
  templateUrl: './reportecantidadrecordatorioporestado.html',
  styleUrl: './reportecantidadrecordatorioporestado.css',
  providers: [
    provideCharts({ registerables }),
    provideNativeDateAdapter()
  ],
})
export class Reportecantidadrecordatorioporestado implements OnInit {

  hasData = false;

  barChartOptions: ChartOptions = {
    responsive: true
  };

  barChartType: ChartType = 'doughnut';
  barChartLegend = true;

  barChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  constructor(private eS: EstadoRecordatorioservice) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.eS.getAmount().subscribe({
      next: (data: CantidadRecordatorioPorEstadoDTO[]) => {
        if (data && data.length > 0) {
          this.hasData = true;

          const labels = data.map(d => d.estado);
          const valores = data.map(d => d.cantidad);

          this.barChartData = {
            labels,
            datasets: [
              {
                data: valores,
                label: 'Cantidad por estado',
                backgroundColor: ['#4CAF50', '#E91E63', '#2196F3', '#FF9800', '#9C27B0']
              }
            ]
          };

        } else {
          this.hasData = false;
        }
      },
      error: (err) => {
        console.error("Error al cargar datos:", err);
        this.hasData = false;
      }
    });
  }

  getColor(index: number): string {
    const colors = ['#4CAF50', '#E91E63', '#2196F3', '#FF9800', '#9C27B0'];
    return colors[index % colors.length];
  }

  volver(): void {
    history.back();
  }
}
