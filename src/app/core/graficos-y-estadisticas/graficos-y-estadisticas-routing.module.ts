import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GraficosYEstadisticasComponent } from './graficos-y-estadisticas.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { isAdminGuard } from 'src/app/guards/is-admin.guard';

const routes: Routes = [
  { path: '', component: GraficosYEstadisticasComponent, canActivate: [ authGuard, isAdminGuard ] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class GraficosYEstadisticasRoutingModule { }
