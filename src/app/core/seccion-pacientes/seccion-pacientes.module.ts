import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionPacientesRoutingModule } from './seccion-pacientes-routing.module';
import { SeccionPacientesComponent } from './seccion-pacientes.component';



@NgModule({
  declarations: [ SeccionPacientesComponent ],
  imports: [
    CommonModule,
    SeccionPacientesRoutingModule
  ]
})
export class SeccionPacientesModule { }
