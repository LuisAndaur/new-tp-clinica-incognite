import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SeccionPacientesComponent } from './seccion-pacientes.component';
import { authGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: SeccionPacientesComponent, canActivate: [ authGuard ] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SeccionPacientesRoutingModule { }
