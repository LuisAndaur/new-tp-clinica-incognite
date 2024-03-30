import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../shared/services/localstorage.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const local = inject(LocalstorageService);
  const router = inject(Router);

  const usuario = local.getItem('usuario');
  if(usuario.tipo != 'administrador'){
    router.navigate(["/bienvenida"]);
    return false;
  }
  return true;
};
