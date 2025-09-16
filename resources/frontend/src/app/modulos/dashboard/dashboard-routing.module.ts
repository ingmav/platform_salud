import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelPrincipalComponent } from './panel-principal/panel-principal.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  { path: 'dashboard',           component: PanelPrincipalComponent,          canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
