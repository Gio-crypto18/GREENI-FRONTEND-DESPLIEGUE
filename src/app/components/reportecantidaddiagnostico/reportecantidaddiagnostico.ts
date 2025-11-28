import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartData, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Diagnosticoservice } from '../../services/diagnosticoservice';

@Component({
  selector: 'app-reportecantidaddiagnostico',
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reportecantidaddiagnostico.html',
  styleUrl: './reportecantidaddiagnostico.css',
  providers: [provideCharts(withDefaultRegisterables()), provideNativeDateAdapter()],
})
export class Reportecantidaddiagnostico implements OnInit {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'line';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];

  constructor(private dS: Diagnosticoservice) {}

  ngOnInit(): void {
    this.dS.getQuantity().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.severidad);
        this.barChartData = [
          {
            data: data.map((item) => item.quantity),
            label: 'Nivel de severidad',

            backgroundColor: [
              '#a10ac6ff', 
              '#f4bb00ff', 
              'rgba(35, 166, 9, 1)', 

              '#ff5733ff', 
              '#4287f5ff', 
              '#ff33a8ff', 
              '#33fff2ff', 

              '#8d33ffff', 
              '#33ff57ff', 
              'rgba(255, 102, 0, 1)', 
            ],
          },
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
