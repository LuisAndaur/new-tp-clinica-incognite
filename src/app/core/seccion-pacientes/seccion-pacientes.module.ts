import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionPacientesRoutingModule } from './seccion-pacientes-routing.module';
import { SeccionPacientesComponent } from './seccion-pacientes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [ SeccionPacientesComponent ],
  imports: [
    CommonModule,
    SeccionPacientesRoutingModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
  ]
})
export class SeccionPacientesModule { }
