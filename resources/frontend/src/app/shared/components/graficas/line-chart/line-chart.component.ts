import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ReportServiceService } from './report-service.service';

import * as FileSaver from 'file-saver';
import { ReportWorker } from 'src/app/web-workers/report-worker';
import { ReporteService } from 'src/app/reportes/servicios/reporte.service';

export interface DialogData {
  id?: number;
  name: string;
  color?: string;
  votos?: number;
  y?: number;
}

@Component({
  selector: 'app-line-chart',

  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit{

  @Input () Title?:string = "";
  @Input () SubTitle?:string = "";
  @Input () Categorias?:Array<string> = [];
  //@Input () Data?:Array<any> = [];
  @Input () tipoReporte?:number;
  @Input () timeDelay?:number;
  
  data:Array<any> = [];
  colors:Array<any> = [];
  chart:any; 
  isLoading: boolean;
  isLoadingPDF:boolean;

  total_casillas:number = 0;
  total_votos:number = 0;
  casillas_cerradas:number = 0;
  casilla_motivo:number = 0;

  candidatosCierre:Array<DialogData> = [];

  constructor(private reportServiceService:ReportServiceService,private reporteService:ReporteService){}

  ngOnInit(): void {
    this.cargar();  
  }

  cargar(){
    this.candidatosCierre = [];
    this.reporteService.getDataCierre$(null).subscribe(
      response =>
        {
          let { data } = response;
          let { casillas } = response;

          this.total_votos = 0;
          this.total_casillas = casillas.total;
          this.casillas_cerradas = casillas.cerradas;
          this.casilla_motivo = casillas.cerradas_forzadas;
          let  data_candidatos = response.candidatos;
          let total = 0;
          
          
          data_candidatos.map(element => {
            
            this.candidatosCierre.push(
              {
                id:element.id,
                name: "<span style='font-size:9pt'>"+element.partido+"</span><br><span style='font-size:10pt'>"+element.primer_candidato+"</span><br> <span style='color:red; font-size:11pt'>VOTOS "+new Intl.NumberFormat('es-MX').format(element.conteo)+"<span>",
                color: element.color_1,
                votos: parseInt(element.conteo),
                y:0
              }
            );
            this.total_votos += parseInt(element.conteo);
          });
          this.candidatosCierre.map(element =>
            {
              let numero = new Intl.NumberFormat('es-MX', { maximumSignificantDigits: 3 }).format(element.votos);
              element.y = (element.votos / this.total_votos) * 100;
            }
          );
          this.cargarData(this.candidatosCierre)
          //console.log("-->data",this.candidatosCierre);
        }
    );
    
  }

  cargarData(datos){
    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      legend: {
        enabled: false
    },
    title: {
      text: this.Title
    },

      subtitle: {
        text: this.SubTitle,
        align: 'left'
    },

      xAxis: {
        type: 'category',
        labels: {
          autoRotation: [-45, -90],
          style: {
              fontSize: '10px',
              fontFamily: 'Verdana, sans-serif',
              textAlign:'center',
              fontWeight:'bold'
          },
          useHTML: true,
          
        }
      },
      yAxis:  {
        min:0,
        //max:100,
        title: { text: 'VOTOS (%)' }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.name} <br> ( <b style="color:red">{point.y:.2f} %</b> ) '
    },
    plotOptions: {
      series: {
          borderWidth: 0,
          dataLabels: {
              enabled: true,
              format: '<span style="font-size:12pt">{point.y:.1f}%</span>',
              useHTML:true
          }
      }
  },
      series:
      [
        {
          type:'column',  
          name: 'VOTOS',
          colorByPoint:true,  
          data: datos
          }
        ]
      });
  }
  
  reporte(){
   this.isLoadingPDF = true;
    let tipoReporte = this.tipoReporte;
    let titulo:Array<string> = ['','SENADOR', 'PRESIDENCIA', 'GOBERNADOR']; 
    this.reportServiceService.getData$({tipo: tipoReporte}).subscribe(
      response =>{
        
        if(response.error) {
          let errorMessage = response.error.message;
          this.isLoading = false;
          
        } else {
         
          const worker$ = new ReportWorker();
          //const worker = new ReportWorker();
           worker$.onmessage().subscribe(
             data => {
               console.log("no error",data.data);
              FileSaver.saveAs(data.data,'CIERRE DE CAMPAÑA');
              
              worker$.terminate();
             }
           );
 
           worker$.onerror().subscribe(
             (data) => {
               console.log("error",data);
               worker$.terminate();
             }
           );
 
           let datos =  [];
           let candidatos =  [];
           let total:number = 0;
           response.global.forEach(element => {
            candidatos.push(
              {
                id:element.id,
                candidato_1: element.primer_candidato,
                candidato_2: element.segundo_candidato,
                partido: element.partido,
              }
            );
            datos.push(
              {
                candidato: element.primer_candidato,
                partido: element.partido, 
                votos:element.votos, 
                percent:0
              });
            total += parseInt(element.votos);
           });

           datos.map((item)=> item.percent = ((item.votos / total) * 100).toFixed(2));
           datos.push(
            {
              candidato: '', 
              partido: 'TOTAL', 
              votos: total, 
              percent: ''
            });
          /* ------------ Desglose ----------------- */
            let datos_desglose = [];
            let municipio_id  =  0;
            let principal:Array<Object> = [];
            
            let { desglose } = response;
            let index = 0;
            let acumulado = 0;
            
            
          /*---------------------------------------- */
           
          worker$.postMessage({data:{items: datos, title:titulo[tipoReporte], items_desglose: desglose, candidatos: candidatos},reporte:'reporte/general'});
        }
        this.isLoading = false;
        this.isLoadingPDF = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.isLoading = false;
        this.isLoadingPDF = false;
        
      }
    );
  }
  
}
