import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

import * as DrilldownModule from 'highcharts/modules/drilldown';

// inicializar el módulo
(DrilldownModule as any)(Highcharts);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {

 
  
  chart = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Ventas por regiones'
    },
    subtitle: {
      text: 'Haz clic en las columnas para ver el detalle'
    },
    xAxis: {
      type: 'category'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [
      {
        type: 'column',
        name: 'Regiones',
        colorByPoint: true,
        data: [
          {
            name: 'América',
            y: 50,
            drilldown: 'america'
          },
          {
            name: 'Europa',
            y: 40,
            drilldown: 'europa'
          },
          {
            name: 'Asia',
            y: 60,
            drilldown: 'asia'
          }
        ]
      }
    ],
    drilldown: {
      series: [
        {
          type:"column",
          id: 'america',
          name: 'Países América',
          data: [
            ['México', 20],
            ['EE.UU.', 15],
            ['Brasil', 15]
          ]
        },
        {
          type:"column",
          id: 'europa',
          name: 'Países Europa',
          data: [
            ['España', 18],
            ['Francia', 12],
            ['Alemania', 10]
          ]
        },
        {
          type:"column",
          id: 'asia',
          name: 'Países Asia',
          data: [
            ['China', 30],
            ['Japón', 20],
            ['India', 10]
          ]
        }
      ]
    }
  });
}
