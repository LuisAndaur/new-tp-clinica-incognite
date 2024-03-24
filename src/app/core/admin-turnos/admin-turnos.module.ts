import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTurnosRoutingModule } from './admin-turnos-routing.module';
import { AdminTurnosComponent } from './admin-turnos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [ AdminTurnosComponent ],
  imports: [
    CommonModule,
    AdminTurnosRoutingModule,
    SharedModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ]
})
export class AdminTurnosModule { }
