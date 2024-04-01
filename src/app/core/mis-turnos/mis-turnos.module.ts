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
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import { CargarHistoriaClinicaComponent } from '../cargar-historia-clinica/cargar-historia-clinica.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { EncuestaComponent } from '../encuesta/encuesta.component';
import { MatSelectModule } from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [ 
    MisTurnosComponent,
    MisTurnosPacienteComponent,
    MisTurnosEspecialistaComponent,
    CargarHistoriaClinicaComponent,
    EncuestaComponent
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
    MatSlideToggleModule,
    MatSliderModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule
  ]
})
export class MisTurnosModule { }
