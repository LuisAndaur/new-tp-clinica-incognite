import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { NavbarComponent } from './components/navbar/navbar.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { ErrorComponent } from './components/error/error.component';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FechaFullPipe } from '../pipes/fecha-full.pipe';

@NgModule({
  declarations: [
    NavbarComponent,
    BienvenidaComponent,
    ErrorComponent,
    SpinnerComponent,
    FechaFullPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    NavbarComponent,
    BienvenidaComponent,
    ErrorComponent,
    SpinnerComponent,
    FechaFullPipe
  ]
})
export class SharedModule { }
