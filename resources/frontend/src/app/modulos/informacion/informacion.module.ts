import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformacionRoutingModule } from './informacion-routing.module';
import { ListaInformacionComponent } from './lista-informacion/lista-informacion.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListaInformacionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InformacionRoutingModule
  ]
})
export class InformacionModule { }
