import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DataPie } from 'src/app/core/data-pie';
import { ReporteService } from 'src/app/reportes/servicios/reporte.service';

@Component({
  selector: 'app-multiline-chart',
  templateUrl: './multiline-chart.component.html',
  styleUrls: ['./multiline-chart.component.css']
})
export class MultilineChartComponent implements OnInit {

  @Input () Title?:string = "";
  @Input () SubTitle?:string = "";
  @Input () Categorias?:Array<string> = [];
  @Input () Data?:Array<any> = [];
  @Input () Tipo?:number = 0;
  @Input () TimeDelay?:number = 0;
  
  data:Array<any> = [];
  colors:Array<any> = [];

  DataCategorias:Array<string> = [];
  DataPie:Array<DataPie> = [];
  arregloApertura:any = {color: '#791718', type:'column', name: 'ABIERTO',  data: []};
  arregloNoApertura:any = {color: '#CCCCCC', type:'column', name: 'NO ABIERTO',  data: []};
  arregloNoAbierto:any = {color: '#0d27aa', type:'column', name: 'NO APERTURA (IRREGULARIDAD)',  data: []};

  arregloEnviado:any = {color: '#791718', type:'column', name: 'ENVIADO',  data: []};
  arregloNoEnviado:any = {color: '#CCCCCC', type:'column', name: 'NO ENVIADO',  data: []};
  
  displayedColumns: string[] = ['distrito', 'abierto', 'cerrado', 'diferencia'];
  dataSource = [];

  chart:any; 
  
  constructor(private reporteService:ReporteService){}
  ngOnInit(): void {
    if(this.Tipo == 1)
    {
        this.cargaInicio();
    }else{
        this.cargarCierre();
    }
  }

  cargarCierre()
  {
    this.arregloEnviado.data = [];
    this.arregloNoEnviado.data = [];
    this.DataPie = [];
    this.reporteService.getDataPieCierre$(null).subscribe(
        response =>
          {
            let { data }= response;
            this.dataSource = data;
            data.forEach(element => {
              this.arregloEnviado.data.push(element.envio_informacion);
              this.arregloNoEnviado.data.push(element.sin_envio_informacion);
              this.DataCategorias.push('Distrito '+element.id+'');
  
            });
           
           this.DataPie.push(this.arregloEnviado); 
           this.DataPie.push(this.arregloNoEnviado); 
          
            this.cargarData(this.DataPie);
        });
  }

  cargaInicio()
  {
    this.reporteService.getDataCasillas$(null).subscribe(
        response =>
          {
            let { data }= response;
            let total = 0;
            
            data.forEach(element => {
              this.arregloApertura.data.push(element.abierto);
              this.arregloNoAbierto.data.push(element.no_abierto);
              this.arregloNoApertura.data.push(element.no_apertura);
              this.DataCategorias.push('Distrito '+element.id+'');
  
              total += element.abierto + element.no_abierto + element.no_apertura;
           });
           
           this.DataPie.push(this.arregloApertura); 
           this.DataPie.push(this.arregloNoAbierto); 
           this.DataPie.push(this.arregloNoApertura);
           this.cargarData(this.DataPie);
          
          }
          
      );
  }

  cargarData(data){
    this.Data.forEach(element => {
        this.colors.push(element.color);
    });
    this.chart = new Chart({
        chart: {
          type: 'column'
      },
      title: {
          text: this.Title
      },
      credits:
      {
          enabled:false
      }
      ,
      xAxis: {
        categories:this.DataCategorias,
        type: 'category',
        labels: {
            style: {
                fontSize: '8px',
                fontFamily: 'Verdana, sans-serif',
                textAlign:'center'
            },
          useHTML: true
        }
      },
      yAxis: {
          min: 0,
          title: {
              text: 'CASILLAS'
          },
          stackLabels: {
              enabled: true
          }
      },
      legend: {
          align: 'left',
          x: 70,
          verticalAlign: 'bottom',
          y: -20,
          //floating: true,
          backgroundColor: 'white',
          borderColor: '#CCC',
          borderWidth: 0,
          shadow: false
      },
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>TOTAL: {point.stackTotal}'
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true
              }
          }
      },
      series: data
      });

  }

}
