import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { ReportWorker } from 'src/app/web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/app/auth/auth.service';
import { RestService } from 'src/app/shared/rest/rest.service';
import { AddInformacionComponent } from '../add-informacion/add-informacion.component';

@Component({
  selector: 'app-lista-informacion',
  standalone: false,
  templateUrl: './lista-informacion.component.html',
  styleUrl: './lista-informacion.component.css'
})
export class ListaInformacionComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private rest: RestService
  ) { }

  isLoadingResults: boolean;
  isLoadingPDF: boolean;

  searchQuery: string;
  listaCatalogos:any;

  pageSize: number = 50;
  displayedColumns: string[] = ['NOMBRE', 'DEPARTAMENTO', 'ARCHIVO', 'VISTA', 'CREADO_AL'];
  resultsLength = 0;
  data: any;

  ngOnInit(): void {
    this.data = [];
    this.searchQuery = '';

    setTimeout(() => {
      this.applySearch();
    }, 10);
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.rest.get("user-temas", {}).subscribe(
      response => {
        this.listaCatalogos = response.data;
      }
    );
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.console.log('this.paginator.pageIndex = 0')
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.applySearch();
    });

    this.paginator.page.subscribe(() => {
      if (this.pageSize != this.paginator.pageSize) {
        this.paginator.pageIndex = 0;
        this.pageSize = this.paginator.pageSize;
      }
      this.applySearch();
    });
  }

  cleanSearch() {
    this.searchQuery = '';
  }

  applySearch() {
    this.isLoadingResults = true;
    let params: any = {
      sort: this.sort.active,
      direction: this.sort.direction,
      page: this.paginator.pageIndex + 1,
      per_page: this.paginator.pageSize,
      query: this.searchQuery,
    };

    this.data = [];

    return this.rest.get("informacion", params).subscribe({
      next: (response: any) => {
        this.isLoadingResults = false;
        this.resultsLength = response.data.total;
        this.data = response.data.data;
      },
      error: (response: any) => {
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });
  }


  eliminarRegistro(id) {
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: { title: 'ELIMINAR', message: "¿DESEA ELIMINAR EL REGISTRO?", hasOKBtn: true, btnColor: "warn" }
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if (reponse) {
        this.rest.delete("informacion", id).subscribe(
          response => {
            this.applySearch();
          }
        );
      }
    });
  }


  openDialogUser(obj?) {
    let dialogConfig: any = {
      maxWidth: '100%',
      width: '40%',
      height: '550px',
      disableClose: true,
      data: { id:0, catalogos: this.listaCatalogos }
    };

    if (obj) {
      dialogConfig.data = obj;
      dialogConfig.data.catalogos = this.listaCatalogos;
    }

    const dialogRef = this.dialog.open(AddInformacionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applySearch();
      }
    });

  }

  cargarDocumento(obj) {

    /* Cargando pdf */
    this.rest.get_file("documento", obj.id).subscribe(
      response => {
        const file = new Blob([response], { type: obj.type });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      responsError => {
        }
    );

  }


}
