import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraficosYEstadisticasRoutingModule } from './graficos-y-estadisticas-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { GraficosYEstadisticasComponent } from './graficos-y-estadisticas.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { InformesComponent } from './components/informes/informes.component';
import { InformesEncuestaComponent } from './components/informes-encuesta/informes-encuesta.component';



@NgModule({
  declarations: [ GraficosYEstadisticasComponent, InformesComponent, InformesEncuestaComponent ],
  imports: [
    CommonModule,
    GraficosYEstadisticasRoutingModule,
    SharedModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule
  ]
})
export class GraficosYEstadisticasModule { }
