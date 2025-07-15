import { LOGOS } from "../../logos";

export class ReporteInventario{

    getDocumentDefinition(reportData:any) {
        let fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());

        let label_titulo:string = 'LA TRIGUEÑA';
        
        function numberFormat(num, prices:boolean = false) {
          //return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          var str = num.toString().split(".");
          str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          if(prices){
            return '$ ' +str.join(".");
          }else{
            return str.join(".");
          }
        }

        let datos:any  = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
          pageMargins: [ 30, 60, 30, 60 ],
          header: {
            margin: [30, 10, 30, 0],
            table: {
              headerRows: 0,
              widths:[80,'*',80],
              body: [
                [
                  { image: LOGOS[3].LOGO_TRIGUENA, width: 60,   style: "encabezado_principal", rowSpan:3 },
                  { text:'',   style: "encabezado_principal" },
                  { text:'',   style: "encabezado_principal" }
                ],
                [
                  { text:'' },
                  { text: 'PLATAFORMA INVENTARIO DE HIGIENE',        style: "encabezado_principal" },
                  { text:'' },
                ],
                [
                  { text:'' },
                  { text: label_titulo,             style: "encabezado_principal" },
                  { text:'' },
                ]
              ]
            },
            layout: 'noBorders'
          },
          footer: function(currentPage, pageCount) {
            return {
              margin: [30, 20, 30, 0],
              widths:['auto','*','auto'],
              table:{
                headerRows: 0,
                widths:['*','auto','*'],
                body:[
                  [
                    {
                      table: {
                        headerRows: 0,
                        widths:['*'],
                        body: [
                          [
                            {
                                text: 'La trigueña'+location.origin,
                                alignment:'left',
                                noWrap:false,
                                fontSize: 6,
                            },
                          ],
                        ]
                      },
                      layout: 'noBorders'
                    },
                    {
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 6,
                      alignment: 'center'
                    },
                    {
                      table: {
                        headerRows: 0,
                        heights: [2,10],
                        widths:['*'],
                        body: [
                          [{
                            text: fecha_hoy.toString(),
                            alignment:'right',
                            fontSize: 6,
                          }],
                          [{
                            text: 'OFICINA',
                            alignment:'right',
                            fontSize: 4,
                          }],
                        ]
                      },
                      layout: 'noBorders'
                    },
                  ]
                ]
              },
              layout: 'noBorders'
            }
          },
          content: [],
          styles: {
            encabezado_detalles:{
              fontSize: 7,
              lineHeight: 0.5,
            },
            encabezado_principal: {
              fontSize: 7,
              bold: true,
              alignment:"center",
              lineHeight: 0.5,
              characterSpacing: 1,
            },
            cabecera: {
              fontSize: 5,
              bold: true,
              fillColor:"#363535",
              color: "white",
              alignment:"center"
            },
            tabla_datos:{
              fontSize: 6
            },
            tabla_datos_center:{
              fontSize: 6,
              alignment: "center"
            },
            tabla_datos_right:{
              fontSize: 6,
              alignment: "right"
            },
            detalles_title:{
              alignment:"right",
              fontSize: 6,
              bold:true,
              noWrap:true,
            },
            detalles_title_center:{
              alignment:"center",
              fillColor:"#DEDEDE",
              fontSize: 6,
              bold:true
            },
            detalles_datos:{
              fontSize: 6
            },
            datos_encabezado_izquierda:{
              fontSize: 8,
              color:"black",
            },
            tabla_encabezado_firmas:{
              fontSize: 8,
              alignment:"center",
              bold:true
            },
            tabla_encabezado_datos:{
              fontSize: 8,
              alignment:"center",
            }
          }
        };

        let encabezado_lista = [
            {text: "#",               style: 'cabecera'},
            {text: "ARTÍCULO",               style: 'cabecera'},
            {text: "MARCA / MODELO / TALLA",                     style: 'cabecera'},
            {text: "INVENTARIO",                style: 'cabecera'},
            //{text: "FOTO",                      style: 'cabecera'},
            {text: "ULTIMO MOVIMIENTO",         style: 'cabecera'},
        ];

        let table_widths = [10, 'auto', 'auto', 'auto'/*, 'auto'*/, 'auto'];
        
        datos.content.push({
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: table_widths,
            margin: [0,0,0,0],
            body: [encabezado_lista]
          }
        });
        let index_table = datos.content.length-1;

        let registros:any[] = reportData.items;
       
        let total:number = registros.length;
        for(let i = 0; i < total; i++){
            let item  = registros[i];

            item.update =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(item.updated_at));
            item.foto = item.extension!=null?'SI':'NO';
            item.unidad = item.catalogo_unidad_id!=0?item.unidad.abreviatura:'';
            let item_pdf = [
                { text: (i+1),                          style: 'tabla_datos_center' },
                { text: item.descripcion,               style: 'tabla_datos'        },
                { text: item.marca+" / "+item.modelo+" / "+item.talla,           style: 'tabla_datos'        },
                { text: item.inventario+" "+item.unidad,                style: 'tabla_datos_center' },
                //{ text: item.foto,          style: 'tabla_datos'        },
                { text: item.update,        style: 'tabla_datos_center' },
            ];

            datos.content[index_table].table.body.push(item_pdf);
        }      
        return datos;
    }
}