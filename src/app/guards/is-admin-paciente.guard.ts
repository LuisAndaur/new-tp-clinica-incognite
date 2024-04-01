import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../shared/services/localstorage.service';

export const isAdminPacienteGuard: CanActivateFn = (route, state) => {
  const local = inject(LocalstorageService);
  const router = inject(Router);

  const usuario = local.getItem('usuario');
  if(usuario.tipo === 'administrador' || usuario.tipo === 'paciente'){
    return true;
  }

  router.navigate(["/bienvenida"]);
  return false;
};
