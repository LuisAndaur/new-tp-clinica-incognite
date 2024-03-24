import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitarTurnoRoutingModule } from './solicitar-turno-routing.module';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { SolicitarTurnoComponent } from './solicitar-turno.component';



@NgModule({
  declarations: [ SolicitarTurnoComponent ],
  imports: [
    CommonModule,
    SolicitarTurnoRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class SolicitarTurnoModule { }
