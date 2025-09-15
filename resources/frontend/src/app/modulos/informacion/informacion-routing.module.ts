import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaInformacionComponent } from './lista-informacion/lista-informacion.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
    { path: 'informacion',           component: ListaInformacionComponent,          canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformacionRoutingModule { }
