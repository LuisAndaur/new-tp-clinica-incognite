import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiPerfilRoutingModule } from './mi-perfil-routing.module';
import { MiPerfilComponent } from './mi-perfil.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [ MiPerfilComponent ],
  imports: [
    CommonModule,
    MiPerfilRoutingModule,
    MatCardModule,
    MatButtonModule,
    SharedModule,
  ]
})
export class MiPerfilModule { }
