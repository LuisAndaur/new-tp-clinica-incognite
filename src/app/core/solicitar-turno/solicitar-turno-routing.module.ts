import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SolicitarTurnoComponent } from './solicitar-turno.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { isAdminGuard } from 'src/app/guards/is-admin.guard';
import { isPacienteGuard } from 'src/app/guards/is-paciente.guard';

const routes: Routes = [
  { path: '', component: SolicitarTurnoComponent, canActivate: [ authGuard, isAdminGuard, isPacienteGuard ] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SolicitarTurnoRoutingModule { }
