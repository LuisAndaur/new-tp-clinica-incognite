import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResgistroAdminComponent } from './components/resgistro-admin/resgistro-admin.component';
import { ResgistroPacienteComponent } from './components/resgistro-paciente/resgistro-paciente.component';
import { ResgistroEspecialistaComponent } from './components/resgistro-especialista/resgistro-especialista.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { SharedModule } from '../shared/shared.module';
import { RecaptchaModule } from 'ng-recaptcha';
import { CaptchaDirective } from '../shared/directives/captcha.directive';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    ResgistroAdminComponent,
    ResgistroPacienteComponent,
    ResgistroEspecialistaComponent,
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    NgxMatFileInputModule,
    SharedModule,
    RecaptchaModule,
    TranslateModule
  ],
  exports: [
    LoginComponent,
    ResgistroAdminComponent,
    ResgistroPacienteComponent,
    ResgistroEspecialistaComponent
  ],
})
export class AuthModule { }
