import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PanelPrincipalComponent } from './panel-principal/panel-principal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [PanelPrincipalComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChartModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
