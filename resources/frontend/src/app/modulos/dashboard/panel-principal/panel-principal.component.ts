import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import 'highcharts/modules/drilldown';
import 'highcharts/modules/exporting';
import { Options, SeriesOptionsType } from 'highcharts';
import { RestService } from 'src/app/shared/rest/rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './panel-principal.component.html',
  styleUrl: './panel-principal.component.css',
})
export class PanelPrincipalComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @ViewChild('chartDetalle', { static: false }) chartDetalle!: ElementRef;
  loading = true;

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

  ngAfterViewInit(): void {
    // Simula llamada a API con delay
    setTimeout(() => {
      this.cargarData();
      this.loading = false;
    });
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
              obj_drill.push(
                {
                  name: this.meses[element.mes] + " " + element.anio, id: this.meses[element.mes] + " " + element.anio, type: "column",
                  data: [{ type: "column", name: element.registro, drilldown: element.registro, y: parseInt(element.cantidad) }]
                });

              obj_drill.push(
                {
                  name: element.registro, id: element.registro, type: "column",
                  data: [{ type: "column", name: element.departamento, drilldown: element.registro+" "+element.departamento, y: parseInt(element.cantidad) }]
                });
              
                //console.log(element.departamento, element.subtema, element.cantidad);
                obj_drill.push(
                {
                  name: element.departamento, id: element.registro+" "+element.departamento, type: "column",
                  data: [{ type: "column", name: element.subtema, y: parseInt(element.cantidad) }]
                });
            } else {
              this.datosDetalle[0].data[index].y += parseInt(element.cantidad);
              /** Segundo nivel */

              let index_niv_2 = obj_drill.findIndex(x => x.name == this.meses[element.mes] + " " + element.anio);
              if (index_niv_2 != -1) {
                let index_2 = obj_drill[index_niv_2].data.findIndex(x => x.name == element.registro);
                if (index_2 != -1) {
                  obj_drill[index_niv_2].data[index_2].y += parseInt(element.cantidad);
                } else {
                  obj_drill[index_niv_2].data.push({ type: "column", name: element.registro, y: parseInt(element.cantidad), drilldown: element.registro });
                }
              }

              let index_3 = obj_drill.findIndex(x => x.id == element.registro);
              if (index_3 != -1) {
                let index_4 = obj_drill[index_3].data.findIndex(x => name == element.departamento);
                if (index_4 != -1) {
                  obj_drill[index_3].data[index_4].y += parseInt(element.cantidad);
                } else {
                  obj_drill[index_3].data.push({ type: "column", name: element.departamento, drilldown: element.registro+" "+element.departamento, y: parseInt(element.cantidad) });
                }
              } else {
                obj_drill.push(
                  {
                    name: element.registro, id: element.registro, type: "column",
                    data: [{ type: "column", name: element.departamento, drilldown: element.registro+" "+element.departamento, y: parseInt(element.cantidad) }]
                  });
              }
              
              let index_5 = obj_drill.findIndex(x => x.id == element.registro+" "+element.departamento);
              if (index_5 != -1) {
                let index_6 = obj_drill[index_5].data.findIndex(x => name == element.subtema);
                if (index_6 != -1) {
                  obj_drill[index_5].data[index_6].y += parseInt(element.cantidad);
                } else {
                  obj_drill[index_5].data.push({ type: "column", name: element.subtema, y: parseInt(element.cantidad) });
                }
              } else {
                obj_drill.push(
                  {
                    name: element.departamento, id: element.registro+" "+element.departamento, type: "column",
                    data: [{ type: "column", name: element.subtema, y: parseInt(element.cantidad) }]
                  });
              }


            }
          }
        });
        
         this.cargarGrafico(datos);
         this.cargarGraficoAcumulado(this.datosDetalle, obj_drill);

        this.dataDetalle = response.ultimo;
      }
    });
  }

  cargarGrafico(obj) {
    this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
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
    this.chartAcumulado = Highcharts.chart(this.chartDetalle.nativeElement, {
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
      drilldown: {
        series: drill
        // series: [{
        //   id: 'animals',
        //   type: "column",
        //   data: [
        //       { name: 'Cats2', y: 4, drilldown:"prueba" },
        //       { name: 'dog2', y: 4, drilldown:"prueb2" },
        //   ]
        // }, {
        //   id: 'ABRIL 2025',
        //   type: "column",
        //   data: [
        //     {
        //       name:"2025-10-09",
        //       drilldown:"2025-10-09",
        //       y:10
        //     }
        //   ]
        // }, {
        //   id: '2025-10-09',
        //   name:"PARENTAL",
        //   type: "column",
        //   data: [
        //     {
        //       name:"PARENTAL",
        //       drilldown:"PARENTAL CONOCIDO",
        //       y:5
        //     }
        //   ]
        // }, {
        //   id: 'PARENTAL CONOCIDO',
        //   name:"PARENTAL X",
        //   type: "column",
        //   data: [
        //     {
        //       name:"PARENTAL X",
        //       y:3
        //     }
        //   ]
        // }]
      }

      // drilldown:
      //   []

    });
  }


}
