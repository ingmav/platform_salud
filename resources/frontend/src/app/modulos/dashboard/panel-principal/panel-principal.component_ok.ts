import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import 'highcharts/modules/drilldown';
import 'highcharts/modules/exporting';
import { Options, SeriesOptionsType } from 'highcharts';


@Component({
  selector: 'app-root',
  templateUrl: './panel-principal.component.html',
  styleUrl: './panel-principal.component.css',
})
export class PanelPrincipalComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  loading = true;

  
  ngAfterViewInit(): void {
    // Simula llamada a API con delay
    setTimeout(() => {
      this.initChart();
      this.loading = false;
    });
  }

  initChart() {
    // Series principales
    const mainSeries: SeriesOptionsType[] = [
      { name: 'Frutas', type: 'column', colorByPoint: true, data: [{ name: 'Frutas', y: 10, drilldown: 'frutas' }, { name: 'Verduras', y: 8, drilldown: 'verduras' }] }
    ];

    // Series drilldown
    const drilldownSeries: SeriesOptionsType[] = [
      { id: 'frutas', type: 'column', data: [['Manzanas', 4], ['Peras', 3], ['Plátanos', 3]] },
      { id: 'verduras', type: 'column', data: [['Zanahorias', 4], ['Lechuga', 2], ['Tomates', 2]] }
    ];

    // Opciones tipadas
    const chartOptions: Options = {
      chart: { type: 'column' },
      title: { text: 'Ventas por Categoría' },
      xAxis: { type: 'category' },
      yAxis: { title: { text: 'Total Ventas' } },
      legend: { enabled: false },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
      },
      series: mainSeries,
      drilldown: { series: drilldownSeries }
    };

    Highcharts.chart(this.chartContainer.nativeElement, chartOptions);
  }
}
