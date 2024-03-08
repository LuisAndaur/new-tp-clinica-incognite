import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { noAuthdGuard } from '../guards/no-guard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ noAuthdGuard ] },
  { path: 'registro', component: RegistroComponent, canActivate: [ noAuthdGuard ] }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthRoutingModule { }
