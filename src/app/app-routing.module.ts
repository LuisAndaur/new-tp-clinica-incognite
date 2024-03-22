import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './shared/components/bienvenida/bienvenida.component';
import { ErrorComponent } from './shared/components/error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule) },
  { path: 'seccion-usuarios', loadChildren: () => import('./core/seccion-usuarios/seccion-usuarios.module').then( m => m.SeccionUsuariosModule) },
  { path: 'mi-perfil', loadChildren: () => import('./core/mi-perfil/mi-perfil.module').then( m => m.MiPerfilModule) },
  { path: 'error', component: ErrorComponent},
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
