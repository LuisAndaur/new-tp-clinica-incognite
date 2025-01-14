import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionUsuariosRoutingModule } from './seccion-usuarios-routing.module';
import {MatTableModule} from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { SeccionUsuariosComponent } from './seccion-usuarios.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [ SeccionUsuariosComponent],
  imports: [
    CommonModule,
    SeccionUsuariosRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    SharedModule,
    AuthModule
  ]
})
export class SeccionUsuariosModule { }
