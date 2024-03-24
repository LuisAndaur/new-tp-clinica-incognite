import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos.component';
import { MisTurnosPacienteComponent } from '../mis-turnos-paciente/mis-turnos-paciente.component';
import { MisTurnosEspecialistaComponent } from '../mis-turnos-especialista/mis-turnos-especialista.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [ 
    MisTurnosComponent,
    MisTurnosPacienteComponent,
    MisTurnosEspecialistaComponent
   ],
  imports: [
    CommonModule,
    MisTurnosRoutingModule,
    SharedModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ]
})
export class MisTurnosModule { }
