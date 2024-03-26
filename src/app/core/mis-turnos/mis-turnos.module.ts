import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos.component';
import { MisTurnosPacienteComponent } from '../mis-turnos-paciente/mis-turnos-paciente.component';
import { MisTurnosEspecialistaComponent } from '../mis-turnos-especialista/mis-turnos-especialista.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import { CargarHistoriaClinicaComponent } from '../cargar-historia-clinica/cargar-historia-clinica.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ 
    MisTurnosComponent,
    MisTurnosPacienteComponent,
    MisTurnosEspecialistaComponent,
    CargarHistoriaClinicaComponent
   ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MisTurnosRoutingModule,
    SharedModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule
  ]
})
export class MisTurnosModule { }
