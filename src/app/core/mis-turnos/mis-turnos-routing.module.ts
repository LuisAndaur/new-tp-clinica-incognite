import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisTurnosComponent } from './mis-turnos.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { isEspecialistaPacienteGuard } from 'src/app/guards/is-especialista-paciente.guard';

const routes: Routes = [
  { path: '', component: MisTurnosComponent, canActivate: [ authGuard, isEspecialistaPacienteGuard ] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MisTurnosRoutingModule { }
