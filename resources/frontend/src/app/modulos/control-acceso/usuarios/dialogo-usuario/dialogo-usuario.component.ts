import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AVATARS } from 'src/app/avatars';
import { USER_STATUS_CATALOG } from '../userStatus';
import { UsuariosService } from '../usuarios.service';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { CustomValidator } from 'src/app/utils/classes/custom-validator';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { TabPermissionsComponent } from '../inner-components/tab-permissions/tab-permissions.component';
import { TabRolesComponent } from '../inner-components/tab-roles/tab-roles.component';
import { RestService } from 'src/app/shared/rest/rest.service';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-dialogo-usuario',
  templateUrl: './dialogo-usuario.component.html',
  styleUrls: ['./dialogo-usuario.component.css']
})
export class DialogoUsuarioComponent implements OnInit, OnDestroy {
  @ViewChild('inputPassword') inputPassword: ElementRef;
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  @ViewChild(TabPermissionsComponent) tabPermissions: TabPermissionsComponent;
  @ViewChild(TabRolesComponent) tabRoles: TabRolesComponent;

  constructor(
    public dialogRef: MatDialogRef<DialogoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private rest: RestService,
    private usuariosService: UsuariosService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
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

  destroyed = new Subject<void>();
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);

  isLoading:boolean;
  isSaving:boolean;
  isSendingEmail:boolean;
  dialogMaxSize:boolean;
  departamentos:any = [];
  subtemas:any = [];

  isRoot:boolean;

  savedData:boolean;

  formUsuario:FormGroup;
  configPass:boolean;
  hidePassword:boolean;
  hideConfirmPassword:boolean;
  changesDetected:boolean;
  
  avatarsList: any[];
  selectedAvatar:string;
  avatarRowCount:number;

  statusUser:number;
  statusDesc:any = USER_STATUS_CATALOG;

  lastLogin:any;

  listaGrupos:any[];
  listaTema:any[] = [];

  ngOnInit(): void {
    this.savedData = false;
    this.isLoading = true;
    this.dialogRef.addPanelClass('no-padding-dialog');
    this.hidePassword = true;
    this.hideConfirmPassword = true;
    this.avatarsList = AVATARS;
    this.selectedAvatar = this.avatarsList[0].file;
    this.avatarRowCount = 10;
    this.changesDetected = false;
    this.listaGrupos = [];

    this.formUsuario = this.formBuilder.group({
      'id':                         [''],
      'name':                       ['',Validators.required],
      'email':                      ['',[Validators.required, Validators.email]],
      'username':                   ['',[Validators.required, Validators.minLength(4)]],
      'catalogo_departamento_id':   ['',[Validators.required]],
      'catalogo_subtema_id':        ['',[Validators.required]],
      'avatar':                     [this.selectedAvatar],
      'status':                     [''],
      'mail_password':              [true],
      'roles':                      [[]],
      'permissions':                [{}],
      'acceso_unidades':            [{}],
    });

    this.usuariosService.obtenerCatalogosUsuarios().subscribe({
      next: (response:any) => {
        let catalogos:any = response.data;
        
        

        this.listaGrupos = response.data.grupos;

        if(catalogos.permisos){
          this.tabPermissions.initCatalogPermisssions(catalogos.permisos);
        }

        if(catalogos.roles){
          this.tabRoles.initCatalogRoles(catalogos.roles);
        }

        if(this.inData.id){
          this.usuariosService.verUsuario(this.inData.id).subscribe({
            next: (response:any)=>{
              this.formUsuario.patchValue(response.data);

              this.isRoot = response.data.is_superuser;

              if(response.data.permissions.length > 0){
                this.tabPermissions.loadPermissions(response.data.permissions);
              }
              
              if(response.data.roles.length > 0){
                let cargar_roles:any[] = [];
                response.data.roles.forEach(role => {
                  let local_role:any = catalogos.roles.find(x => x.id == role.id);
                  cargar_roles.push(local_role);
                  this.tabPermissions.insertRolePermissions(local_role);
                });
                this.tabRoles.loadRoles(cargar_roles);
              }
              
              this.formUsuario.markAllAsTouched();
              this.setConfigForm();
              this.selectedAvatar = response.data.avatar;
              this.statusUser = response.data.status;
              this.lastLogin = response.data.last_login_at;
              this.isLoading = false;
              
              response.data.rel_sub_tema.forEach(element => {
                this.listaTema.push(element.catalogo_subtema_id);
              });

              if(response.data.rel_sub_tema.length > 0){
                let depto = response.data.rel_sub_tema[0].sub_tema.catalogo_departamento_id;
                this.formUsuario.patchValue({ catalogo_departamento_id: depto });
                this.select_detpo(depto);
              }
            },
            error: (response:any)=>{
              this.alertPanel.showError(response.error.message);
              this.isLoading = false;
            }
          });
        }else{
          this.setConfigForm();
          this.isLoading = false;
        }
      },
      error: (response:any) => {
        this.alertPanel.showError(response.error.message);
        this.isLoading = false;
      }
    })

    this.cargarDepartamento();
  }

