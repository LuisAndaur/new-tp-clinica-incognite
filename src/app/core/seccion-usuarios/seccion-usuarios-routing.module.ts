import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SeccionUsuariosComponent } from './seccion-usuarios.component';
import { authGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: SeccionUsuariosComponent, canActivate: [ authGuard ] },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SeccionUsuariosRoutingModule { }
