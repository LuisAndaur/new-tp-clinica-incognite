import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SeccionPacientesComponent } from './seccion-pacientes.component';
import { authGuard } from 'src/app/guards/auth.guard';
import { isEspecialistaGuard } from 'src/app/guards/is-especialista.guard';

const routes: Routes = [
  { path: '', component: SeccionPacientesComponent, canActivate: [ authGuard, isEspecialistaGuard ] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SeccionPacientesRoutingModule { }