  ngAfterViewInit(){
    if(this.currentScreenSize == 'sm' || this.currentScreenSize == 'xs'){
      this.resizeDialog();
      if(this.currentScreenSize == 'xs'){
        this.avatarRowCount = 4;
      }else{
        this.avatarRowCount = 8;
      }
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  seleccionOpcion(valor)
  {
    let indice = this.listaTema.indexOf(valor);
    
    if(indice == -1)
    {
      this.listaTema.push(valor);
    }else{
      this.listaTema.splice(indice, 1);
    }
  }

  setConfigForm(){
    this.formUsuario.valueChanges.subscribe(
      changes => {
        this.changesDetected = true;
      }
    );
  }

  toggleConfigPass(){
    if(!this.configPass){
      if(!this.formUsuario.get('password')){
        this.hidePassword = true;
        this.hideConfirmPassword = true;
        this.formUsuario.addControl('password',new FormControl('',[Validators.required, Validators.minLength(8)]));
        this.formUsuario.addControl('confirm_password',new FormControl('',[Validators.required,CustomValidator.fieldMatchValidator('password')]));
        this.formUsuario.addControl('valid_password',new FormControl(false,Validators.requiredTrue))

        setTimeout (() => {
          if(this.inputPassword){
            this.inputPassword.nativeElement.focus();
          }
        }, 10);
      }
      this.formUsuario.get('mail_password').patchValue(false);
    }else{
      if(this.formUsuario.get('password')){
        this.formUsuario.removeControl('confirm_password');
        this.formUsuario.removeControl('password');
        this.formUsuario.removeControl('valid_password');
      }
      this.formUsuario.get('mail_password').patchValue(true);
    }
    this.configPass = !this.configPass;
  }

  cambiarStatus(status:number){
    let message:string;
    let icon:string;
    let btn_text:string;
    let color:string;

    if(status == 4){
      message = 'Esta seguro de Banear a este usuario?';
      btn_text = 'Banear';
      icon = 'block';
      color = 'warn';
    }else{
      message = 'Esta seguro de Activar a este usuario?';
      btn_text = 'Activar';
      icon = 'done_outline';
      color = 'primary';
    }

    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Modificar Estatus',message: message, hasOKBtn:true, btnColor: color, btnText: btn_text, btnIcon:icon}
    });
    //data:{message: 'Se enviara un correo electronico para que el usuario pueda restaurar su contraseña', hasOKBtn:true, btnText:'Enviar Correo', btnIcon:'send'}
    let params:any = {status: status};
    
    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.isSaving = true;
        this.usuariosService.cambiarStatus(this.inData.id,params).subscribe(
          response => {
            this.isSaving = false;
            this.statusUser = response.status;
            this.savedData = true;
          }
        );
      }
    });
  };

  guardarUsuario(status?:number){
    this.alertPanel.closePanel();
    if(this.formUsuario.valid || status){
      this.isSaving = true;

      if(status){
        this.formUsuario.get('status').patchValue(status);
      }

      let valueForm:any = this.formUsuario.value;

      let roles:any[] = this.tabRoles.getSelectedRolesIds();
      valueForm.roles = roles;

      let permissions_full:any = this.tabPermissions.getSelectedPermissions();
      let permissions:any = {};
      for (const key in permissions_full) {
        if (Object.prototype.hasOwnProperty.call(permissions_full, key)) {
          const element = permissions_full[key];
          if(element.roles.length == 0){
            permissions[key] = {status:true};
          }else if(!element.active){
            permissions[key] = {status:false};
          }
        }
      }
      valueForm.permissions = permissions;

      this.usuariosService.guardarUsuario(valueForm).subscribe({
        next:(response:any)=>{
          this.isSaving = false;
          this.statusUser = response.data.status;
          this.inData.id = response.data.id;
          this.formUsuario.get('id').patchValue(response.data.id);
          this.formUsuario.get('status').patchValue(response.data.status);
          this.changesDetected = false;

          
          if(response.hasOwnProperty('mail_sent')){
            if(response.mail_sent){
              this.alertPanel.showSuccess('Datos Guardados. Se envió Correo de Confirmación de cuenta.',3);
            }else{
              this.alertPanel.showWarning('Datos Guardados. Ocurrio un error al enviar el Correo de Confirmación de cuenta.');
            }
          }else{
            this.alertPanel.showSuccess('Datos guardados con éxito',3);
          }

          this.savedData = true;
        },
        error:(response:any)=>{
          if(response.error.error_type == 'form_validation'){
            for (const key in response.error.data) {
              if (Object.prototype.hasOwnProperty.call(response.error.data, key)) {
                const element = response.error.data[key];
                let error:any = {};
                error[element] = true;
                this.formUsuario.get(key).setErrors(error);
              }
            }
            this.alertPanel.showError(response.error.message);
          }else{
            this.alertPanel.showError(response.error.message);
          }
          this.isSaving = false;
        }
      });
    }
  }

  enviarCorreo(){
    if(this.formUsuario.get('email').valid){
      let dialogConfig:any = {
        data:{message: 'Se enviara un correo electronico para que el usuario pueda restaurar su contraseña', hasOKBtn:true, btnText:'Enviar Correo', btnIcon:'send'}
      };

      const dialogRef = this.dialog.open(DialogConfirmActionComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.isSendingEmail = true;
          let params:any = {user_email:this.formUsuario.get('email').value};

          this.usuariosService.enviarCorreoRestaurar(params).subscribe({
            next: (response:any)=>{
              console.log('mailto',response);
              this.isSendingEmail = false;
              this.alertPanel.showInfo('Se envió Correo Electrónico con éxito',3);
            },
            error: (response:any)=>{
              if(response.error.message){
                this.alertPanel.showError(response.error.message);
              }else{
                this.alertPanel.showError('Error al enviar Correo Electrónico');
              }
              this.isSendingEmail = false;
            }
          });
        }
      });
    }
  }
   
  
  addFromRole(role){
    this.tabPermissions.insertRolePermissions(role);
  }

  removeFromRole(role){
    this.tabPermissions.removeRolePermissions(role);
  }

  selectAvatar(file:string){
    this.selectedAvatar = file;
    this.formUsuario.get('avatar').patchValue(file);
  }

  passwordValid(event){
    this.formUsuario.get('valid_password').patchValue(event);
    this.formUsuario.get('confirm_password').patchValue('');
    if(!event){
      this.formUsuario.get('password').setErrors({'lowstrenght':true});
    }
  }

  cargarDepartamento()
    {
      return this.rest.get("departamento",{}).subscribe({
        next:(response:any) => {
          this.departamentos = response.data;
        },
        error:(response:any) => {
          this.alertPanel.showError(response.error.message);
          
        }
      });
    }

  select_detpo(id:number) {
    let obj = this.departamentos.find(x => x.id == id);
    this.subtemas =  obj.sub_tema;
    console.log(this.listaTema);
    this.formUsuario.patchValue({catalogo_subtema_id:this.listaTema});
  }

  resizeDialog(){
    if(!this.dialogMaxSize){
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    }else{
      this.dialogRef.updateSize('80%','60%');
      this.dialogMaxSize = false;
    }
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }

}
