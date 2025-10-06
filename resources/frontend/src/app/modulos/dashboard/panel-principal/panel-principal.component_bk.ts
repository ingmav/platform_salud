import { Component } from '@angular/core';
import { RestService } from 'src/app/shared/rest/rest.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts/highstock';

import HC_stock from 'highcharts/modules/stock';

@Component({
  selector: 'app-panel-principal',

  templateUrl: './panel-principal.component.html',
  styleUrl: './panel-principal.component.css'
})
export class PanelPrincipalComponent_bk {

  chart: any;
  chartAcumulado: any;

  dataDetalle: any = [];
  dataColumn: number[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  meses = ['', 'ENEREO', "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBTE"];
  datosDetalle: any = [{ name: "INFORMACIÓN", type: "column", colorByPoint: true, data: [] }];
  drill: any = [];

  Title: string = "ENVIO DE INFORMACIÓN GENERAL";
  SubTitle: string = "FUENTE: INFORMACIÓN TABASCO";
  API: String = "acumulado-departamento";
  yTitle: string = "CANTIDAD DE INFORMACIÓN ENVIADA";
 
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
      series: 
        obj,
        drilldown:
        drill

    });
  }
}
