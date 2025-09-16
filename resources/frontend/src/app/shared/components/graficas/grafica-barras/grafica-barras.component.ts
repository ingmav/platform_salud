import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RestService } from 'src/app/shared/rest/rest.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Chart, ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';

@Component({
  selector: 'app-grafica-barras',
  standalone: true,
  imports: [ChartModule, SharedModule],
  templateUrl: './grafica-barras.component.html',
  styleUrl: './grafica-barras.component.css'
})
export class GraficaBarrasComponent implements OnInit {

  @Input() Title?: string = "";
  @Input() SubTitle?: string = "";
  @Input() yTitle?: string = "";
  @Input() xTitle?: string = "";
  @Input() API?: string = "";
  @Input() data?: any = { catagorias: [], datos: [] };
  chart: any;
  chartAcumulado: any;

  dataDetalle: any = [];
  dataColumn: number[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  meses = ['', 'ENEREO', "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBTE"];
  datosDetalle: any = [{ name: "INFORMACIÓN", type: "column", colorByPoint: true, data: [] }];
  drill: any = [];

  constructor(private rest: RestService) { }
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cargarData();

  }
  cargarData() {
    return this.rest.get(this.API, {}).subscribe({
      next: (response: any) => {
        let datos = { categorias: [], data: [] };
        let info = response.data;
        info.forEach(element => {
          datos.categorias.push(element.descripcion)
          datos.data.push({ name: element.descripcion, type: 'column', data: [] });
          let index = (datos.data.length - 1);
          datos.data[index].data.push(parseFloat((element.cantidad == null) ? 0 : element.cantidad));

        });

        let detalle = response.detalle;
        let obj_drill: any = [];
        detalle.forEach(element => {
          if (parseInt(element.mes) > 0) {
            let index = this.datosDetalle[0].data.findIndex(x => x.name == this.meses[element.mes] + " " + element.anio);
            if (index == -1) {
              this.datosDetalle[0].data.push({ name: this.meses[element.mes] + " " + element.anio, y: element.cantidad, drilldown: this.meses[element.mes] + " " + element.anio });

              obj_drill.push({ name: this.meses[element.mes] + " " + element.anio, id: this.meses[element.mes] + " " + element.anio, type: "column", data: [{ type: "column", name: element.registro, y: element.cantidad }] });

            } else {
              this.datosDetalle[0].data[index].y += parseInt(element.cantidad);
              /** Segundo nivel */
              //let index_niv_2 = this.obj_drill[0].data.findIndex(x => x.name == this.meses[element.mes] + " " + element.anio);
            }

          }


        });

        this.cargarGrafico(datos);
        this.cargarGraficoAcumulado(this.datosDetalle);

        this.dataDetalle = response.ultimo;
      }
    });
  }

  cargarGrafico(obj) {
    this.chart = new Chart({
      chart:
      {
        type: 'column'
      },
      title: {
        text: this.Title
      },
      subtitle: {
        text: this.SubTitle
      },
      yAxis: {
        title: {
          text: this.yTitle
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: true
          },
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          }
        }
      },
      series:
        obj.data
    });
  }
  cargarGraficoAcumulado(obj, drill?) {
    this.chartAcumulado = new Chart({
      chart:
      {
        type: 'column'
      },
      title: {
        text: this.Title
      },
      subtitle: {
        text: this.SubTitle
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: this.yTitle
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: true
          },
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: ' +
          '<b>{point.y:.0f}</b><br/>'
      },
      series: [
        {
          type: "column",
          name: 'Browsers',
          colorByPoint: true,
          data: [
            {
              name: 'Chrome',
              y: 63.06,
              drilldown: 'Chrome'
            },
            {
              name: 'Safari',
              y: 19.84,
              drilldown: 'Safari'
            },
            {
              name: 'Firefox',
              y: 4.18,
              drilldown: 'Firefox'
            },
            {
              name: 'Edge',
              y: 4.12,
              drilldown: 'Edge'
            },
            {
              name: 'Opera',
              y: 2.33,
              drilldown: 'Opera'
            },
            {
              name: 'Internet Explorer',
              y: 0.45,
              drilldown: 'Internet Explorer'
            },
            {
              name: 'Other',
              y: 1.582,
              drilldown: null
            }
          ]
        }
      ],
      drilldown: {
        breadcrumbs: {
          position: {
            align: 'right'
          }
        },
        series:  [
          {
            type: "column",
            name: 'Chrome',
            id: 'Chrome',
            data: [
              [
                'v65.0',
                0.1
              ],
              [
                'v64.0',
                1.3
              ],
              [
                'v63.0',
                53.02
              ],
              [
                'v62.0',
                1.4
              ],
              [
                'v61.0',
                0.88
              ],
              [
                'v60.0',
                0.56
              ],
              [
                'v59.0',
                0.45
              ],
              [
                'v58.0',
                0.49
              ],
              [
                'v57.0',
                0.32
              ],
              [
                'v56.0',
                0.29
              ],
              [
                'v55.0',
                0.79
              ],
              [
                'v54.0',
                0.18
              ],
              [
                'v51.0',
                0.13
              ],
              [
                'v49.0',
                2.16
              ],
              [
                'v48.0',
                0.13
              ],
              [
                'v47.0',
                0.11
              ],
              [
                'v43.0',
                0.17
              ],
              [
                'v29.0',
                0.26
              ]
            ]
          },
          {
            type: "column",
            name: 'Firefox',
            id: 'Firefox',
            data: [
              [
                'v58.0',
                1.02
              ],
              [
                'v57.0',
                7.36
              ],
              [
                'v56.0',
                0.35
              ],
              [
                'v55.0',
                0.11
              ],
              [
                'v54.0',
                0.1
              ],
              [
                'v52.0',
                0.95
              ],
              [
                'v51.0',
                0.15
              ],
              [
                'v50.0',
                0.1
              ],
              [
                'v48.0',
                0.31
              ],
              [
                'v47.0',
                0.12
              ]
            ]
          },
          {
            type: "column",
            name: 'Internet Explorer',
            id: 'Internet Explorer',
            data: [
              [
                'v11.0',
                6.2
              ],
              [
                'v10.0',
                0.29
              ],
              [
                'v9.0',
                0.27
              ],
              [
                'v8.0',
                0.47
              ]
            ]
          },
          {
            type: "column",
            name: 'Safari',
            id: 'Safari',
            data: [
              [
                'v11.0',
                3.39
              ],
              [
                'v10.1',
                0.96
              ],
              [
                'v10.0',
                0.36
              ],
              [
                'v9.1',
                0.54
              ],
              [
                'v9.0',
                0.13
              ],
              [
                'v5.1',
                0.2
              ]
            ]
          },
          {
            type: "column",
            name: 'Edge',
            id: 'Edge',
            data: [
              [
                'v16',
                2.6
              ],
              [
                'v15',
                0.92
              ],
              [
                'v14',
                0.4
              ],
              [
                'v13',
                0.1
              ]
            ]
          },
          {
            type: "column",
            name: 'Opera',
            id: 'Opera',
            data: [
              [
                'v50.0',
                0.96
              ],
              [
                'v49.0',
                0.82
              ],
              [
                'v12.1',
                0.14
              ]
            ]
          }
        ]
      }
    });
  }
}

