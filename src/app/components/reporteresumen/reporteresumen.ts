import { Component, OnInit } from '@angular/core';
import{ChartDataset, ChartOptions,ChartType} from 'chart.js';
import { Interaccionservice } from '../../services/interaccionservice';
import{BaseChartDirective, provideCharts, withDefaultRegisterables} from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-reporteresumen',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './reporteresumen.html',
  styleUrl: './reporteresumen.css',
  providers:[provideCharts(withDefaultRegisterables())],
})
export class Reporteresumen implements OnInit {

  hasData= false;
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  barChartType:'bar' = 'bar';
  barChartLegend = true;
  barChartLabels:string[]=[];
   barChartData: ChartDataset<'bar'>[] = [];
  constructor(private iS:Interaccionservice){}

  ngOnInit():void{
    this.iS.resumen().subscribe(data=>{
      if(data.length>0){
        this.hasData= true
        this.barChartLabels=data.map(item=>item.usuario);
        
        function convertirFechaADias(fechaStr: string): number {
        const fecha = new Date(fechaStr);
        const inicio = new Date("2025-01-01");
        const diffMs = fecha.getTime() - inicio.getTime();
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      const primeras = data.map(item => convertirFechaADias(item.primeraInteraccion));
      const ultimas = data.map(item => convertirFechaADias(item.ultimaInteraccion));

      
        this.barChartData=[
          {
          data: primeras,
          label: 'Primera Interacción (en días)',
          backgroundColor: '#55AAFF'
        },
        {
          data: ultimas,
          label: 'Última Interacción (en días)',
          backgroundColor: '#FFA726'
        }
        ];

      } else {
        this.hasData = false;
      }
    });
  }
}
