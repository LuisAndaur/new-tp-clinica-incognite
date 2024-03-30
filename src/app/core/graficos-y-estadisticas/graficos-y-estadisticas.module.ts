import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraficosYEstadisticasRoutingModule } from './graficos-y-estadisticas-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { GraficosYEstadisticasComponent } from './graficos-y-estadisticas.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [ GraficosYEstadisticasComponent ],
  imports: [
    CommonModule,
    GraficosYEstadisticasRoutingModule,
    SharedModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class GraficosYEstadisticasModule { }
