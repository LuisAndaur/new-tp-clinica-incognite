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
import { CaptchaDirective } from './directives/captcha.directive';
import { RecaptchaModule } from "ng-recaptcha";
import { CaptchaComponent } from './components/captcha/captcha.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavbarComponent,
    BienvenidaComponent,
    ErrorComponent,
    SpinnerComponent,
    CaptchaComponent,
    FechaFullPipe,
    CaptchaDirective
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
    CaptchaDirective
  ]
})
export class SharedModule { }
