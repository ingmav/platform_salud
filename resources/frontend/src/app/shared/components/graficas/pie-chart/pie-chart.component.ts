import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DataPie } from 'src/app/core/data-pie';
import { ReporteService } from 'src/app/reportes/servicios/reporte.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent implements OnInit{
  @Input () Title?:string = "";
  @Input () SubTitle?:string = "";
  @Input () Data?:Array<DataPie> = [];
  @Input () TimeDelay?:number = 0;
  @Input () Tipo?:number = 0;
  
  data:Array<any> = [];
  colors:Array<any> = [];
  dataPie:Array<any> = [];
  chart:any; 
  DataPieCierre:Array<DataPie> = [];
  DataPie:Array<DataPie> = [];

  DistritosCierre:Array<any> = [
    { name: 'NO ENVIADO', data:[0,0,0,0,0,0,0,0,0,0], color:"#CCCCCC"  },
    { name: 'ENVIADO', data:[0,0,0,0,0,0,0,0,0,0], color: "#791718" },
  ];

  constructor(private reporteService:ReporteService){}
  ngOnInit(): void {
    if(this.Tipo == 1)
    {
        this.cargarInicio();
    }else{
        this.cargarInformacion();
    }
    
  }  
  cargarInicio()
  {
    
    this.reporteService.getDataCasillas$(null).subscribe(
        response =>
          {
            let { data }= response;
            let total = 0;
            this.DataPie.push({ name : "APERTURA CORRECTA", y:0, cantidad:0, color:"#791718" });
            this.DataPie.push({ name : "SIN APERTURA", y:0, cantidad:0, color:"#CCCCCC" });
            this.DataPie.push({ name : "NO APERTURA (IRREGULARIDAD)", y:0, cantidad:0, color:"#0d27aa" });
  
            data.forEach(element => {
              total += element.abierto + element.no_abierto + element.no_apertura;
              this.DataPie[0].cantidad += element.abierto;
              this.DataPie[1].cantidad += element.no_apertura;
              this.DataPie[2].cantidad += element.no_abierto;
           });
           
           this.DataPie.map(
            element => {
              element.y = (element.cantidad / total) * 100;
            }
           );
           this.cargarData(this.DataPie);
        }
          
      );
  }

    cargarInformacion()
    {
      this.DataPieCierre = [];
        this.reporteService.getDataPie$(null).subscribe(
            response =>
              {
                let { data } = response;
                let  data_candidatos = response.candidatos;
                let total = 0;
                this.DataPieCierre.push({ name: "ENVIADO INFORMACIÓN", cantidad: 0, color: "#791718", y: 0 });
                this.DataPieCierre.push({ name: "SIN ENVIO INFORMACIÓN", cantidad: 0, color: "#CCCCCC", y: 0 });
                data.forEach(element =>
                  {
                    this.DataPieCierre[0].cantidad += element.envio_informacion;
                    this.DataPieCierre[1].cantidad += element.sin_envio_informacion;
                    total += element.envio_informacion + element.sin_envio_informacion;
                  }
                );
                this.DataPieCierre.map(element =>
                  {
                    element.y = (element.cantidad / total) * 100;  
                  }
                );
                this.cargarData(this.DataPieCierre);
                console.log("-->ver", this.DataPieCierre);
              }
          );
    }

    cargarData(data){
        this.chart = new Chart({
            chart: {
              type: 'pie'
            },
            title: {
                text: this.Title
            },
            subtitle: {
                text: this.SubTitle
            },
            credits:
            {
                enabled:false
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br> <b style="color:red">{point.votos:.0f}</b> <b>CANTIDAD</b> ( <b style="color:red">{point.cantidad:.0f} </b> ) '
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: [{
                        enabled: false,
                    }, {
                        enabled: true,
                        format: '{point.name} {point.percentage:.2f}%',
                        style: {
                            fontSize: '0.7em',
                            textOutline: 'none',
                            opacity: 0.7
                        }
                    }]
                }
            },
            series: [
                {
                  type: 'pie',
                    name: 'PORCENTAJE',         
                    colors: this.colors,
                    data: data
                }
            ]
          });        
    }
}
