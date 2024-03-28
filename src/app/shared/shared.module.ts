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
import { FechaFullPipe } from './pipes/fecha-full.pipe';
import { CaptchaDirective } from './directives/captcha.directive';
import { RecaptchaModule } from "ng-recaptcha";
import { CaptchaComponent } from './components/captcha/captcha.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadoDirective } from './directives/estado.directive';
import { HorariosComponent } from './components/horarios/horarios.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { FormatoDniPipe } from './pipes/formato-dni.pipe';
import { SliceHcPipe } from './pipes/slice-hc.pipe';
import { DecimalDirective } from './directives/decimal.directive';
import { SiNoPipe } from './pipes/si-no.pipe';
import { VerHistoriaClinicaComponent } from './components/ver-historia-clinica/ver-historia-clinica.component';

@NgModule({
  declarations: [
    NavbarComponent,
    BienvenidaComponent,
    ErrorComponent,
    SpinnerComponent,
    CaptchaComponent,
    FechaFullPipe,
    FormatoDniPipe,
    SliceHcPipe,
    SiNoPipe,
    CaptchaDirective,
    EstadoDirective,
    DecimalDirective,
    HorariosComponent,
    VerHistoriaClinicaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    RecaptchaModule
  ],
  exports: [
    NavbarComponent,
    BienvenidaComponent,
    ErrorComponent,
    CaptchaComponent,
    SpinnerComponent,
    FechaFullPipe,
    FormatoDniPipe,
    SliceHcPipe,
    SiNoPipe,
    CaptchaDirective,
    EstadoDirective,
    DecimalDirective,
    HorariosComponent,
    VerHistoriaClinicaComponent
  ]
})
export class SharedModule { }
