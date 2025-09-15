import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { RestService } from 'src/app/shared/rest/rest.service';
import { SharedModule } from 'src/app/shared/shared.module';

export interface DialogData {
  id: number;
  catalogos: number;
  sub_tema: any;
  catalogo_subtema_id: number;
  nombre_archivo: string;
  peso: string;
}

@Component({
  selector: 'app-add-informacion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-informacion.component.html',
  styleUrl: './add-informacion.component.css'
})
export class AddInformacionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddInformacionComponent>,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private rest: RestService
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  isLoading: boolean;
  isSaving: boolean;
  Form: FormGroup;
  changesDetected: boolean;
  destroyed = new Subject<void>();
  currentScreenSize: string;
  departamento: any = [];
  subtema: any = [];
  selectedFile: File | null = null;
  selectedFileName: string = '';
  ban_file: boolean = false;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);
  dialogMaxSize: boolean;

  resizeDialog() {
    if (!this.dialogMaxSize) {
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    } else {
      this.dialogRef.updateSize('80%', '60%');
      this.dialogMaxSize = false;
    }
  }

  cancelarAccion() {
    this.cerrar();
  }

  cerrar() {
    //this.dialogRef.close(this.savedData);
    this.dialogRef.close(true);
  }
  guardar() {
   
      this.rest.post_file("informacion", this.Form.value, this.selectedFile).subscribe(
        {
          next: (response) => { },
          error: (response) => { }
        }
      );
  }

  ngOnInit(): void {
    console.log("->", this.inData);
    this.changesDetected = false;
    this.Form = this.formBuilder.group({
      'id': [''],
      'departamento_id': ['', Validators.required],
      'catalogo_subtema_id': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'archivo': [''],

    });

    if (this.inData) {
      this.departamento = this.inData.catalogos;
      this.Form.patchValue({ id: this.inData.id, departamento_id: this.inData.sub_tema.catalogo_departamento_id });
      this.depto(this.inData.sub_tema.catalogo_departamento_id);
      this.Form.patchValue({ descripcion: this.inData.nombre_archivo });
      let obj = { name: this.inData.nombre_archivo, size: (parseFloat(this.inData.peso) * 1048576) }
      this.selectedFile = obj as File;
      this.ban_file = true;
    } else {
      this.departamento = this.inData.catalogos;
    }
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.selectedFileName = this.selectedFile.name;
      // You can now perform actions with the selected file, e.g., upload it
      //console.log('Selected file:', this.selectedFile);
      this.ban_file = true;
    } else {
      this.ban_file = false;
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }

  depto(value) {
    this.rest.get("sub-tema", { params: value }).subscribe(
      response => {
        this.subtema = response.data;
        if (this.inData) {
          this.Form.patchValue({ catalogo_subtema_id: this.inData.catalogo_subtema_id });
        }
      },
      responsError => {
      }
    );
  }
}
