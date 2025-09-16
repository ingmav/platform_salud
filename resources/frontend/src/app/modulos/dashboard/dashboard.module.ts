import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PanelPrincipalComponent } from './panel-principal/panel-principal.component';
import { GraficaBarrasComponent } from 'src/app/shared/components/graficas/grafica-barras/grafica-barras.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [PanelPrincipalComponent],
  imports: [
    CommonModule,
    SharedModule,
    GraficaBarrasComponent,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
